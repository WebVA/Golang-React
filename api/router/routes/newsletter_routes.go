package routes

import (
	"comp-performance/api/controllers"
	"net/http"
)

var newsLetterRoutes = []Route{
	{
		URI:          "/news-letter/subscribe",
		Method:       http.MethodPost,
		Handler:      controllers.SubscribeToNewsLetter,
		AuthRequired: false,
	},
}
