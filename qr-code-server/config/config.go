package config

import (
	"crypto/rand"
	"crypto/rsa"
)

var PrivateKey *rsa.PrivateKey

func Init() error {
	privateKey, err := rsa.GenerateKey(rand.Reader, 1024)
	if err != nil {
		return err
	}
	PrivateKey = privateKey
	return nil
}
