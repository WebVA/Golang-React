package repository

import (
	"comp-performance/api/models"
)

// NotificationSettingsRepository Interface
type NotificationSettingsRepository interface {
	Save(models.NotificationSettings) (models.NotificationSettings, error)
	FindAll() ([]models.NotificationSettings, error)
	FindByID(int) (models.NotificationSettings, error)
	Update(int, models.NotificationSettings) (models.NotificationSettings, error)
	Delete(int) (int, error)
}
