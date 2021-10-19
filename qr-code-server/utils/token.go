package utils

import (
	"crypto/rsa"
	"errors"
	"github.com/dgrijalva/jwt-go"
	"time"
)

const (
	StatusTokenValid       = "The token is valid."
	StatusTokenMalformed   = "That's not even a token."
	StatusTokenExpired     = "Token expired."
	StatusTokenCouldNotHan = "Couldn't handle this token:%s"
)

type Payload struct {
	Identity  string `json:"identity"`
	IssuedAt  int64  `json:"issued_at"`
	ExpiredAt int64  `json:"expired_at"`
}

var (
	ErrInvalidToken = errors.New("token is invalid")
	ErrExpiredToken = errors.New("token has expired")
)

func (payload *Payload) Valid() error {
	if time.Now().After(time.Unix(payload.ExpiredAt, 0)) {
		return ErrExpiredToken
	}
	return nil
}

//CreateToken Create a token by given id
func CreateToken(id string, key *rsa.PrivateKey, duration time.Duration) (string, error) {
	if id == "" {
		return "", errors.New("id can not be empty")
	}
	if key == nil {
		return "", errors.New("key is required")
	}
	p := &Payload{
		Identity:  id,
		ExpiredAt: time.Now().Add(duration).Unix(),
		IssuedAt:  time.Now().Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodRS256, p)
	return token.SignedString(key)
}
func GetUserId(token string, key *rsa.PublicKey) (string, error) {
	if token == "" {
		return "", errors.New("token can not be empty")
	}
	if key == nil {
		return "", errors.New("key is required")
	}
	tk, err := VerifyToken(token, key)
	if err != nil {
		return "", err
	}
	if tk.Identity == "" {
		return tk.Identity, errors.New("identity claims is nil")
	}
	return tk.Identity, nil
}
func VerifyToken(token string, key *rsa.PublicKey) (*Payload, error) {
	if token == "" {
		return nil, errors.New("token can not be empty")
	}
	if key == nil {
		return nil, errors.New("key is required")
	}

	keyFunc := func(token *jwt.Token) (interface{}, error) {
		_, ok := token.Method.(*jwt.SigningMethodRSA)
		if !ok {
			return nil, ErrInvalidToken
		}
		return key, nil
	}
	jwtToken, err := jwt.ParseWithClaims(token, &Payload{}, keyFunc)
	if err != nil {
		verr, ok := err.(*jwt.ValidationError)
		if ok && errors.Is(verr.Inner, ErrExpiredToken) {
			return nil, ErrExpiredToken
		}
		return nil, ErrInvalidToken
	}
	payload, ok := jwtToken.Claims.(*Payload)
	if !ok {
		return nil, ErrInvalidToken
	}
	return payload, nil
}
