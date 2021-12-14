package repository

import (
	"comp-performance/api/models"
)

type NewsLetterRepository interface {
	Save(models.NewsLetter) error
}
