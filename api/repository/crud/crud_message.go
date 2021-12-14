package crud

import (
	"comp-performance/api/models"
	"comp-performance/api/utils/channels"
	"errors"

	"time"

	"gorm.io/gorm"
)

// RepositoryMessageCrud organises all user curd with the db
type RepositoryMessageCrud struct {
	db *gorm.DB
}

// NewRepositoryMessageCrud constructor
func NewRepositoryMessageCrud(db *gorm.DB) *RepositoryMessageCrud {
	return &RepositoryMessageCrud{db}
}

// Save new msg
func (r *RepositoryMessageCrud) Save(msg models.Message) (models.Message, error) {
	var err error
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(done)
		err = r.db.Debug().Model(models.Message{}).Create(&msg).Error
		if err != nil {
			ch <- false
			return
		}
		ch <- true
	}(done)

	if channels.OK(done) {
		return msg, nil
	}

	return models.Message{}, err
}

// FindAll users
func (r *RepositoryMessageCrud) FindAll() ([]models.Message, error) {
	var err error
	competitions := []models.Message{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.Message{}).Find(&competitions).Error
		if err != nil {
			ch <- false
			return
		}

		ch <- true
	}(done)

	if competitions == nil {
		return nil, errors.New("No competitions Found")
	}

	if channels.OK(done) {
		return competitions, nil
	}
	return nil, err
}

// FindByID will Find user by ID
func (r *RepositoryMessageCrud) FindByID(uid int) (models.Message, error) {
	var err error
	msg := models.Message{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.Message{}).Find(&msg, "id = ?", uint(uid)).Error

		if err != nil {
			ch <- false
			return
		}

		if int(msg.ID) != uid {
			err = errors.New("record not found")
			ch <- false
			return

		}

		ch <- true
	}(done)

	if channels.OK(done) {
		if err != nil {
			return msg, err
		}
		return msg, nil
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return models.Message{}, errors.New("No msg with these data found")
	}

	if int(msg.ID) != uid {
		err = errors.New("No msg found")
		return msg, err

	}
	return models.Message{}, err

}

// Update Message data
func (r *RepositoryMessageCrud) Update(uid int, user models.Message) (int, error) {
	return 0, nil
}

// Delete a specific user by ID
func (r *RepositoryMessageCrud) Delete(uid int) (int, error) {
	var rs *gorm.DB
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		rs = r.db.Debug().Model(&models.Message{}).Where("id = ?", uid).Take(&models.Message{}).Delete(&models.Message{})
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

// Find messages after date
func (r *RepositoryMessageCrud) FindAfterDate(date time.Time) ([]models.Message, error) {
	var err error
	messages := []models.Message{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.Message{}).Where("created_at >= ?", date).Find(&messages).Error
		if err != nil {
			ch <- false
			return
		}

		ch <- true
	}(done)

	if messages == nil {
		return nil, errors.New("No messages Found")
	}

	if channels.OK(done) {
		return messages, nil
	}
	return nil, err
}
