package routes

import (
	"comp-performance/api/controllers"
	"net/http"
)

var couponRoutes = []Route{
	{
		URI:          "/coupon/create-coupon",
		Method:       http.MethodPost,
		Handler:      controllers.CreateCoupon,
		AuthRequired: true,
	},
	{
		URI:          "/coupon/get-coupon-data",
		Method:       http.MethodPost,
		Handler:      controllers.GetCouponData,
		AuthRequired: true,
	},
}
