package models

import (
	"gorm.io/gorm"
)

// Quiz Schema
type Quiz struct {
	Question string `gorm:"column:question; not null" json:"question"`
	Option1  string `gorm:"column:option1; not null" json:"option1"`
	Option2  string `gorm:"column:option2; not null" json:"option2"`
	Option3  string `gorm:"column:option3; not null" json:"option3"`
	Option4  string `gorm:"column:option4; not null" json:"option4"`
	CorrectAnswer int `gorm:"column:correct_answer; not null" json:"correct_answer"`
	gorm.Model
}

// TableName : ticket
func (c *Quiz) TableName() string {
	return "quiz"
}
