package repository

import (
	"comp-performance/api/models"
	"gorm.io/gorm"
)

// UserRepository Interface
type UserRepository interface {
	Save(models.User) (models.User, error)
	FindAll() ([]models.User, error)
	FindByID(int) (models.User, error)
	Update(int, models.User) (int, error)
	Delete(int) (int, error)
	AttachAddressAndCountryToUser(*gorm.DB, models.User) (models.User, error)
	FindByEmail(string) (models.User, error)
	VerifyAccount(*gorm.DB, string) error
	UpdatePassword(*gorm.DB, string, string) error
	UpdateRewardPoints(models.User) error
}
