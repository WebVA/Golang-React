package tests

import (
	"comp-performance/api/models"
	"gorm.io/gorm"
	"log"
)

var orderItemsArr = []models.OrderItem{
	{
		CompetitionID: 1,
		CouponUsed:    false,
		// TicketID:      44,
		OrderID:       1,
	},
	{
		CompetitionID: 1,
		CouponUsed:    true,
		// CouponID:      10,
		// TicketID:      444,
		OrderID:       1,
	},
}

func testOrderItem(db *gorm.DB) {
	for _, o := range orderItemsArr {
		err := db.Debug().Model(&models.OrderItem{}).Create(&o).Error
		if err != nil {
			log.Fatal(err)
		}
	}
}
