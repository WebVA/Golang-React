package repository

import (
	"comp-performance/api/models"
)

// OrderItemRepository Interface
type OrderItemRepository interface {
	Save(models.OrderItem) (models.OrderItem, error)
	FindAll() ([]models.OrderItem, error)
	FindByID(int) (models.OrderItem, error)
	Update(int, models.OrderItem) (int, error)
	Delete(int) (int, error)
	GetAllItemsOfOrder(uint) ([]models.Order, error)
}
