package models

import (
	"gorm.io/gorm"
)

// Message Model
type Message struct {
	gorm.Model
	Title   string `gorm:"column:title" json:"title"`
	Message string `gorm:"column:message" json:"message"`
}

// TableName : Category
func (c *Message) TableName() string {
	return "message"
}
