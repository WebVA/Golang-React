package crud

import (
	"comp-performance/api/models"
	"comp-performance/api/utils/channels"
	"errors"
	"gorm.io/gorm"
)

// RepositoryAddressCrud organises all user curd with the db
type RepositoryAddressCrud struct {
	db *gorm.DB
}

// NewRepositoryAddressCrud constructor
func NewRepositoryAddressCrud(db *gorm.DB) *RepositoryAddressCrud {
	return &RepositoryAddressCrud{db}
}

// FindAddressByID will Find Address by ID
func (r *RepositoryAddressCrud) FindAddressByID(id int) (models.Address, error) {
	var err error
	address := models.Address{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.Address{}).Where("id = ?", id).First(&address).Error
		if err != nil {
			ch <- false
			return
		}
		ch <- true
	}(done)

	if channels.OK(done) {

		return address, nil
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return models.Address{}, errors.New("No Address with these data found")
	}
	return models.Address{}, err

}

// Update will Find Address by ID
func (r *RepositoryAddressCrud) Update(id int, address models.Address) (models.Address, error) {
	var err error
	addr := models.Address{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.Address{}).Find(&addr, "id = ?", uint(id)).Error
		if err != nil {
			ch <- false
			return
		}

		err = r.db.Debug().Model(&addr).Save(address).Error
		if err != nil {
			ch <- false
			return
		}
		
		ch <- true
	}(done)

	if channels.OK(done) {

		return address, nil
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return models.Address{}, errors.New("No Address with these data found")
	}
	return models.Address{}, err

}
