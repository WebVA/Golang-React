package models

import (
	"gorm.io/gorm"
)

type NewsLetter struct {
	gorm.Model
	Email string `gorm:"email" json:"email"`
}

func (s *NewsLetter) TableName() string {
	return "newsletter"
}
