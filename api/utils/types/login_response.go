package types

import (
	"comp-performance/api/models"
)

// LoginResponse shapes the login response to the client
type LoginResponse struct {
	User  models.User `json:"user"`
	Token string      `json:"token"`
}
