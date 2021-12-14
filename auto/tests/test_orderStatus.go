package tests

import (
	"comp-performance/api/models"
	"gorm.io/gorm"
	"log"
)

var orderStatusArray = []models.OrderStatus{
	{Status: "pending"},
	{Status: "completed"},
	{Status: "cancelled"},
}

func testOrderStatus(db *gorm.DB) {
	for _, o := range orderStatusArray {
		err := db.Debug().Model(&models.OrderStatus{}).Create(&o).Error
		if err != nil {
			log.Fatal(err)
		}
	}
}
