package routes

import (
	"comp-performance/api/controllers"
	"net/http"
)

var usersRoutes = []Route{
	{
		URI:           "/users",
		Method:        http.MethodGet,
		Handler:       controllers.GetAllUsers,
		AuthRequired:  true,
		AdminRequired: true,
	},
	{
		URI:          "/users",
		Method:       http.MethodPost,
		Handler:      controllers.CreateUser,
		AuthRequired: false,
	},
	{
		URI:          "/users/id/{id}",
		Method:       http.MethodGet,
		Handler:      controllers.GetUserByID,
		AuthRequired: true,
	},
	{
		URI:           "/users/id/{id}",
		Method:        http.MethodDelete,
		Handler:       controllers.DeleteUserByID,
		AuthRequired:  true,
		AdminRequired: true,
	},
	{
		URI:          "/users/id/{id}",
		Method:       http.MethodPost,
		Handler:      controllers.UpdateUserByID,
		AuthRequired: true,
	},
	{
		URI:          "/update-reward-points",
		Method:       http.MethodPost,
		Handler:      controllers.UpdateUserRewardPoints,
		AuthRequired: true,
	},
}
