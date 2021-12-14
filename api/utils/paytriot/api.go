package paytriot

import (
	"comp-performance/config"
	"fmt"
	"strconv"
	"time"
)

func CreatePaymentRequest(payment_type string, amount float64) (string, string, error) {
	ts := strconv.FormatInt(time.Now().UnixNano(), 10)
	domainURL := config.CLIENTURL

	requestLink, err := postRequest(
		"https://api.paytriot.co.uk/api/merchant/v/1.0/function/create_payment_request_link",
		map[string]string{
			"type":                payment_type,
			"amount":              fmt.Sprintf("%f", amount),
			"account_id":          config.PAYTRIOT_MERCHANT_ACCOUNT,
			"currency":            config.CURRENCY,
			"url_user_on_success": domainURL + "/payment-success?session_id=" + ts,
			"url_user_on_fail":    domainURL + "/cart",
			"url_api_on_success":  "",
			"url_api_on_fail":     "",
			"no_expiration":       "0",
			"deposit_category":    config.PAYTRIOT_DEPOSIT_CATEGORY,
			"ts":                  ts,
		},
		[]string{
			"type",
			"amount",
			"account_id",
			"currency",
			"url_user_on_success",
			"url_user_on_fail",
			"url_api_on_success",
			"url_api_on_fail",
			"no_expiration",
			"deposit_category",
			"key",
			"ts",
		},
	)
	return requestLink, ts, err
}
