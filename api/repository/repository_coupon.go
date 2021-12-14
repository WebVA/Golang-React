package repository

import (
	"comp-performance/api/models"
)

// CouponRepository Interface
type CouponRepository interface {
	Save(models.Coupon) (models.Coupon, error)
	FindByCode(string) (models.Coupon, error)
}
