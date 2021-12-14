package crud

import (
	"comp-performance/api/models"
	"comp-performance/api/utils/channels"
	"errors"

	"gorm.io/gorm"
)

// RepositoryOrderStatusCrud organises all user curd with the db
type RepositoryOrderStatusCrud struct {
	db *gorm.DB
}

// NewRepositoryOrderStatusCrud constructor
func NewRepositoryOrderStatusCrud(db *gorm.DB) *RepositoryOrderStatusCrud {
	return &RepositoryOrderStatusCrud{db}
}

// Save new status
func (r *RepositoryOrderStatusCrud) Save(status models.OrderStatus) (models.OrderStatus, error) {
	var err error
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(done)
		err = r.db.Debug().Model(models.OrderStatus{}).Create(&status).Error
		if err != nil {
			ch <- false
			return
		}
		ch <- true
	}(done)

	if channels.OK(done) {
		return status, nil
	}

	return models.OrderStatus{}, err
}

// FindAll users
func (r *RepositoryOrderStatusCrud) FindAll() ([]models.OrderStatus, error) {
	var err error
	statuses := []models.OrderStatus{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.OrderStatus{}).Find(&statuses).Error
		if err != nil {
			ch <- false
			return
		}

		ch <- true
	}(done)

	if statuses == nil {
		return nil, errors.New("No statuses Found")
	}

	if channels.OK(done) {
		return statuses, nil
	}
	return nil, err
}

// FindByID will Find user by ID
func (r *RepositoryOrderStatusCrud) FindByID(uid int) (models.OrderStatus, error) {
	var err error
	status := models.OrderStatus{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.OrderStatus{}).Find(&status, "id = ?", uint(uid)).Error

		if err != nil {
			ch <- false
			return
		}

		if int(status.ID) != uid {
			err = errors.New("record not found")
			ch <- false
			return

		}

		ch <- true
	}(done)

	if channels.OK(done) {
		if err != nil {
			return status, err
		}
		return status, nil
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return models.OrderStatus{}, errors.New("No status with these data found")
	}

	if int(status.ID) != uid {
		err = errors.New("No status found")
		return status, err

	}
	return models.OrderStatus{}, err

}

// Update OrderStatus data
func (r *RepositoryOrderStatusCrud) Update(uid int, user models.OrderStatus) (int, error) {
	return 0, nil
}

// Delete a specific user by ID
func (r *RepositoryOrderStatusCrud) Delete(uid int) (int, error) {
	var rs *gorm.DB
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		rs = r.db.Debug().Model(&models.OrderStatus{}).Where("id = ?", uid).Take(&models.OrderStatus{}).Delete(&models.OrderStatus{})
		ch <- true
	}(done)

	if channels.OK(done) {
		if rs.Error != nil {
			return 0, rs.Error
		}

		return int(rs.RowsAffected), nil
	}

	return 0, rs.Error
}
