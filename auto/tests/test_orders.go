package tests

import (
	"comp-performance/api/models"
	"gorm.io/gorm"
	"log"
)

var ordersArr = []models.Order{
	{
		UserID:        1,
		OrderStatusID: 1,
		Total:         3588,
		NumberOfTickets: 4,
		NumberOfCompetitions : 1,
		OrderItems: []models.OrderItem{
			{
				CompetitionID: 1,
				CouponUsed:	false,
				TicketID: 10,
				QuizID: 1,
				GivenAnswer: 1,
				IsAnswerRight:  false,
			},
			{
				CompetitionID: 1,
				CouponUsed:	false,
				TicketID: 11,
				QuizID: 1,
				GivenAnswer: 1,
				IsAnswerRight:  false,
			},
			{
				CompetitionID: 1,
				CouponUsed:	false,
				TicketID: 12,
				QuizID: 1,
				GivenAnswer: 1,
				IsAnswerRight:  false,
			},
			{
				CompetitionID: 1,
				CouponUsed:	false,
				TicketID: 13,
				QuizID: 1,
				GivenAnswer: 1,
				IsAnswerRight:  false,
			},
		},
	},
		{
		UserID:        1,
		OrderStatusID: 1,
		Total:         1200,
		NumberOfTickets: 4,
		NumberOfCompetitions : 2,
		OrderItems: []models.OrderItem{
			{
				CompetitionID: 1,
				CouponUsed:	false,
				TicketID: 10,
				QuizID: 1,
				GivenAnswer: 1,
				IsAnswerRight:  false,
			},
			{
				CompetitionID: 1,
				CouponUsed:	false,
				TicketID: 11,
				QuizID: 1,
				GivenAnswer: 1,
				IsAnswerRight:  false,
			},
			{
				CompetitionID: 2,
				CouponUsed:	false,
				TicketID: 12,
				QuizID: 2,
				GivenAnswer: 1,
				IsAnswerRight:  false,
			},
			{
				CompetitionID: 2,
				CouponUsed:	false,
				TicketID: 13,
				QuizID: 2,
				GivenAnswer: 1,
				IsAnswerRight:  false,
			},
		},
	},
}

func testOrder(db *gorm.DB) {
	for _, o := range ordersArr {
		err := db.Debug().Model(&models.Order{}).Create(&o).Error
		if err != nil {
			log.Fatal(err)
		}
	}
}
