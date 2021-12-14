package models

import (
	"gorm.io/gorm"
)

// NotificationSettings Schema
type NotificationSettings struct {
	NewCompetitions         bool `gorm:"new_competitions; default:False" json:"new_competitions"`
	Discounts               bool `gorm:"discounts; default:False" json:"discounts"`
	EndingSoonCompetitions  bool `gorm:"ending_soon_competitions; default:False" json:"ending_soon_competitions"`
	Winner                  bool `gorm:"winner; default:False" json:"winner"`
	CompetitionEntryDetails bool `gorm:"competition_entry_details; default:False" json:"competition_entry_details"`
	gorm.Model
}

// TableName : NotificationSettings
func (c *NotificationSettings) TableName() string {
	return "notificationSettings"
}
