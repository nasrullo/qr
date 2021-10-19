package utils

import (
	"bufio"
	"bytes"
	"crypto/rsa"
	"crypto/x509"
	"encoding/pem"
	"fmt"
	"os"
)

// utilities to export keypair
func privateKeyToPem(key *rsa.PrivateKey) ([]byte, error) {
	var privateKeyBytes []byte = x509.MarshalPKCS1PrivateKey(key)
	privateKeyBlock := &pem.Block{
		Type:  "RSA PRIVATE KEY",
		Bytes: privateKeyBytes,
	}
	b := bytes.NewBuffer([]byte{})
	w := bufio.NewWriter(b)
	err := pem.Encode(w, privateKeyBlock)
	if err != nil {
		return nil, err
	}
	return b.Bytes(), nil
}
func publicKeyToPem(key *rsa.PublicKey) ([]byte, error) {
	publicKeyBytes, err := x509.MarshalPKIXPublicKey(key)
	if err != nil {
		fmt.Printf("error when dumping publickey: %s \n", err)
		os.Exit(1)
	}
	publicKeyBlock := &pem.Block{
		Type:  "PUBLIC KEY",
		Bytes: publicKeyBytes,
	}
	b := bytes.NewBuffer([]byte{})
	w := bufio.NewWriter(b)
	err = pem.Encode(w, publicKeyBlock)
	if err != nil {
		return nil, err
	}
	return b.Bytes(), nil
}
