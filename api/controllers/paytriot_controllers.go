package controllers

import (
	"encoding/json"
	"net/http"

	// "github.com/stripe/stripe-go/v72/price"
	// "github.com/stripe/stripe-go/v72/webhook"
	// "comp-performance/api/utils/types"

	"comp-performance/api/repository/crud"
	"comp-performance/api/responses"
	"comp-performance/api/utils/cors"
	"fmt"
	// "log"
)

// CreateCheckoutRedirectionSessionID create a new checkout session, retrieve its ID.
func CreatePaymentRequest(w http.ResponseWriter, r *http.Request) {

	// items := []*stripe.CheckoutSessionLineItemParams{}
	type reqType struct {
		TotalAmount float64 `json:"totalAmount"`
		PaymentType string  `json:"type"`
	}

	cors.EnableCors(&w)

	req := reqType{}
	err := json.NewDecoder(r.Body).Decode(&req)

	fmt.Println(err)

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}

	requestLink, ts, err := crud.CreatePaymentRequest(req.PaymentType, req.TotalAmount)

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}

	responses.JSON(w, http.StatusOK, struct {
		RequestLink string `json:"requestLink"`
		SessionId   string `json:"sessionId"`
	}{
		RequestLink: requestLink,
		SessionId:   ts,
	})

}
