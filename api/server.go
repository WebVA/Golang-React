package api

import (
	"comp-performance/api/router"
	"comp-performance/auto"
	"comp-performance/config"
	"fmt"
	"github.com/stripe/stripe-go/v72"
	"log"
	"net/http"
	"os"
	"strconv"
)

var (
	port = "9000"
)

func init() {
	config.Load()
	auto.Load()
}

// Run the server
func Run() {
	// Set Stripe API key
	apiKey := config.STRIPE_SECRET_KEY
	stripe.Key = apiKey

	port = os.Getenv("PORT")
	if port == "" {
		// log.Fatal("$PORT must be set")
		port = "9000"
	}

	pr, err := strconv.Atoi(port)

	if err != nil {
		if port == "" {
			log.Fatal("$PORT must be set")
		}
	}
	listen(pr)
}

func listen(p int) {
	r := router.New()
	fmt.Printf("\n\t server is listenint on: http://localhost:%s\n", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", p), r))
}
