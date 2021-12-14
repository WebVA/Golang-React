package models

import (
	"gorm.io/gorm"
)

type AppOptions struct {
	gorm.Model
	Key   string `gorm:"key; primaryKey;" json:"key"`
	Value string `gorm:"value" json:"value"`
}

func (s *AppOptions) TableName() string {
	return "app_options"
}
