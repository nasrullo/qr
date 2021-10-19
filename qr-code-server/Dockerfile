FROM golang:1.17-alpine as builder
COPY . /go/src/capione/qr-code-server
WORKDIR /go/src/capione/qr-code-server
RUN go mod download .
RUN go get -u github.com/swaggo/swag/cmd/swag
RUN swag init
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo .

FROM golang:1.17-alpine
RUN apk --no-cache add ca-certificates bash
RUN mkdir /app
WORKDIR /app
COPY --from=builder /go/src/capione/qr-code-server .
CMD ["./qr-code-server"]

