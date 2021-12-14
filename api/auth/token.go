package auth

import (
	"comp-performance/api/models"
	"comp-performance/api/responses"
	"comp-performance/api/utils/types"
	"comp-performance/config"
	"errors"
	// "fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/dgrijalva/jwt-go/request"
	"net/http"
	"time"
)

// GenerateJWT Token
func GenerateJWT(user models.User) (string, error) {
	claim := types.Claim{
		User: user,
		StandardClaims: jwt.StandardClaims{
			Issuer:    "comp-performance",
			ExpiresAt: time.Now().Add(time.Hour * 24 * 7).Unix(), // 7 days
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claim)
	return token.SignedString(config.SECRETKEY)

}

// GenerateJWTEmailToken Token
func GenerateJWTEmailToken(email string) (string, error) {
	claim := types.EmailVerificationClaim{
		Email: email,
		StandardClaims: jwt.StandardClaims{
			Issuer:    "comp-performance",
			ExpiresAt: time.Now().Add(time.Hour * 24).Unix(), // 1 day
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claim)
	return token.SignedString(config.SECRETKEY)

}

// ExtractToken from the request
func ExtractToken(w http.ResponseWriter, r *http.Request) *jwt.Token {
	token, err := request.ParseFromRequestWithClaims(
		r,
		request.OAuth2Extractor,
		&types.Claim{},
		func(t *jwt.Token) (interface{}, error) {
			return config.SECRETKEY, nil
		},
	)

	// fmt.Println("Extracting token", token, err)

	if err != nil {
		code := http.StatusUnauthorized
		switch err.(type) {
		case *jwt.ValidationError:
			{
				vError := err.(*jwt.ValidationError)
				switch vError.Errors {
				case jwt.ValidationErrorExpired:
					err = errors.New("your token has expired")
					responses.ERROR(w, code, err)
					return nil

				case jwt.ValidationErrorSignatureInvalid:
					err = errors.New("signature is invalid")
					responses.ERROR(w, code, err)
					return nil

				default:
					responses.ERROR(w, code, err)
					return nil

				}
			}

		default:
			responses.ERROR(w, code, err)
			return nil
		}
	}

	return token
}

// ParseTokenString from the request
func ParseTokenString(t string) (*jwt.Token, error) {
	token, err := jwt.ParseWithClaims(
		t,
		&types.EmailVerificationClaim{},
		func(t *jwt.Token) (interface{}, error) {
			return config.SECRETKEY, nil
		},
	)

	// fmt.Println("Extracting token", token, err)

	if err != nil {
		switch err.(type) {
		case *jwt.ValidationError:
			{
				vError := err.(*jwt.ValidationError)
				switch vError.Errors {
				case jwt.ValidationErrorExpired:
					err = errors.New("your token has expired")
					return token, err

				case jwt.ValidationErrorSignatureInvalid:
					err = errors.New("signature is invalid")
					return token, err

				default:
					return token, err
				}
			}

		default:
			return token, err
		}
	}

	return token, nil
}
