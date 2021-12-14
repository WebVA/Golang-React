package routes

import (
	"comp-performance/api/controllers"
	"net/http"
)

var categoryRoutes = []Route{
	{
		URI:          "/categories",
		Method:       http.MethodGet,
		Handler:      controllers.GetAllCategories,
		AuthRequired: false,
	},
	{
		URI:           "/categories",
		Method:        http.MethodPost,
		Handler:       controllers.CreateCategory,
		AuthRequired:  true,
		AdminRequired: true,
	},
	{
		URI:          "/categories/id/{id}",
		Method:       http.MethodGet,
		Handler:      controllers.GetCategoryByID,
		AuthRequired: false,
	},
	{
		URI:           "/categories/id/{id}",
		Method:        http.MethodDelete,
		Handler:       controllers.DeleteCategoryByID,
		AuthRequired:  true,
		AdminRequired: true,
	},
	{
		URI:           "/categories/id/{id}",
		Method:        http.MethodPost,
		Handler:       controllers.UpdateCategoryByID,
		AuthRequired:  true,
		AdminRequired: true,
	},
}
