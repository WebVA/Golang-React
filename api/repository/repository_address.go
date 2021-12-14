package repository

import (
	"comp-performance/api/models"
)

// AddressRepository Interface
type AddressRepository interface {
	FindAddressByID(int) (models.Address, error)
	Update(int, models.Address) (models.Address, error)
}
