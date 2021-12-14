package models

import (
	"gorm.io/gorm"
)

type EmailVerification struct {
	gorm.Model
	Email string `gorm:"email" json:"email"`
	Token string `gorm:"token" json:"token"`
	Used  bool   `gorm:"used; default:False;" json:"used"`
}

func (s *EmailVerification) TableName() string {
	return "email_verification"
}
