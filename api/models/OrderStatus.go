package models

import (
	"gorm.io/gorm"
)

// OrderStatus Schema
type OrderStatus struct {
	Status string `gorm:"column:status; not null" json:"status"`
	gorm.Model
}

// TableName : ticket
func (c *OrderStatus) TableName() string {
	return "orderStatus"
}
