package errors

import (
	"comp-performance/api/responses"
	"log"
	"net/http"
)

// CheckAndReturnResponseWithError : check if error is not nil, and return error response
func CheckAndReturnResponseWithError(w http.ResponseWriter, statusCode int, err error) {
	if err != nil {
		responses.ERROR(w, statusCode, err)
		return
	}
	
}

// CheckAndLogFatalError will log fatal errors
func CheckAndLogFatalError(err error) {
	if err != nil {
		log.Fatal(err)
	}
}
