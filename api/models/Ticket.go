package models

import (
	"gorm.io/gorm"
	"time"
)

// Ticket Schema
type Ticket struct {
	gorm.Model
	CompetitionID uint      `gorm:"column:competition_id; not null; foreignKey:CompetitionID; references:ID" json:"competition_id"`
	TicketNumber  int       `gorm:"column:ticket_number; not null" json:"ticket_number"`
	Sold          bool      `gorm:"sold; default:False" json:"sold"`
	BuyerID       int       `gorm:"column:buyer_id; foreignKey:BuyerID; references:ID" json:"buyer_id"`
	LockedTill    time.Time `gorm:"column:locked_till; default:Null;" json:"locked_till"`
	// Buyer         User        `gorm:"column:buyer" json:"buyer"`
	// Competition   Competition `gorm:"column:competition" json:"competition"`
}

// TableName : ticket
func (t *Ticket) TableName() string {
	return "ticket"
}
