package models

import (
	"gorm.io/gorm"
)

// OrderItem Schema
type OrderItem struct {
	CompetitionID     uint        `gorm:"column:competition_id; not null; foreignKey:CompetitionID; references:ID" json:"competition_id,omitempty"`
	CouponUsed        bool        `gorm:"coupon_used; default:False" json:"coupon_used"`
	TicketID          int         `gorm:"column:ticket_id;" json:"ticket_id"`
	OrderID           uint        `gorm:"column:order_id; not null; foreignKey:OrderID; references:ID" json:"order_id,omitempty"`
	QuizID            uint        `gorm:"column:quiz_id; not null; foreignKey:QuizID; references:ID" json:"quiz_id,omitempty"`
	GivenAnswer       int         `gorm:"column:given_answer; not null;" json:"given_answer"`
	IsAnswerRight     bool        `gorm:"column:is_answer_right; not null;" json:"is_answer_right"`
	Competition       Competition `json:"competition,omitempty"`
	CompetitionTitle  string      `gorm:"column:competition_title;" json:"competition_title"`
	GivenAnswerString string      `gorm:"column:given_answer_string;" json:"given_answer_string"`
	// Coupon        Coupon      `json:"coupon,omitempty"`
	// Ticket   Ticket  `json:"ticket,omitempty"`
	Quiz     Quiz    `json:"quiz,omitempty"`
	Quantity int     `gorm:"column:quantity; not null;" json:"quantity"`
	Price    float64 `gorm:"column:price; not null;" json:"price"`
	// CouponID      uint        `gorm:"column:coupon_id; foreignKey:CouponID; references:ID" json:"coupon_id,omitempty"`

	gorm.Model
}

// TableName : ticket
func (c *OrderItem) TableName() string {
	return "orderItem"
}
