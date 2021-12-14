package models

import (
	// "gorm.io/gorm"
)

// Address Schema
type Address struct {
	ID          int `gorm:"column:ID;primaryKey;autoIncrement;" json:"id"`
	CountryCode int `gorm:"column:country_code; foreignKey:CountryCode; references:Code" json:"country_code"`
	Country     Country
	City        string `gorm:"column:city" json:"city"`
	AddressLine string `gorm:"column:address_line" json:"address_line"`
	ZipCode     string `gorm:"column:zip_code" json:"zip_code"`
}

// TableName : user
func (s *Address) TableName() string {
	return "address"
}

