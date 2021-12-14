package config

import (
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

// PORT is server port
var (
	PORT                         = ""
	DBDRIVER                     = ""
	DBURL                        = ""
	CLIENTURL                    = ""
	DEVDBURL                     = ""
	SECRETKEY                    []byte
	PAYMENTS_METHOD_TYPES        []string
	STRIPE_SECRET_KEY            = ""
	SENDGRID_API_KEY             = ""
	CURRENCY                     = ""
	PAYTRIOT_SERVICE_URL         = ""
	PAYTRIOT_MERCHANT_ACCOUNT    = ""
	PAYTRIOT_DEPOSIT_CATEGORY    = ""
	PAYTRIOT_MERCHANT_KEY        = ""
	PAYTRIOT_MERCHANT_SECRET_KEY = ""
)

// Load config data from environment
func Load() {
	var err error
	err = godotenv.Load()
	if err != nil {
		log.Fatal(err)
	}
	PORT = os.Getenv("PORT")
	DBDRIVER = os.Getenv("DBDRIVER")
	APPENV := os.Getenv("APP_ENV")
	DBURL = fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
	)

	if APPENV == "dev" {
		DBURL = fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true",
			os.Getenv("DEV_DB_USER"),
			os.Getenv("DEV_DB_PASSWORD"),
			os.Getenv("DEV_DB_HOST"),
			os.Getenv("DEV_DB_PORT"),
			os.Getenv("DEV_DB_NAME"),
		)
	}

	SECRETKEY = []byte(os.Getenv("SECRETKEY"))

	PAYMENTS_METHOD_TYPES = strings.Split(os.Getenv(
		"PAYMENTS_METHOD_TYPES"), ",")

	STRIPE_SECRET_KEY = os.Getenv("STRIPE_SECRET_KEY")

	SENDGRID_API_KEY = os.Getenv("SENDGRID_API_KEY")

	CURRENCY = os.Getenv("CURRENCY")

	env := getEnv()

	if env == "dev" {
		CLIENTURL = os.Getenv("CLIENTURL_DEV")
	} else {
		CLIENTURL = os.Getenv("CLIENTURL")
	}
	PAYTRIOT_SERVICE_URL = os.Getenv("PAYTRIOT_SERVICE_URL")
	PAYTRIOT_MERCHANT_ACCOUNT = os.Getenv("PAYTRIOT_MERCHANT_ACCOUNT")
	PAYTRIOT_DEPOSIT_CATEGORY = os.Getenv("PAYTRIOT_DEPOSIT_CATEGORY")
	PAYTRIOT_MERCHANT_KEY = os.Getenv("PAYTRIOT_MERCHANT_KEY")
	PAYTRIOT_MERCHANT_SECRET_KEY = os.Getenv("PAYTRIOT_MERCHANT_SECRET_KEY")

	fmt.Println(CLIENTURL)

}

func getEnv() string {

	return os.Getenv("APP_ENV")
}
