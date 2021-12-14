package auto

import (
	"comp-performance/api/database"
	"comp-performance/api/models"
	compErrors "comp-performance/api/utils/errors"
	dbTests "comp-performance/auto/tests"
	"fmt"
	"log"

	"gorm.io/gorm"
)

type TestModel struct {
	gorm.Model
	Headline string `gorm:"column:headline;  type:longtext;" json:"headline"`
	Features string `gorm:"column:features;  type:longtext;" json:"features"`
}

// Load Auto tasks
func Load() {
	db, err := database.Connect()
	fmt.Println("connected to the database successfully,  ",
		db.Migrator().CurrentDatabase(),
		db.Dialector.Name(),
	)
	if err != nil {
		log.Fatal(err)
	}

	// dropAllTables(db)

	defer database.Close(db)

	err = db.Debug().AutoMigrate(
		&models.Address{},
		&models.AppOptions{},
		&models.Category{},
		&models.Country{},
		&models.Competition{},
		&models.User{},
		&models.EmailVerification{},
		&models.NewsLetter{},
		&models.Prize{},
		&models.Message{},
		&models.NotificationSettings{},
		&models.OrderStatus{},
		&models.PasswordRecoveryRequest{},
		&models.Quiz{},
		&models.Ticket{},
		&models.Order{},
		&models.OrderItem{},
		&TestModel{},
	)

	dbTests.RunTests(db)

	upSertFirstOrder(db)
}

func dropAllTables(db *gorm.DB) {
	allTables := []interface{}{
		&models.Address{},
		&models.Category{},
		&models.Country{},
		&models.Competition{},
		&models.Prize{},
		&models.NotificationSettings{},
		&models.Order{},
		&models.OrderItem{},
		&models.OrderStatus{},
		&models.Quiz{},
		&models.Ticket{},
		&models.User{},
		&models.Message{},
	}

	for i := range allTables {
		err := db.Migrator().DropTable(allTables[i])
		compErrors.CheckAndLogFatalError(err)
	}

}

func createAllTables(db *gorm.DB) {
	err := db.Migrator().CreateTable(&models.User{})
	compErrors.CheckAndLogFatalError(err)
	err = db.Migrator().CreateTable(&models.Address{})
	compErrors.CheckAndLogFatalError(err)
	err = db.Migrator().CreateTable(&models.Country{})
	compErrors.CheckAndLogFatalError(err)
	log.Print("tabels created successfully")
}

func upSertFirstOrder(db *gorm.DB) {
	firstOrder := models.Order{}
	templateOrder := models.Order{}
	err := db.Debug().Model(&models.Order{}).Find(&firstOrder, "id = ?", uint(10000)).Error
	templateOrder.ID = 10000
	templateOrder.UserID = 1
	templateOrder.OrderStatusID = 1
	if firstOrder.ID == 0 {
		err = db.Debug().Model(models.Order{}).Create(&templateOrder).Error
	}
	if err != nil {
		log.Fatal(err)
	}
}
