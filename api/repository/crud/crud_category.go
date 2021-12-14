package crud

import (
	"comp-performance/api/models"
	"comp-performance/api/utils/channels"
	"errors"

	"gorm.io/gorm"
)

// RepositoryCategoryCrud organises all user curd with the db
type RepositoryCategoryCrud struct {
	db *gorm.DB
}

// NewRepositoryCategoryCrud constructor
func NewRepositoryCategoryCrud(db *gorm.DB) *RepositoryCategoryCrud {
	return &RepositoryCategoryCrud{db}
}

// Save new category
func (r *RepositoryCategoryCrud) Save(category models.Category) (models.Category, error) {
	var err error
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(done)
		err = r.db.Debug().Model(models.Category{}).Create(&category).Error
		if err != nil {
			ch <- false
			return
		}
		ch <- true
	}(done)

	if channels.OK(done) {
		return category, nil
	}

	return models.Category{}, err
}

// FindAll users
func (r *RepositoryCategoryCrud) FindAll() ([]models.Category, error) {
	var err error
	categories := []models.Category{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.Category{}).Find(&categories).Error
		if err != nil {
			ch <- false
			return
		}

		ch <- true
	}(done)

	if categories == nil {
		return nil, errors.New("No categories Found")
	}

	if channels.OK(done) {
		return categories, nil
	}
	return nil, err
}

// FindByID will Find user by ID
func (r *RepositoryCategoryCrud) FindByID(uid int) (models.Category, error) {
	var err error
	category := models.Category{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.Category{}).Find(&category, "id = ?", uint(uid)).Error

		if err != nil {
			ch <- false
			return
		}

		if int(category.ID) != uid {
			err = errors.New("record not found")
			ch <- false
			return

		}

		ch <- true
	}(done)

	if channels.OK(done) {
		if err != nil {
			return category, err
		}
		return category, nil
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return models.Category{}, errors.New("No category with these data found")
	}

	if int(category.ID) != uid {
		err = errors.New("No category found")
		return category, err

	}
	return models.Category{}, err

}

// Update Category data
func (r *RepositoryCategoryCrud) Update(id int, category models.Category) (int, error) {
	var err error
	c := models.Category{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.Category{}).Find(&c, "id = ?", uint(id)).Error
		if err != nil {
			ch <- false
			return
		}

		err = r.db.Debug().Model(&c).Updates(category).Error

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
		return 0, errors.New("No Category with these data found")
	}
	return 0, err

}

// Delete a specific user by ID
func (r *RepositoryCategoryCrud) Delete(uid int) (int, error) {
	var rs *gorm.DB
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		rs = r.db.Debug().Model(&models.Category{}).Where("id = ?", uid).Take(&models.Category{}).Delete(&models.Category{})
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
