package utils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/antoniodipinto/ikisocket"
	"github.com/boombuler/barcode"
	"github.com/boombuler/barcode/qr"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
	"image/png"
)

type WSMessage struct {
	Name string `json:"name"`
	Data []byte `json:"data"`
}
type ClientInfo struct {
	Platform string `json:"platform"`
	App      string `json:"app"`
}

var Conn = make(map[string]*ClientInfo)

func Socket(app fiber.Router) {

	app.Use(func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
		}
		return c.Next()
	})

	ikisocket.On(ikisocket.EventConnect, func(payload *ikisocket.EventPayload) {
	})

	ikisocket.On(ikisocket.EventDisconnect, func(ep *ikisocket.EventPayload) {
		delete(Conn, ep.SocketUUID)
	})
	ikisocket.On(ikisocket.EventClose, func(ep *ikisocket.EventPayload) {
		delete(Conn, ep.SocketUUID)
	})

	ikisocket.On(ikisocket.EventMessage, func(ep *ikisocket.EventPayload) {
		client := ClientInfo{}
		err := json.Unmarshal(ep.Data, &client)
		if err != nil {
			ikisocket.EmitTo(ep.SocketUUID, []byte(err.Error()))
		}
		result, err := generateQR(ep.SocketUUID)
		if err == nil {
			Conn[ep.SocketUUID] = &client
			ikisocket.EmitTo(ep.SocketUUID, result)
		} else {
			ikisocket.EmitTo(ep.SocketUUID, []byte(err.Error()))
		}
	})

	app.Get("/ws", ikisocket.New(func(kws *ikisocket.Websocket) {

	}))

}

func SendMessage(uuid string, msg WSMessage) {
	data, err := json.Marshal(msg)
	if err != nil {
		fmt.Errorf(err.Error())
		return
	}
	ikisocket.EmitTo(uuid, data)
}

func generateQR(uuid string) ([]byte, error) {
	qrCode, _ := qr.Encode(uuid, qr.L, qr.Auto)
	qrCode, _ = barcode.Scale(qrCode, 200, 200)
	buf := new(bytes.Buffer)
	png.Encode(buf, qrCode)
	data := WSMessage{
		Name: "qr",
		Data: buf.Bytes(),
	}
	return json.Marshal(data)
}
