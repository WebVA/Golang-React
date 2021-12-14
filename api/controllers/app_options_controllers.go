package controllers

import (
	"comp-performance/api/database"
	"comp-performance/api/models"
	"comp-performance/api/repository"
	"comp-performance/api/repository/crud"
	"comp-performance/api/responses"

	// "fmt"
	"encoding/json"
	"net/http"
)

// GetAppOptions
func GetAppOptions(w http.ResponseWriter, r *http.Request) {
	db, err := database.Connect()
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
	}
	defer database.Close(db)

	repo := crud.NewRepositoryAppOptionsCrud(db)

	func(r repository.AppOptionsRepository) {
		options, err := r.FindAll()

		if err != nil {
			responses.ERROR(w, http.StatusInternalServerError, err)
		}

		responses.JSON(w, http.StatusOK, options)

	}(repo)

}

// AddAppOptions
func AddAppOptions(w http.ResponseWriter, r *http.Request) {
	opt := models.AppOptions{}
	err := json.NewDecoder(r.Body).Decode(&opt)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}
	db, err := database.Connect()
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
	}
	defer database.Close(db)

	repo := crud.NewRepositoryAppOptionsCrud(db)

	func(r repository.AppOptionsRepository) {
		options, err := r.Add(opt)

		if err != nil {
			responses.ERROR(w, http.StatusInternalServerError, err)
		}

		responses.JSON(w, http.StatusOK, options)

	}(repo)

}

// UpdateAppOptions
func UpdateAppOptions(w http.ResponseWriter, r *http.Request) {
	opt := models.AppOptions{}
	err := json.NewDecoder(r.Body).Decode(&opt)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}
	db, err := database.Connect()
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
	}
	defer database.Close(db)

	repo := crud.NewRepositoryAppOptionsCrud(db)

	func(r repository.AppOptionsRepository) {
		options, err := r.Update(opt)

		if err != nil {
			responses.ERROR(w, http.StatusInternalServerError, err)
		}

		responses.JSON(w, http.StatusOK, options)

	}(repo)

}
