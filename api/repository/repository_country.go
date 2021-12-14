package repository

import (
	"comp-performance/api/models"
)

// CountryRepository Interface
type CountryRepository interface {
	FindCountryByCode(int) (models.Country, error)
}
