package crud

import (
	"comp-performance/api/models"
	"comp-performance/api/utils/channels"
	"gorm.io/gorm"
)

// repositoryNewsLetter organises all user curd with the db
type repositoryNewsLetter struct {
	db *gorm.DB
}

// NewRepositoryNewsLetterCrud constructor
func NewRepositoryNewsLetterCrud(db *gorm.DB) *repositoryNewsLetter {
	return &repositoryNewsLetter{db}
}

func (r *repositoryNewsLetter) Save(record models.NewsLetter) error {
	var err error
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(done)

		err = r.db.Debug().Model(models.NewsLetter{}).Create(&record).Error
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
