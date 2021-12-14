package crud

import (
	"comp-performance/api/utils/paytriot"
)

func CreatePaymentRequest(payment_type string, amount float64) (string, string, error) {
	return paytriot.CreatePaymentRequest(payment_type, amount)
}
