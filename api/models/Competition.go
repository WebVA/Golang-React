package models

import (
	"time"
	"gorm.io/gorm"
)

// Competition Schema
type Competition struct {
	Title                 string    `gorm:"column:title; not null" json:"title"`
	Price                 float64   `gorm:"column:price; not null" json:"price"`
	ReducedPrice          float64   `gorm:"column:reduced_price; default:Null;" json:"reduced_price"`
	EndTime               time.Time `gorm:"column:end_time; not null" json:"end_time"`
	NumberOfTickets       int       `gorm:"column:number_of_tickets; not null" json:"number_of_tickets"`
	MaxTicketsPerPerson   int       `gorm:"column:max_tickets_per_person; not null" json:"max_tickets_per_person"`
	QuizID                int       `gorm:"column:quiz_id; foreignKey:QuizID; references:ID" json:"quiz_id,omitempty"`
	Quiz                  Quiz      `json:"quiz,omitempty"`
	CategoryID            int       `gorm:"column:category_id;foreignKey:CategoryID;references:ID" json:"category_id,omitempty"`
	Category              Category  `json:"category,omitempty;"`
	Trending              bool      `gorm:"column:trending; type:boolean; default:False;" json:"trending"`
	Featured              bool      `gorm:"column:featured; type:boolean; default:False;" json:"featured"`
	Images                string    `gorm:"column:images" json:"images"`                 // image file names seprated by ;
	FeaturedImage         string    `gorm:"column:featured_image" json:"featured_image"` // name of the featured image file
	Description           string    `gorm:"column:description; type:longtext;" json:"description"`
	Headline              string    `gorm:"column:headline; type:longtext;" json:"headline"`
	Features              string    `gorm:"column:features; type:longtext;" json:"features"`
	UserID                int       `gorm:"column:winner_id;default:Null;foreignKey:UserID;references:ID" json:"winner_id,omitempty"`
	User                  User      `json:"winner,omitempty;"`
	WinnerTicketNumber    int       `gorm:"column:winner_ticket_number; default:Null;" json:"winner_ticket_number,omitempty"` // number of ticket that drawn to be winner
	WinnerNumberOfEntries int       `gorm:"column:winner_number_of_entries; default:Null" json:"winner_number_of_entries"`
	TicketsForEarlyDraw   int       `gorm:"column:tickets_for_early_draw; default:Null" json:"tickets_for_early_draw"`
	gorm.Model
}

// TableName : ticket
func (c *Competition) TableName() string {
	return "competition"
}
