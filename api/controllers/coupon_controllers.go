package controllers

import (
	"encoding/json"
	"errors"
	"math/rand"
	"net/http"
	"time"

	// "github.com/stripe/stripe-go/v72/price"
	// "github.com/stripe/stripe-go/v72/webhook"
	// "comp-performance/api/utils/types"
	"comp-performance/api/auth"
	"comp-performance/api/database"
	"comp-performance/api/models"
	"comp-performance/api/repository"
	"comp-performance/api/repository/crud"
	"comp-performance/api/responses"
	"fmt"
	// "log"
)

const letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"

func RandStringBytes(n int) string {
	b := make([]byte, n)
	rand.Seed(time.Now().Unix())
	for i := range b {
		b[i] = letterBytes[rand.Intn(len(letterBytes))]
	}
	return string(b)
}

func CreateCoupon(w http.ResponseWriter, r *http.Request) {
	type reqType struct {
		Type       string      `json:"type"`
		AmountOff  float64     `json:"amount_off"`
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

	coupon_code := RandStringBytes(8)

	newCoupon := models.Coupon{}
	newCoupon.CouponCode = coupon_code
	newCoupon.Type = req.Type
	if req.Type == "amount_off" {
		newCoupon.Amount = req.AmountOff
	} else if req.Type == "percent_off" {
		newCoupon.Amount = req.PercentOff
	}
	newCoupon.Available = true

	db, err := database.Connect()
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
	}
	defer database.Close(db)

	repo := crud.NewRepositoryCouponCrud(db)

	func(couponRepository repository.CouponRepository) {
		coupon, err := couponRepository.Save(newCoupon)

		if err != nil {
			responses.ERROR(w, http.StatusInternalServerError, err)
			return
		}

		user := req.User

		from_email := "noreply@comp-performance.co.uk"
		from_name := "Comp Performance Limited"
		to_email := user.Email
		to_name := user.FirstName + " " + user.LastName
		subject := "Your coupon receipt! "

		emailContent := "<p>Thank you for requesting a coupon, here is your coupon number <p> <h1>" + coupon.CouponCode + "</h1>"

		err = auth.SendEmail(from_email, from_name, to_email, to_name, subject, "", emailContent)

		if err != nil {
			responses.ERROR(w, http.StatusInternalServerError, err)
			return
		}

		w.Header().Set("Location", fmt.Sprintf("%s%s/%s", r.Host, r.RequestURI, coupon.CouponCode))
		responses.JSON(w, http.StatusCreated, coupon)
	}(repo)
}

func GetCouponData(w http.ResponseWriter, r *http.Request) {
	type reqType struct {
		CouponCode string `json:"coupon_code"`
	}

	req := reqType{}

	err := json.NewDecoder(r.Body).Decode(&req)

	fmt.Println(err)

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}

	if req.CouponCode == "" {
		responses.ERROR(w, http.StatusBadRequest, errors.New("invalid coupon code"))
		return
	}

	db, err := database.Connect()

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
	}
	defer database.Close(db)

	repo := crud.NewRepositoryCouponCrud(db)

	func(couponRepository repository.CouponRepository) {
		coupon, err := couponRepository.FindByCode(req.CouponCode)

		if err != nil {
			responses.ERROR(w, http.StatusNotFound, err)
			return
		}

		responses.JSON(w, http.StatusOK, coupon)
	}(repo)
}
