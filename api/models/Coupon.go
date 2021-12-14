package models

import (
	"gorm.io/gorm"
)

// Prize Schema
type Coupon struct {
	CouponCode string  `gorm:"column:coupon_code" json:"coupon_code"`
	Type       string  `gorm:"column:coupon_type" json:"coupon_type"`
	Amount     float64 `gorm:"column:amount" json:"amount"`
	Available  bool    `gorm:"column:available; default:true" json:"available"`
	gorm.Model
}

func (c *Coupon) TableName() string {
	return "coupon"
}
