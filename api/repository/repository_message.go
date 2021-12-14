package repository

import (
	"comp-performance/api/models"
	"time"
)

// MessageRepository Interface
type MessageRepository interface {
	Save(models.Message) (models.Message, error)
	FindAll() ([]models.Message, error)
	FindAfterDate(time.Time) ([]models.Message, error)
	FindByID(int) (models.Message, error)
	Update(int, models.Message) (int, error)
	Delete(int) (int, error)
}
