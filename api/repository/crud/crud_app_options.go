package crud

import (
	"comp-performance/api/models"
	"comp-performance/api/utils/channels"
	"errors"
	"fmt"
	"net/http"

	"gorm.io/gorm"
)

// AppOptionsRepository organises all country curd with the db
type AppOptionsRepository struct {
	db *gorm.DB
}

// NewRepositoryAppOptionsCrud constructor
func NewRepositoryAppOptionsCrud(db *gorm.DB) *AppOptionsRepository {
	return &AppOptionsRepository{db}
}

// FindAll users
func (r *AppOptionsRepository) FindAll() ([]models.AppOptions, error) {
	var err error
	options := []models.AppOptions{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.AppOptions{}).Find(&options).Error
		if err != nil {
			ch <- false
			return
		}

		ch <- true
	}(done)

	if options == nil {
		return nil, errors.New("No options Found")
	}

	if channels.OK(done) {
		return options, nil
	}
	return nil, err
}

// Add New App Option
func (r *AppOptionsRepository) Add(opt models.AppOptions) (int, error) {
	var err error
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		fmt.Printf("opt:   %v %T", opt, opt)

		err = r.db.Debug().Model(models.AppOptions{}).Create(&opt).Error
		if err != nil {
			ch <- false
			return
		}

		ch <- true
	}(done)

	if channels.OK(done) {

		return http.StatusCreated, nil
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return 0, errors.New("No AppOptions with these data found")
	}
	return 0, err

}

// Update will Find AppOptions by ID
func (r *AppOptionsRepository) Update(opt models.AppOptions) (int, error) {
	var err error
	temp := models.AppOptions{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		fmt.Printf("opt:   %v %T", opt, opt)
		fmt.Printf("temp: %v %T", temp, temp)
		err := r.db.Debug().Model(&models.AppOptions{}).Find(&temp, "`key` = ?", opt.Key).Error
		if err != nil {
			ch <- false
			return
		}

		err = r.db.Debug().Model(&temp).Updates(opt).Error
		if err != nil {
			ch <- false
			return
		}

		ch <- true
	}(done)

	if channels.OK(done) {

		return http.StatusCreated, nil
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return 0, errors.New("No AppOptions with these data found")
	}
	return 0, err

}
