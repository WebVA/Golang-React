package crud

import (
	"comp-performance/api/models"
	"comp-performance/api/utils/channels"
	"errors"
	"gorm.io/gorm"
)

// repositoryEmailVerification organises all user curd with the db
type repositoryEmailVerification struct {
	db *gorm.DB
}

// NewRepositoryEmailVerification constructor
func NewRepositoryEmailVerification(db *gorm.DB) *repositoryEmailVerification {
	return &repositoryEmailVerification{db}
}

func (r *repositoryEmailVerification) Save(record models.EmailVerification) error {
	var err error
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(done)

		err = r.db.Debug().Model(models.EmailVerification{}).Create(&record).Error
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

// FindAddressByID will Find EmailVerification by ID
func (r *repositoryEmailVerification) FindByToken(token string) (models.EmailVerification, error) {
	var err error
	record := models.EmailVerification{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.EmailVerification{}).Where("token = ?", token).First(&record).Error
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
		return models.EmailVerification{}, errors.New("No EmailVerification with these data found")
	}
	return models.EmailVerification{}, err

}

// Update will Find EmailVerification by ID
func (r *repositoryEmailVerification) MarkTokenAsUsed(id int) error {
	var err error
	record := models.EmailVerification{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.EmailVerification{}).Find(&record, "id = ?", uint(id)).Error
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
		return errors.New("No EmailVerification with these data found")
	}
	return err

}
