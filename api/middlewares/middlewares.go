package middlewares

import (
	"comp-performance/api/auth"
	"comp-performance/api/responses"
	"comp-performance/api/utils/types"
	"context"

	// "encoding/json"
	"errors"
	// "fmt"
	"log"
	"net/http"
)

type UserKey string

// SetMiddlewareLogger will log all request details to the terminal
func SetMiddlewareLogger(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s \t %s \t %s \t %s", r.Method, r.Host, r.RequestURI, r.Proto)
		next(w, r)
	}
}

// SetMiddlewareJSON will convert response type from text to json
func SetMiddlewareJSON(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		next(w, r)
	}
}

// SetMiddlewareAuthentication for authentication
func SetMiddlewareAuthentication(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		token := auth.ExtractToken(w, r)
		if token == nil {
			responses.ERROR(w, http.StatusUnauthorized, errors.New("unAuthorized"))
			return
		}
		if token.Valid {
			ctx := context.WithValue(
				r.Context(),
				UserKey("user"),
				token.Claims.(*types.Claim).User,
			)
			next(w, r.WithContext(ctx))
		}

	}
}

// SetMiddlewareAdmin for authentication
func SetMiddlewareAdmin(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		token := auth.ExtractToken(w, r)
		if token == nil {
			responses.ERROR(w, http.StatusUnauthorized, errors.New("unAuthorized"))
			return
		}
		if token.Valid {
			if claims, ok := token.Claims.(*types.Claim); ok && token.Valid {

				if claims.User.Role == "admin" {
					// fmt.Printf("%v %v", claims.User, claims.StandardClaims.ExpiresAt)
					ctx := context.WithValue(
						r.Context(),
						UserKey("user"),
						token.Claims.(*types.Claim).User,
					)
					next(w, r.WithContext(ctx))
				} else {
					responses.ERROR(w, http.StatusUnauthorized, errors.New("unAuthorized"))
					return
				}

			} else {
				responses.ERROR(w, http.StatusUnauthorized, errors.New("unAuthorized"))
				return
			}

		}

	}
}
