package crud

import (
	"comp-performance/api/models"
	"comp-performance/api/utils/channels"
	"errors"
	"fmt"

	"gorm.io/gorm"
)

// RepositoryOrderItemCrud organises all user curd with the db
type RepositoryOrderItemCrud struct {
	db *gorm.DB
}

// NewRepositoryOrderItemCrud constructor
func NewRepositoryOrderItemCrud(db *gorm.DB) *RepositoryOrderItemCrud {
	return &RepositoryOrderItemCrud{db}
}

// Save new item
func (r *RepositoryOrderItemCrud) Save(item models.OrderItem) (models.OrderItem, error) {
	var err error
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(done)
		err = r.db.Debug().Model(models.OrderItem{}).Create(&item).Error
		if err != nil {
			ch <- false
			return
		}
		ch <- true
	}(done)

	if channels.OK(done) {
		return item, nil
	}

	return models.OrderItem{}, err
}

// FindAll users
func (r *RepositoryOrderItemCrud) FindAll() ([]models.OrderItem, error) {
	var err error
	items := []models.OrderItem{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.OrderItem{}).Find(&items).Error
		if err != nil {
			ch <- false
			return
		}

		ch <- true
	}(done)

	if items == nil {
		return nil, errors.New("No items Found")
	}

	if channels.OK(done) {
		return items, nil
	}
	return nil, err
}

// FindByID will Find user by ID
func (r *RepositoryOrderItemCrud) FindByID(uid int) (models.OrderItem, error) {
	var err error
	item := models.OrderItem{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.OrderItem{}).Find(&item, "id = ?", uint(uid)).Error

		if err != nil {
			ch <- false
			return
		}

		if int(item.ID) != uid {
			err = errors.New("record not found")
			ch <- false
			return

		}

		ch <- true
	}(done)

	if channels.OK(done) {
		if err != nil {
			return item, err
		}
		return item, nil
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return models.OrderItem{}, errors.New("No item with these data found")
	}

	if int(item.ID) != uid {
		err = errors.New("No item found")
		return item, err

	}
	return models.OrderItem{}, err

}

// Update OrderItem data
func (r *RepositoryOrderItemCrud) Update(uid int, user models.OrderItem) (int, error) {
	return 0, nil
}

// Delete a specific user by ID
func (r *RepositoryOrderItemCrud) Delete(uid int) (int, error) {
	var rs *gorm.DB
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		rs = r.db.Debug().Model(&models.OrderItem{}).Where("id = ?", uid).Take(&models.OrderItem{}).Delete(&models.OrderItem{})
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

func (r *RepositoryOrderItemCrud) GetAllItemsOfOrder(orderID uint) ([]models.OrderItem, error) {
	var err error
	items := []models.OrderItem{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.OrderItem{}).Find(&items, " order_id = ?", orderID).Error

		if err != nil {
			ch <- false
			return
		}

		for i := range items {
			fmt.Println("cid >>>>>>>>", items[i].CompetitionID)
			err = r.db.Preload("Competition", "id = ?", items[i].CompetitionID).Find(&items[i]).Error

			if err != nil {
				ch <- false
				return
			}

			if err != nil {
				ch <- false
				return
			}
		}
		ch <- true
	}(done)

	if channels.OK(done) {
		if err != nil {
			return items, err
		}
		return items, nil
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return []models.OrderItem{}, errors.New("No item with these data found")
	}

	return []models.OrderItem{}, err

}
