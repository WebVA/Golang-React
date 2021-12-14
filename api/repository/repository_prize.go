package repository

import (
	"comp-performance/api/models"
)

// PrizeRepository Interface
type PrizeRepository interface {
	Save(models.Prize) (models.Prize, error)
	FindAll() ([]models.Prize, error)
	FindByID(int) (models.Prize, error)
	Update(int, models.Prize) (int, error)
	Delete(int) (int, error)
}
