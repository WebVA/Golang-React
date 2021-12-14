package repository

import (
	"comp-performance/api/models"
)

// QuizRepository Interface
type QuizRepository interface {
	Save(models.Quiz) (models.Quiz, error)
	FindAll() ([]models.Quiz, error)
	FindByID(int) (models.Quiz, error)
	Update(int, models.Quiz) (models.Quiz, error)
	Delete(int) (int, error)
}
