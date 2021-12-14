package controllers

import (
	"comp-performance/api/auth"
	"comp-performance/api/models"
	"comp-performance/api/responses"
	"encoding/json"
	"errors"
	"io"
	"net/http"
)

// Login controller function
func Login(w http.ResponseWriter, r *http.Request) {
	user := models.User{}

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		if err == io.EOF {
			err = errors.New("Email or password cannot be empty")
		}

		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	user.Prepare()

	err = user.Validate("login")
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, errors.New("Email or password cannot be empty"))
		return
	}

	resp, err := auth.SignIn(user.Email, user.Password)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, errors.New("Email and password does not match"))
		return
	}
	responses.JSON(w, http.StatusOK, resp)

}
