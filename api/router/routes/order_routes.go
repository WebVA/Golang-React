package routes

import (
	"comp-performance/api/controllers"
	"net/http"
)

var orderRoutes = []Route{
	{
		URI:          "/orders",
		Method:       http.MethodGet,
		Handler:      controllers.GetAllOrders,
		AuthRequired: true,
	},
	{
		URI:          "/orders/buyer/{id}",
		Method:       http.MethodGet,
		Handler:      controllers.GetOrdersByBuyerID,
		AuthRequired: true,
	},
	{
		URI:          "/orders/full",
		Method:       http.MethodGet,
		Handler:      controllers.GetAllFullOrders,
		AuthRequired: true,
	},
	{
		URI:          "/orders",
		Method:       http.MethodPost,
		Handler:      controllers.CreateOrder,
		AuthRequired: true,
	},
	{
		URI:          "/orders/id/{id}",
		Method:       http.MethodGet,
		Handler:      controllers.GetOrderByID,
		AuthRequired: true,
	},
		{
		URI:          "/orders/full/id/{id}",
		Method:       http.MethodGet,
		Handler:      controllers.GetFullOrderByID,
		AuthRequired: true,
	},
	{
		URI:          "/orders/id/{id}",
		Method:       http.MethodDelete,
		Handler:      controllers.DeleteOrderByID,
		AuthRequired: true,
	},
	{
		URI:          "/orders/id/{id}",
		Method:       http.MethodPost,
		Handler:      controllers.UpdateOrderByID,
		AuthRequired: true,
	},
}
