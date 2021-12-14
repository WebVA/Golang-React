package tests

import (
	"comp-performance/api/models"
	"fmt"
	"gorm.io/gorm"
	"log"
)

func testCoupons(db *gorm.DB) {
	createFivePrizes(db, 1)
	createFivePrizes(db, 2)
	createFivePrizes(db, 3)
	createFivePrizes(db, 4)

}

func chooseOne(arr []string, index int) string {
	if index%2 == 0 {
		return arr[0]
	} else {
		return arr[1]
	}
}

func createFivePrizes(db *gorm.DB, couponTypeID int) {
	types := make([]string, 2)
	types = append(types, "amount_off", "precent_off")

	for i := 0; i < 5; i++ {
		var c = models.Prize{
			Title:          fmt.Sprintf("prize %v", i),
			Description:    fmt.Sprintf("this is a description %v", i),
			Type:           chooseOne(types, i),
			PointsRequired: i * 13,
			PrizeValue:     float64(float64(i)*float64(3.33) + 13),
		}

		err := db.Debug().Model(&models.Prize{}).Create(&c).Error
		if err != nil {
			log.Fatal(err)
		}
	}

}
