package tests

import (
	"comp-performance/api/models"
	"fmt"
	"gorm.io/gorm"
	"log"
	"time"
)

var quiz1 = models.Quiz{
	Question: "What is the current year?",
	Option1:  "2021",
	Option2:  "2019",
	Option3:  "1999",
	Option4:  "1700",
}

var category1 = models.Category{
	Name: "Men's Clothing",
}

var quiz2 = models.Quiz{
	Question: "When was the world war 2 started?",
	Option1:  "2021",
	Option2:  "1944",
	Option3:  "1913",
	Option4:  "1939",
}

var category2 = models.Category{
	Name: "Electronics",
}

var category3 = models.Category{
	Name: "Un-categorized",
}
var competitionsArr = []models.Competition{
	{
		Title:               "Simple Cotton Gray T-shirt",
		Price:               19.99,
		ReducedPrice:        14.99,
		EndTime:             time.Now().Add(time.Hour * 144),
		NumberOfTickets:     100,
		MaxTicketsPerPerson: 10,
		Quiz:                quiz1,
		Category:            category1,
	}, {

		Title:               "Wireless Headphones",
		Price:               44.99,
		ReducedPrice:        35.00,
		EndTime:             time.Now().Add(time.Hour * 14),
		NumberOfTickets:     1000,
		MaxTicketsPerPerson: 30,
		Quiz:                quiz2,
		Category:            category2,
	},

	{

		Title:               "Tea Cup, No category or quiz",
		Price:               44.99,
		ReducedPrice:        35.00,
		EndTime:             time.Now().Add(time.Hour * 14),
		NumberOfTickets:     1000,
		MaxTicketsPerPerson: 30,
		Quiz:                quiz2,
		Category:            category3,
	},
}

func testCompetitions(db *gorm.DB) {
	for _, c := range competitionsArr {
		err := db.Debug().Model(&models.Competition{}).Create(&c).Error
		//	err = createTicketTable(db, fmt.Sprintf("ticket_c_%d", c.ID))
		// err = initTickets(db, fmt.Sprintf("ticket_c_%d", c.ID), &c)
		if err != nil {
			log.Fatal(err)
		}
	}
}

func createTicketTable(db *gorm.DB, tableName string) error {
	err := db.Exec(fmt.Sprintf("CREATE TABLE IF NOT EXISTS`%s` (`competition_id` bigint NOT NULL, `ticket_number` bigint NOT NULL, `sold` boolean DEFAULT false, `buyer_id` bigint NOT NULL,`id` bigint unsigned AUTO_INCREMENT,`created_at` datetime(3) NULL,`updated_at` datetime(3) NULL,`deleted_at` datetime(3) NULL,PRIMARY KEY (`id`),INDEX idx_couponType_deleted_at (`deleted_at`))", tableName)).Error

	if err != nil {
		return err
	}
	return nil
}

func initTickets(db *gorm.DB, tableName string, c *models.Competition) error {

	for i := 0; i < c.NumberOfTickets; i++ {
		var t = models.Ticket{
			CompetitionID: c.ID,
			TicketNumber:  i + 1,
		}
		err := db.Debug().Table(tableName).Create(&t).Error
		if err != nil {
			return err
		}

	}

	return nil
}
