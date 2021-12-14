package repository

import (
	"comp-performance/api/models"
)

// EmailVerificationRepository Interface
type EmailVerificationRepository interface {
	Save(models.EmailVerification) error
	FindByToken(string) (models.EmailVerification, error)
	MarkTokenAsUsed(int) error
}
