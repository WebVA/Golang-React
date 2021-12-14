package models

import (
	"fmt"
)

// Country Schema
type Country struct {
	// ID int `gorm:"column:ID; primaryKey; autoIncrement" json:"id"`
	Code          int    `gorm:"column:code; primaryKey; autoIncrement" json:"code"`
	Name          string `gorm:"column:name" json:"name"`
	ContinentName string `gorm:"column:continent_name" json:"continentName"`
}

// TableName : country
func (c *Country) TableName() string {
	return "country"
}

// ToString : country
func (c *Country) ToString() string {
	return fmt.Sprintf("Code: %d \t Name: %s \t ContinentName: %s", c.Code, c.Name, c.ContinentName)
}
