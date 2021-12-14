package tests

import (
	"comp-performance/api/models"
	compErrors "comp-performance/api/utils/errors"
	"gorm.io/gorm"
	"log"
	// "time"
)

/**
** Test Users Table
**/
var country1 = models.Country{
	Code:          44,
	Name:          "UK",
	ContinentName: "Europe",
}

var country2 = models.Country{
	Code:          1,
	Name:          "US",
	ContinentName: "America",
}

var address1 = models.Address{
	Country:     country1,
	City:        "London",
	AddressLine: "city 123",
	ZipCode:     "HA1 45S",
}

var address2 = models.Address{
	Country:     country2,
	City:        "London",
	AddressLine: "city 123, ",
	ZipCode:     "HA1 45S",
}

var notify = models.NotificationSettings{
	NewCompetitions:         true,
	Discounts:               false,
	EndingSoonCompetitions:  false,
	Winner:                  false,
	CompetitionEntryDetails: true,
}

var usersArr = []models.User{
	{
		Email:                "email@example.com",
		Password:             "pass",
		FirstName:            "Ahmad",
		LastName:             "Ali",
		Username:             "user1",
		Address:              address1,
		NotificationSettings: notify,
	},
	{
		Email:                "email1@example.comm",
		Password:             "pass",
		FirstName:            "Ross",
		LastName:             "K",
		Username:             "user2",
		Address:              address2,
		NotificationSettings: notify,
	},
	{
		Email:                "aallii300300@gmail.comm",
		Password:             "pass",
		FirstName:            "Ahmad",
		LastName:             "Ali",
		Username:             "user3",
		Address:              address2,
		NotificationSettings: notify,
		Role:                 "admin",
	},
}

func testUsers(db *gorm.DB) {
	for _, u := range usersArr {

		err := db.Debug().Model(&models.User{}).Create(&u).Error

		if err != nil {
			log.Fatal(err)
		}

	}

	usr := models.User{}
	ctr := models.Country{}
	addr := models.Address{}

	err := db.Debug().Model(&models.User{}).Where("ID", 2).First(&usr).Error
	compErrors.CheckAndLogFatalError(err)
	err = db.Debug().Model(&models.Address{}).Where("ID", usr.AddressID).First(&addr).Error
	compErrors.CheckAndLogFatalError(err)

	err = db.Debug().Model(&models.Country{}).Where("Code", addr.CountryCode).First(&ctr).Error
	compErrors.CheckAndLogFatalError(err)

	addr.Country = ctr
	usr.Address = addr

	//	log.Print(usr)

}
