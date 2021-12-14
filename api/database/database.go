package database

import (
	"comp-performance/config"
	"gorm.io/gorm"
	// "gorm.io/gorm/schema"
	"fmt"
	"gorm.io/driver/mysql"
)

// Connect app to the db
func Connect() (*gorm.DB, error) {
	db, err := gorm.Open(
		mysql.New(mysql.Config{
			DSN: config.DBURL,
		}), &gorm.Config{},
	)

	if err != nil {
		return nil, err
	}
	return db, nil
}

// Close DB, don't use it, just in case
func Close(db *gorm.DB) error {
	sqlDb, err := db.DB()

	if err != nil {
		fmt.Println("closing db error:", err)
		return err
	}

	defer sqlDb.Close()
	return nil
}
