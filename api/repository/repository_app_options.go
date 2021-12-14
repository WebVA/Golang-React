package repository

import (
	"comp-performance/api/models"
)

// AppOptionsRepository Interface
type AppOptionsRepository interface {
	FindAll() ([]models.AppOptions, error)
	Update(models.AppOptions) (int, error)
	Add(models.AppOptions) (int, error)
}
