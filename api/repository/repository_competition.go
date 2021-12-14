package repository

import (
	"comp-performance/api/models"
)

// CompetitionRepository Interface
type CompetitionRepository interface {
	Save(models.Competition) (models.Competition, error)
	FindAll() ([]models.Competition, error)
	FindByID(int) (models.Competition, error)
	Update(int, models.Competition) (models.Competition, error)
	Delete(int) (int, error)
}
