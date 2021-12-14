package crud

import (
	"comp-performance/api/models"
	"comp-performance/api/utils/channels"
	"errors"

	"gorm.io/gorm"
)

// RepositoryCouponCrud organises all user curd with the db
type RepositoryCouponCrud struct {
	db *gorm.DB
}

// NewRepositoryCouponCrud constructor
func NewRepositoryCouponCrud(db *gorm.DB) *RepositoryCouponCrud {
	return &RepositoryCouponCrud{db}
}

// Save new coupon
func (r *RepositoryCouponCrud) Save(coupon models.Coupon) (models.Coupon, error) {
	var err error
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(done)
		err = r.db.Debug().Model(models.Coupon{}).Create(&coupon).Error
		if err != nil {
			ch <- false
			return
		}
		ch <- true
	}(done)

	if channels.OK(done) {
		return coupon, nil
	}

	return models.Coupon{}, err
}

func (r *RepositoryCouponCrud) FindByCode(code string) (models.Coupon, error) {
	var err error
	coupon := models.Coupon{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.Coupon{}).Find(&coupon, "coupon_code = ?", code, "available = ?", true).Error

		if err != nil {
			ch <- false
			return
		}

		if coupon.CouponCode != code {
			err = errors.New("record not found")
			ch <- false
			return

		}

		ch <- true
	}(done)

	if channels.OK(done) {
		if err != nil {
			return coupon, err
		}
		return coupon, nil
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return models.Coupon{}, errors.New("No coupon with this coupon code found")
	}

	if coupon.CouponCode != code {
		err = errors.New("Invalid coupon code")
		return coupon, err
	}
	return models.Coupon{}, err
}
