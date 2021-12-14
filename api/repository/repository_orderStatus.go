package repository

import (
	"comp-performance/api/models"
)

// OrderStatusRepository Interface
type OrderStatusRepository interface {
	Save(models.OrderStatus) (models.OrderStatus, error)
	FindAll() ([]models.OrderStatus, error)
	FindByID(int) (models.OrderStatus, error)
	Update(int, models.OrderStatus) (int, error)
	Delete(int) (int, error)
}
