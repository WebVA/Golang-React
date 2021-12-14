package crud

import (
	"comp-performance/api/models"
	"comp-performance/api/utils/channels"
	"errors"
	"gorm.io/gorm"
)

// repositoryPasswordRecoveryRequest organises all user curd with the db
type repositoryPasswordRecoveryRequest struct {
	db *gorm.DB
}

// NewRepositoryPasswordRecoveryRequestCrud constructor
func NewRepositoryPasswordRecoveryRequestCrud(db *gorm.DB) *repositoryPasswordRecoveryRequest {
	return &repositoryPasswordRecoveryRequest{db}
}

func (r *repositoryPasswordRecoveryRequest) Save(record models.PasswordRecoveryRequest) error {
	var err error
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(done)

		err = r.db.Debug().Model(models.PasswordRecoveryRequest{}).Create(&record).Error
		if err != nil {
			ch <- false
			return
		}
		ch <- true
	}(done)

	if channels.OK(done) {
		return nil
	}

	return err
}

// FindAddressByID will Find PasswordRecoveryRequest by ID
func (r *repositoryPasswordRecoveryRequest) FindByToken(token string) (models.PasswordRecoveryRequest, error) {
	var err error
	record := models.PasswordRecoveryRequest{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.PasswordRecoveryRequest{}).Where("token = ?", token).First(&record).Error
		if err != nil {
			ch <- false
			return
		}
		ch <- true
	}(done)

	if channels.OK(done) {
		return record, nil
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return models.PasswordRecoveryRequest{}, errors.New("No PasswordRecoveryRequest with these data found")
	}
	return models.PasswordRecoveryRequest{}, err

}

// Update will Find PasswordRecoveryRequest by ID
func (r *repositoryPasswordRecoveryRequest) MarkTokenAsUsed(id int) error {
	var err error
	record := models.PasswordRecoveryRequest{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.PasswordRecoveryRequest{}).Find(&record, "id = ?", uint(id)).Error
		if err != nil {
			ch <- false
			return
		}

		err = r.db.Debug().Model(&record).Update("used", true).Error
		if err != nil {
			ch <- false
			return
		}

		ch <- true
	}(done)

	if channels.OK(done) {

		return nil
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return errors.New("No PasswordRecoveryRequest with these data found")
	}
	return err

}
