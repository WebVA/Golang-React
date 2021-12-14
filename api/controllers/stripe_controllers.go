package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/stripe/stripe-go/v72"
	"github.com/stripe/stripe-go/v72/checkout/session"
	"github.com/stripe/stripe-go/v72/coupon"
	"github.com/stripe/stripe-go/v72/promotioncode"

	// "github.com/stripe/stripe-go/v72/price"
	// "github.com/stripe/stripe-go/v72/webhook"
	// "comp-performance/api/utils/types"
	"comp-performance/api/auth"
	"comp-performance/api/models"
	"comp-performance/api/responses"
	"comp-performance/api/utils/cors"
	"comp-performance/config"
	"fmt"

	// "log"
	"time"
)

// CreateCheckoutRedirectionSessionID create a new checkout session, retrieve its ID.
func CreateCheckoutRedirectionSessionID(w http.ResponseWriter, r *http.Request) {

	// items := []*stripe.CheckoutSessionLineItemParams{}
	type reqType struct {
		LineItems []*stripe.CheckoutSessionLineItemParams `json:"line_items"`
	}

	req := reqType{}

	err := json.NewDecoder(r.Body).Decode(&req)

	fmt.Println(err)

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}

	// log.Print(req)

	// fmt.Println("items>>>>>>>>", req.LineItems[0].Images[0])
	// fmt.Printf("%v %T \n", req.LineItems[0].Images[0], req.LineItems[0].Images[0])
	// fmt.Printf("%v %T \n", (*req.LineItems[0].Images[0]), *req.LineItems[0].Images[0])
	// fmt.Println("stripe key >>>>>>>>", stripe.Key)

	domainURL := config.CLIENTURL
	paymentMethodTypes := config.PAYMENTS_METHOD_TYPES

	var options = stripe.CheckoutSessionShippingAddressCollectionParams{
		AllowedCountries: []*string{stripe.String("GB")},
	}
	params := &stripe.CheckoutSessionParams{
		SuccessURL:                stripe.String(domainURL + "/payment-success?session_id={CHECKOUT_SESSION_ID}"),
		CancelURL:                 stripe.String(domainURL + "/cart"),
		PaymentMethodTypes:        stripe.StringSlice(paymentMethodTypes),
		Mode:                      stripe.String(string(stripe.CheckoutSessionModePayment)),
		LineItems:                 req.LineItems,
		ShippingAddressCollection: &options,
		AllowPromotionCodes:       stripe.Bool(true),
	}
	s, err := session.New(params)

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}

	fmt.Println("session", s)

	cors.EnableCors(&w)

	responses.JSON(w, http.StatusOK, struct {
		SessionID string `json:"sessionId"`
	}{
		SessionID: s.ID,
	})

}

// GetCheckoutSessionData , retrieve all successful session details to save them to the DB.
func GetCheckoutSessionData(w http.ResponseWriter, r *http.Request) {
	type reqType struct {
		SessionID string `json:"session_id"`
	}

	req := reqType{}

	err := json.NewDecoder(r.Body).Decode(&req)

	fmt.Println(err)

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}

	s, err := session.Get(
		req.SessionID,
		nil,
	)

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}

	fmt.Println("session", s)

	responses.JSON(w, http.StatusOK, struct {
		Session *stripe.CheckoutSession `json:"session"`
	}{
		Session: s,
	})

}

func StripeCreateCoupon(w http.ResponseWriter, r *http.Request) {

	type reqType struct {
		Type       string      `json:"type"`
		AmountOff  int64       `json:"amount_off"`
		PercentOff float64     `json:"percent_off"`
		User       models.User `json:"user"`
	}

	req := reqType{}

	err := json.NewDecoder(r.Body).Decode(&req)

	fmt.Println(err)

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}

	fourTeenDaysMore := time.Now().Add(14 * 24 * time.Hour).Unix()
	params := &stripe.CouponParams{
		Duration:       stripe.String("once"),
		RedeemBy:       stripe.Int64(fourTeenDaysMore),
		Currency:       stripe.String(config.CURRENCY),
		MaxRedemptions: stripe.Int64(1),
	}

	if req.Type == "amount_off" {
		params.AmountOff = stripe.Int64(req.AmountOff)
	}

	if req.Type == "percent_off" {
		params.PercentOff = stripe.Float64(req.PercentOff)
	}

	c, _ := coupon.New(params)

	/**
	* coupons are not valid in the checkout, we need to use promotion codes
	 */

	pc_params := &stripe.PromotionCodeParams{
		Coupon: stripe.String(c.ID),
		Code:   stripe.String(c.ID),
	}
	pc, _ := promotioncode.New(pc_params)
	user := req.User

	from_email := "noreply@comp-performance.co.uk"
	from_name := "Comp Performance Limited"
	to_email := user.Email
	to_name := user.FirstName + " " + user.LastName
	subject := fmt.Sprintf("Your coupon receipt! ")

	emailContent := "<p>Thank you for requesting a coupon, here is your coupon number <p> <h1>" + c.ID + "</h1>"

	err = auth.SendEmail(from_email, from_name, to_email, to_name, subject, "", emailContent)

	responses.JSON(w, http.StatusOK, pc)

}
