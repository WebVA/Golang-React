package controllers

import (
	"comp-performance/api/database"
	"comp-performance/api/models"
	"comp-performance/api/repository"
	"comp-performance/api/repository/crud"
	"comp-performance/api/responses"
	// compErrors "comp-performance/api/utils/errors"
	"encoding/json"
	"fmt"
	"net/http"
)

// SubscribeToNewsLetter will save new sub to the db and redirect to its page
func SubscribeToNewsLetter(w http.ResponseWriter, r *http.Request) {
	sub := models.NewsLetter{}
	err := json.NewDecoder(r.Body).Decode(&sub)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	db, err := database.Connect()
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
	}
	defer database.Close(db)

	repo := crud.NewRepositoryNewsLetterCrud(db)

	func(newsletterRepo repository.NewsLetterRepository) {
		err := newsletterRepo.Save(sub)
		if err != nil {
			responses.ERROR(w, http.StatusUnprocessableEntity, err)
			return
		}

		w.Header().Set("Location", fmt.Sprintf("%s%s/%d", r.Host, r.RequestURI, sub.ID))
		responses.JSON(w, http.StatusCreated, sub)
	}(repo)
}
