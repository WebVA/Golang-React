package crud

import (
	"comp-performance/api/models"
	"comp-performance/api/utils/channels"
	"errors"

	"gorm.io/gorm"
)

// RepositoryQuizCrud organises all user curd with the db
type RepositoryQuizCrud struct {
	db *gorm.DB
}

// NewRepositoryQuizCrud constructor
func NewRepositoryQuizCrud(db *gorm.DB) *RepositoryQuizCrud {
	return &RepositoryQuizCrud{db}
}

// Save new quiz
func (r *RepositoryQuizCrud) Save(quiz models.Quiz) (models.Quiz, error) {
	var err error
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(done)
		err = r.db.Debug().Model(models.Quiz{}).Create(&quiz).Error
		if err != nil {
			ch <- false
			return
		}
		ch <- true
	}(done)

	if channels.OK(done) {
		return quiz, nil
	}

	return models.Quiz{}, err
}

// FindAll users
func (r *RepositoryQuizCrud) FindAll() ([]models.Quiz, error) {
	var err error
	competitions := []models.Quiz{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.Quiz{}).Find(&competitions).Error
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
func (r *RepositoryQuizCrud) FindByID(uid int) (models.Quiz, error) {
	var err error
	quiz := models.Quiz{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.Quiz{}).Find(&quiz, "id = ?", uint(uid)).Error

		if err != nil {
			ch <- false
			return
		}

		if int(quiz.ID) != uid {
			err = errors.New("record not found")
			ch <- false
			return

		}

		ch <- true
	}(done)

	if channels.OK(done) {
		if err != nil {
			return quiz, err
		}
		return quiz, nil
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return models.Quiz{}, errors.New("No quiz with these data found")
	}

	if int(quiz.ID) != uid {
		err = errors.New("No quiz found")
		return quiz, err

	}
	return models.Quiz{}, err

}

// Update Quiz data
func (r *RepositoryQuizCrud) Update(id int, quiz models.Quiz) (models.Quiz, error) {
	var err error
	q := models.Quiz{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.Quiz{}).Find(&q, "id = ?", uint(id)).Error
		if err != nil {
			ch <- false
			return
		}

		err = r.db.Debug().Model(&q).Updates(quiz).Error



		if err != nil {
			ch <- false
			return
		}

		ch <- true
	}(done)

	if channels.OK(done) {

		return quiz, nil
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return models.Quiz{}, errors.New("No Quiz with these data found")
	}
	return models.Quiz{}, err

}
// Delete a specific user by ID
func (r *RepositoryQuizCrud) Delete(uid int) (int, error) {
	var rs *gorm.DB
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		rs = r.db.Debug().Model(&models.Quiz{}).Where("id = ?", uid).Take(&models.Quiz{}).Delete(&models.Quiz{})
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
