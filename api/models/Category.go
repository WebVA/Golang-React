package models

import (
	"gorm.io/gorm"
)

// Category Schema
type Category struct {
	Name  string `gorm:"column:name; not null" json:"name"`
	Image string `gorm:"column:image; not null" json:"image"`
	gorm.Model
}

// TableName : Category
func (c *Category) TableName() string {
	return "category"
}
