package repository

import (
	"comp-performance/api/models"
	"comp-performance/api/utils/types"
)

// OrderRepository Interface
type OrderRepository interface {
	Save(models.Order) (models.Order, error)
	FindAll() ([]models.Order, error)
	FindByID(uint) (models.Order, error)
	FindByBuyerID(uint) ([]models.Order, error)
	Update(int, models.Order) (int, error)
	Delete(int) (int, error)
	FindFullOrderByID(uint) (types.FullOrder, error)
	FindAllFullOrders() ([]types.FullOrder, error)
}
