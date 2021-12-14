package models

import (
	"gorm.io/gorm"
)

type PasswordRecoveryRequest struct {
	gorm.Model
	Email string `gorm:"email" json:"email"`
	Token string `gorm:"token" json:"token"`
	Used  bool   `gorm:"used; default:False;" json:"used"`
}

func (s *PasswordRecoveryRequest) TableName() string {
	return "password_recovery_request"
}
