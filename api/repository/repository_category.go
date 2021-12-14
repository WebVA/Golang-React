package repository

import (
	"comp-performance/api/models"
)

// CategoryRepository Interface
type CategoryRepository interface {
	Save(models.Category) (models.Category, error)
	FindAll() ([]models.Category, error)
	FindByID(int) (models.Category, error)
	Update(int, models.Category) (int, error)
	Delete(int) (int, error)
}
