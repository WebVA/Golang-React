package crud

import (
	"comp-performance/api/models"
	"comp-performance/api/utils/channels"
	"errors"

	"fmt"

	"gorm.io/gorm"
)

// RepositoryCompetitionCrud organises all user curd with the db
type RepositoryCompetitionCrud struct {
	db *gorm.DB
}

// NewRepositoryCompetitionCrud constructor
func NewRepositoryCompetitionCrud(db *gorm.DB) *RepositoryCompetitionCrud {
	return &RepositoryCompetitionCrud{db}
}

// Save new competition
func (r *RepositoryCompetitionCrud) Save(competition models.Competition) (models.Competition, error) {
	var err error
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(done)
		err = r.db.Debug().Model(models.Competition{}).Create(&competition).Error
		if err != nil {
			fmt.Println(err)
			ch <- false
			return
		}
		ch <- true
	}(done)

	if channels.OK(done) {
		return competition, nil
	}

	return models.Competition{}, err
}

// FindAll users
func (r *RepositoryCompetitionCrud) FindAll() ([]models.Competition, error) {
	var err error
	competitions := []models.Competition{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.Competition{}).Find(&competitions).Error
		if err != nil {
			ch <- false
			return
		}
		for i := range competitions {

			err = r.db.Preload("Quiz", "id = ?", competitions[i].QuizID).Find(&competitions[i]).Error
			if err != nil {
				ch <- false
				return
			}

			if competitions[i].UserID != 0 {
				err = r.db.Preload("User", "id = ?", competitions[i].UserID).Find(&competitions[i]).Error
				// err := r.db.Joins("Competition").Joins("User").Find(&competitions[i], "competition.id = ?", competitions[i].ID, "used.id", competitions[i].UserID).Error
				if err != nil {
					ch <- false
					return
				}
			}

			err = r.db.Preload("Category", "id = ?", competitions[i].CategoryID).Find(&competitions[i]).Error
			if err != nil {
				ch <- false
				return
			}
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
func (r *RepositoryCompetitionCrud) FindByID(uid int) (models.Competition, error) {
	var err error
	competition := models.Competition{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.Competition{}).Find(&competition, "id = ?", uint(uid)).Error

		if err != nil {
			ch <- false
			return
		}

		if int(competition.ID) != uid {
			err = errors.New("record not found")
			ch <- false
			return

		}

		err = r.db.Preload("Quiz", "id = ?", competition.QuizID).Find(&competition).Error
		if err != nil {
			ch <- false
			return
		}

		err = r.db.Preload("Category", "id = ?", competition.CategoryID).Find(&competition).Error
		if err != nil {
			ch <- false
			return
		}

		ch <- true
	}(done)

	if channels.OK(done) {
		if err != nil {
			return competition, err
		}
		return competition, nil
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return models.Competition{}, errors.New("No competition with these data found")
	}

	if int(competition.ID) != uid {
		err = errors.New("No competition found")
		return competition, err

	}
	return models.Competition{}, err

}

// Update Competition data
func (r *RepositoryCompetitionCrud) Update(id int, comp models.Competition) (models.Competition, error) {
	var err error
	c := models.Competition{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.Competition{}).Find(&c, "id = ?", uint(id)).Error
		if err != nil {
			ch <- false
			return
		}

		err = r.db.Debug().Model(&c).Updates(comp).Error

		if comp.Trending == false || comp.Featured == false {
			err = r.db.Debug().Model(&c).Updates(map[string]interface{}{
				"Trending": comp.Trending,
				"Featured": comp.Featured,
			}).Error
		}


		if err != nil {
			ch <- false
			return
		}

		ch <- true
	}(done)

	if channels.OK(done) {

		return comp, nil
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return models.Competition{}, errors.New("No Competition with these data found")
	}
	return models.Competition{}, err

}

// Delete a specific user by ID
func (r *RepositoryCompetitionCrud) Delete(uid int) (int, error) {
	var rs *gorm.DB
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		rs = r.db.Debug().Model(&models.Competition{}).Where("id = ?", uid).Take(&models.Competition{}).Delete(&models.Competition{})
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
