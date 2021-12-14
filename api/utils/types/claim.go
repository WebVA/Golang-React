package types

import (
	"comp-performance/api/models"
	"github.com/dgrijalva/jwt-go"
)

// Claim is the token payload
type Claim struct {
	User models.User `json:"user"`
	jwt.StandardClaims
}

//EmailVerificationClaim is the token payload
type EmailVerificationClaim struct {
	Email string `json:"email"`
	jwt.StandardClaims
}
