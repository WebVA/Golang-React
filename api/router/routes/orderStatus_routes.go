package routes

import (
	"comp-performance/api/controllers"
	"net/http"
)

var orderStatusRoutes = []Route{
	{
		URI:          "/order-status",
		Method:       http.MethodGet,
		Handler:      controllers.GetAllOrderStatuses,
		AuthRequired: false,
	},
	{
		URI:          "/order-status",
		Method:       http.MethodPost,
		Handler:      controllers.CreateOrderStatus,
		AuthRequired: true,
		AdminRequired: true,
	},
	{
		URI:          "/order-status/id/{id}",
		Method:       http.MethodGet,
		Handler:      controllers.GetOrderStatusByID,
		AuthRequired: false,
	},
	{
		URI:          "/order-status/id/{id}",
		Method:       http.MethodDelete,
		Handler:      controllers.DeleteOrderStatusByID,
		AuthRequired: false,
	},
	{
		URI:          "/order-status/id/{id}",
		Method:       http.MethodPost,
		Handler:      controllers.UpdateOrderStatusByID,
		AuthRequired: false,
	},
}
