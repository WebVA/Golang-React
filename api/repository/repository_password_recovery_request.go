package repository

import (
	"comp-performance/api/models"
)

// EmailVerificationRepository Interface
type PasswordRecoveryRequestRepository interface {
	Save(models.PasswordRecoveryRequest) error
	FindByToken(string) (models.PasswordRecoveryRequest, error)
	MarkTokenAsUsed(int) error
}
