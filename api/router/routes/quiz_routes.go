package routes

import (
	"comp-performance/api/controllers"
	"net/http"
)

var quizRoutes = []Route{
	{
		URI:          "/quizzes",
		Method:       http.MethodGet,
		Handler:      controllers.GetAllQuizzes,
		AuthRequired: true,
		AdminRequired: true,
	},
	{
		URI:          "/quizzes",
		Method:       http.MethodPost,
		Handler:      controllers.CreateQuiz,
		AuthRequired: true,
		AdminRequired: true,
	},
	{
		URI:          "/quizzes/id/{id}",
		Method:       http.MethodGet,
		Handler:      controllers.GetQuizByID,
		AuthRequired: false,
	},
	{
		URI:          "/quizzes/id/{id}",
		Method:       http.MethodDelete,
		Handler:      controllers.DeleteQuizByID,
		AuthRequired: true,
		AdminRequired: true,
	},
	{
		URI:          "/quizzes/id/{id}",
		Method:       http.MethodPost,
		Handler:      controllers.UpdateQuizByID,
		AuthRequired: true,
		AdminRequired: true,
	},
}
