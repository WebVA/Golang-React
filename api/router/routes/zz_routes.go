package routes

import (
	"comp-performance/api/controllers"
	"comp-performance/api/middlewares"

	// "fmt"
	// "flag"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gorilla/mux"
)

// Route struct: a single route information
type Route struct {
	URI           string
	Method        string
	Handler       func(http.ResponseWriter, *http.Request)
	AuthRequired  bool
	AdminRequired bool
}

type spaHandler struct {
	staticPath string
	indexPath  string
}

// Load all routes into one slice (array) of routes
func Load() []Route {
	routes := indexRoutes
	routes = append(routes, appOptionsRoues...)
	routes = append(routes, addressRoutes...)
	routes = append(routes, categoryRoutes...)
	routes = append(routes, competitionRoutes...)
	routes = append(routes, prizeRoutes...)
	routes = append(routes, emailVerificationRoutes...)
	routes = append(routes, newsLetterRoutes...)
	routes = append(routes, imageRoutes...)
	routes = append(routes, loginRoutes...)
	routes = append(routes, messageRoutes...)
	routes = append(routes, notificationSettingsRoutes...)
	routes = append(routes, orderRoutes...)
	routes = append(routes, orderStatusRoutes...)
	routes = append(routes, passwordRecoveryRoutes...)
	routes = append(routes, quizRoutes...)
	routes = append(routes, stripeRoutes...)
	routes = append(routes, paytriotRoutes...)
	routes = append(routes, sendGridRoutes...)
	routes = append(routes, ticketRoutes...)
	routes = append(routes, usersRoutes...)
	routes = append(routes, uploadRoutes...)
	routes = append(routes, couponRoutes...)
	return routes
}

// SetupRoutesWithMiddlewares will prepare different middlewares depends on the route conditions
func SetupRoutesWithMiddlewares(r *mux.Router) *mux.Router {
	api := r.PathPrefix("/api/").Subrouter()
	for _, route := range Load() {
		if route.AdminRequired {
			api.HandleFunc(route.URI,
				middlewares.SetMiddlewareLogger(
					middlewares.SetMiddlewareAdmin(
						middlewares.SetMiddlewareJSON(
							route.Handler,
						),
					),
				),
			).Methods(route.Method)
		} else if route.AuthRequired {
			api.HandleFunc(route.URI,
				middlewares.SetMiddlewareLogger(
					middlewares.SetMiddlewareAuthentication(
						middlewares.SetMiddlewareJSON(
							route.Handler,
						),
					),
				),
			).Methods(route.Method)
		} else {
			api.HandleFunc(route.URI,
				middlewares.SetMiddlewareLogger(
					middlewares.SetMiddlewareJSON(
						route.Handler,
					),
				),
			).Methods(route.Method)
		}
	}

	api.Methods(http.MethodOptions).HandlerFunc(controllers.AllowCors)

	// /** done serving the api **/
	// // Serve static files
	// r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("./client/build/"))))
	// r.PathPrefix("/competition/static/").Handler(http.StripPrefix("/competition/static/", http.FileServer(http.Dir("./client/build/"))))
	// r.PathPrefix("/category/static/").Handler(http.StripPrefix("/category/static/", http.FileServer(http.Dir("./client/build/"))))
	// r.PathPrefix("/account/static/").Handler(http.StripPrefix("/account/static/", http.FileServer(http.Dir("./client/build/"))))
	// r.PathPrefix("/admin/static/").Handler(http.StripPrefix("/admin/static/", http.FileServer(http.Dir("./client/build/"))))
	// r.PathPrefix("/previous-winner/static/").Handler(http.StripPrefix("/previous-winner/static/", http.FileServer(http.Dir("./client/build/"))))
	// r.PathPrefix("/set-new-password/static/").Handler(http.StripPrefix("/set-new-password/static/", http.FileServer(http.Dir("./client/build/"))))
	// r.PathPrefix("/verify-email/static/").Handler(http.StripPrefix("/verify-email/static/", http.FileServer(http.Dir("./client/build/"))))

	// r.PathPrefix("/img/").Handler(http.FileServer(http.Dir("./client/build/")))

	// // Serve index page on all unhandled routes
	// r.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	// 	http.ServeFile(w, r, "./client/build/index.html")
	// })

	// currentDir, _ := filepath.Abs(filepath.Dir(os.Args[0]))

	distDir := filepath.Join("client", "build")
	spa := spaHandler{staticPath: distDir, indexPath: "index.html"}
	r.PathPrefix("/").Handler(spa)

	return r
}

func (h spaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	path := filepath.Join(h.staticPath, r.URL.Path)
	log.Println(path)
	indexFile := filepath.Join(h.staticPath, h.indexPath)
	log.Println(indexFile)
	_, err := os.Stat(path)
	if os.IsNotExist(err) {
		http.ServeFile(w, r, indexFile)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	http.FileServer(http.Dir(h.staticPath)).ServeHTTP(w, r)
}
