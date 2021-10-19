package utils

import (
	"crypto/rand"
	rsa2 "crypto/rsa"
	"testing"
	"time"
)

func TestJWTMaker(t *testing.T) {
	rsaKeyPair, err := rsa2.GenerateKey(rand.Reader, 2048)
	if err != nil {
		t.Errorf("unable to generate rsa keypair %v", err)
	}
	userId := "test"

	token, err := CreateToken(userId, rsaKeyPair, time.Second*100)
	if err != nil {
		t.Errorf("unable to create token %v", err)
	}

	payload, err := VerifyToken(token, &rsaKeyPair.PublicKey)
	if err != nil {
		t.Errorf("unable to cerify token %v", err)
	}
	if payload.Identity != userId {
		t.Errorf("wnat %s got %s", userId, payload.Identity)
	}
}
