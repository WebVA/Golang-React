package crud

import (
	"comp-performance/api/models"
	"comp-performance/api/utils/channels"
	"errors"

	"gorm.io/gorm"
)

// RepositoryPrizeCrud organises all user curd with the db
type RepositoryPrizeCrud struct {
	db *gorm.DB
}

// NewRepositoryPrizeCrud constructor
func NewRepositoryPrizeCrud(db *gorm.DB) *RepositoryPrizeCrud {
	return &RepositoryPrizeCrud{db}
}

// Save new coupon
func (r *RepositoryPrizeCrud) Save(coupon models.Prize) (models.Prize, error) {
	var err error
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(done)
		err = r.db.Debug().Model(models.Prize{}).Create(&coupon).Error
		if err != nil {
			ch <- false
			return
		}
		ch <- true
	}(done)

	if channels.OK(done) {
		return coupon, nil
	}

	return models.Prize{}, err
}

// FindAll prizes
func (r *RepositoryPrizeCrud) FindAll() ([]models.Prize, error) {
	var err error
	prizes := []models.Prize{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.Prize{}).Find(&prizes).Error
		if err != nil {
			ch <- false
			return
		}
		ch <- true
	}(done)

	if prizes == nil {
		return nil, errors.New("No prizes Found")
	}

	if channels.OK(done) {
		return prizes, nil
	}
	return nil, err
}

// FindByID will Find user by ID
func (r *RepositoryPrizeCrud) FindByID(uid int) (models.Prize, error) {
	var err error
	prize := models.Prize{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.Prize{}).Find(&prize, "id = ?", uint(uid)).Error

		if err != nil {
			ch <- false
			return
		}

		if int(prize.ID) != uid {
			err = errors.New("record not found")
			ch <- false
			return

		}

		ch <- true
	}(done)

	if channels.OK(done) {
		if err != nil {
			return prize, err
		}
		return prize, nil
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return models.Prize{}, errors.New("No prize with these data found")
	}

	if int(prize.ID) != uid {
		err = errors.New("No prize found")
		return prize, err

	}
	return models.Prize{}, err

}

// Update Prize data
func (r *RepositoryPrizeCrud) Update(id int, prize models.Prize) (int, error) {
	var err error
	p := models.Prize{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.Prize{}).Find(&p, "id = ?", uint(id)).Error
		if err != nil {
			ch <- false
			return
		}

		err = r.db.Debug().Model(&p).Updates(prize).Error

		if err != nil {
			ch <- false
			return
		}

		ch <- true
	}(done)

	if channels.OK(done) {

		return 1, nil
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return 0, errors.New("No Prize with these data found")
	}
	return 0, err

}

// Delete a specific user by ID
func (r *RepositoryPrizeCrud) Delete(uid int) (int, error) {
	var rs *gorm.DB
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		rs = r.db.Debug().Model(&models.Prize{}).Where("id = ?", uid).Take(&models.Prize{}).Delete(&models.Prize{})
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
