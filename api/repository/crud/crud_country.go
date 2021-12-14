package crud

import (
	"comp-performance/api/models"
	"comp-performance/api/utils/channels"
	"errors"
	"gorm.io/gorm"
)

// RepositoryCountryCrud organises all country curd with the db
type RepositoryCountryCrud struct {
	db *gorm.DB
}

// NewRepositoryCountryCrud constructor
func NewRepositoryCountryCrud(db *gorm.DB) *RepositoryCountryCrud {
	return &RepositoryCountryCrud{db}
}

// FindCountryByCode will Find Country by code
func (r *RepositoryCountryCrud) FindCountryByCode(code int) (models.Country, error) {

	var err error
	country := models.Country{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.Country{}).Where("code = ?", code).First(&country).Error
		if err != nil {
			ch <- false
			return
		}
		ch <- true
	}(done)

	if channels.OK(done) {

		return country, nil
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return models.Country{}, errors.New("No Country with these data found")
	}
	return models.Country{}, err

}
