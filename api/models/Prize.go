package models

import (
	"gorm.io/gorm"
)

// Prize Schema
type Prize struct {
	Title          string  `gorm:"column:title" json:"title"`
	Description    string  `gorm:"column:description" json:"description"`
	Type           string  `gorm:"column:type;" json:"type"`
	PointsRequired int     `gorm:"column:points_required" json:"points_required"`
	PrizeValue     float64 `gorm:"column:prize_value" json:"prize_value"`
	gorm.Model
}

// TableName : ticket
func (c *Prize) TableName() string {
	return "prize"
}
