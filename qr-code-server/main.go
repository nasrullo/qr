package main

import (
	"encoding/json"
	"errors"
	"fmt"
	swagger "github.com/arsmn/fiber-swagger/v2"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"io/ioutil"
	"log"
	"net/url"
	"qr-code-server/config"
	_ "qr-code-server/docs"
	"qr-code-server/utils"
	"strings"
	"time"
)

type User struct {
	Id       string `json:"id"`
	Name     string `json:"name"`
	Password string `json:"password"`
	Login    string `json:"login"`
	Type     string `json:"type"`
	Email    string `json:"email"`
	Age      int    `json:"age"`
}

type RequestLogin struct {
	Password string `json:"password"`
	Login    string `json:"login"`
}
type ResponseUser struct {
	Email    string `json:"email"`
	Age      int    `json:"age"`
	Name     string `json:"name"`
	TypeUser string `json:"type"`
}
type ResponseLogin struct {
	Token string `json:"token"`
}

// @title QR login API
// @version 1.0
// @description API Server

// @securityDefinitions.apikey Bearer
// @in header
// @name Authorization
// @schemes http
// @host localhost:3000
// @BasePath /
func main() {

	if err := config.Init(); err != nil {
		log.Fatal(err)
	}

	app := fiber.New()
	utils.Socket(app)
	SwaggerRoute(app)
	app.Use(cors.New())
	app.Get("", func(ctx *fiber.Ctx) error {
		return ctx.Redirect("/swagger/index.html")
	})
	app.Post("login", login)

	app.Post("login-qr/:uuid", JWT(), loginQr)

	app.Get("info", JWT(), info)

	if err := app.Listen("0.0.0.0:3000"); err != nil {
		log.Fatal(err)
	}
}

// @Summary Login
// @Tags Auth
// @Description Login
// @ID login
// @Accept json
// @Produce json
// @Success 200 {object} ResponseLogin
// @Router /login [post]
func login(ctx *fiber.Ctx) error {
	body := RequestLogin{}
	if err := ctx.BodyParser(&body); err != nil {
		return err
	}
	user, err := getUser(body.Login, body.Password)
	if err != nil {
		return err
	}
	token, err := utils.CreateToken(user.Id, config.PrivateKey, time.Minute*10)
	return ctx.JSON(ResponseLogin{
		Token: token,
	})
}

// @Summary Login QR
// @Tags Auth
// @Security Bearer
// @Description Login QR
// @ID login-qr
// @Accept json
// @Produce json
// @Success 200 {object} ResponseMessage
// @Router /login-qr/{uuid} [post]
func loginQr(ctx *fiber.Ctx) error {
	uuid := ctx.Params("uuid")
	if uuid == "" {
		return errors.New("invalid uuid")
	}
	log.Printf("UUID %s", uuid)
	uuid, _ = url.QueryUnescape(uuid)
	uuid = strings.TrimSpace(uuid)
	client := utils.Conn[uuid]
	if client == nil {
		return ctx.SendStatus(fiber.StatusBadRequest)
	}
	id := string(ctx.Response().Header.Peek("id"))
	user, err := getUserById(id)
	if err != nil {
		return err
	}
	token, err := utils.CreateToken(user.Id, config.PrivateKey, time.Minute*10)
	if err != nil {
		return err
	}

	utils.SendMessage(uuid, utils.WSMessage{
		Name: "token",
		Data: []byte(token),
	})
	return ctx.JSON(client)
}

// @Summary Info current user
// @Tags Account
// @Security Bearer
// @Description Info current user
// @ID info-user
// @Accept json
// @Produce json
// @Success 200 {object} ResponseUser
// @Router /info [get]
func info(ctx *fiber.Ctx) error {
	id := string(ctx.Response().Header.Peek("id"))
	user, err := getUserById(id)
	if err != nil {
		return err
	}
	return ctx.JSON(ResponseUser{
		Name:     user.Name,
		TypeUser: user.Type,
		Age:      user.Age,
		Email:    user.Email,
	})
}
func getUser(login, pass string) (*User, error) {
	data, err := ioutil.ReadFile("db/users.json")
	if err != nil {
		return nil, err
	}
	users := make([]User, 0)
	err = json.Unmarshal(data, &users)
	if err != nil {
		return nil, err
	}
	for _, u := range users {
		if u.Login == login && u.Password == pass {
			return &u, nil
		}
	}
	return nil, fmt.Errorf("login or passwod are inavlid")

}
func getUserById(id string) (*User, error) {
	data, err := ioutil.ReadFile("db/users.json")
	if err != nil {
		return nil, err
	}
	users := make([]User, 0)
	err = json.Unmarshal(data, &users)
	if err != nil {
		return nil, err
	}
	for _, u := range users {
		if u.Id == id {
			return &u, nil
		}
	}
	return nil, fmt.Errorf("login or passwod are inavlid")

}
func JWT() fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		f := ctx.Get(fiber.HeaderAuthorization)
		if f != "" {
			s := strings.Split(f, " ")
			if len(s) < 2 {
				return Unauthorized(ctx)
			}
			if p, err := utils.VerifyToken(s[1], &config.PrivateKey.PublicKey); err == nil && p.Identity != "" {
				ctx.Append("id", p.Identity)
				return ctx.Next()
			} else {
				return Unauthorized(ctx)
			}
		}
		return Unauthorized(ctx)
	}
}
func Unauthorized(_ *fiber.Ctx) error {
	err := fiber.ErrUnauthorized
	return err
}
func SwaggerRoute(a fiber.Router) {
	route := a.Group("/swagger")
	route.Get("*", swagger.Handler) // get one user by ID
}
