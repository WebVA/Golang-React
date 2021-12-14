package models

import (
	// "github.com/lib/pq"
	"gorm.io/gorm"
)

// Order Schema
type Order struct {
	UserID               uint        `gorm:"column:buyer_id; not null; foreignKey:UserID; references:ID" json:"buyer_id"`
	User                 User        `json:"buyer,omitempty"`
	OrderStatusID        uint        `gorm:"column:order_status_id; not null; foreignKey:OrderStatusID; references:ID" json:"order_status_id"`
	OrderStatus          OrderStatus `json:"order_status,omitempty"`
	Total                float64     `gorm:"column:total; " json:"total"`
	NumberOfTickets      int         `gorm:"column:number_of_tickets; not null;" json:"number_of_tickets"`
	NumberOfCompetitions int         `gorm:"column:number_of_competitions" json:"number_of_competitions"`
	OrderItems           []OrderItem `json:"order_items,omitempty"`
	PaymentSessionID     string      ` gorm:"column:payment_session_id" json:"payment_session_id,omitempty"`
	gorm.Model
}

// TableName : ticket
func (c *Order) TableName() string {
	return "order"
}
