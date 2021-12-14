package controllers

import (
	"comp-performance/api/auth"
	"comp-performance/api/database"
	"comp-performance/api/models"
	"comp-performance/api/repository"
	"comp-performance/api/repository/crud"
	"comp-performance/api/responses"
	"comp-performance/api/utils/types"

	// compErrors "comp-performance/api/utils/errors"
	"encoding/json"
	"errors"
	"github.com/gorilla/mux"
	"net/http"
)

type Email struct {
	Email string `json:"email"`
}

type Password struct {
	Password string `json:"password"`
}


//
func RegisterNewPasswordRecoveryRequest(w http.ResponseWriter, r *http.Request) {
	email := Email{}
	err := json.NewDecoder(r.Body).Decode(&email)

	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	db, err := database.Connect()
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	defer database.Close(db)

	// if the user is in the DB, send email
	userRepo := crud.NewRepositoryUserCrud(db)
	usr, err := userRepo.FindByEmail(email.Email)

	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	if usr.ID == 0 {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	token, err := auth.SendPasswordRecoveryEmail(email.Email)

	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	passwordRecoveryRepo := crud.NewRepositoryPasswordRecoveryRequestCrud(db)

	passwordRecoveryRepo.Save(models.PasswordRecoveryRequest{
		Email: email.Email,
		Token: token,
	})

	responses.JSON(w, http.StatusOK, 1)
}

// SetNewPassword will SetNewPassword
func SetNewPassword(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	tokenString := vars["token"]

	pass := Password{}
	err := json.NewDecoder(r.Body).Decode(&pass)

	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	db, err := database.Connect()

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	defer database.Close(db)

	repo := crud.NewRepositoryPasswordRecoveryRequestCrud(db)

	func(passwordRecoveryRepo repository.PasswordRecoveryRequestRepository) {
		record, err := passwordRecoveryRepo.FindByToken(tokenString)
		if err != nil {
			responses.ERROR(w, http.StatusBadRequest, errors.New("Token is not recognized, please make a new request"))
			return
		}
		token, err := auth.ParseTokenString(tokenString)
		if err != nil {
			responses.ERROR(w, http.StatusBadRequest, err)
			return
		}

		if token.Valid {
			if claims, ok := token.Claims.(*types.EmailVerificationClaim); ok && token.Valid {
				// if the email matches the saved one
				if claims.Email == record.Email {
					// if token is not used, 1 - verify account, 2- mark token as used
					if record.Used == false {
						// verify account
						userRepo := crud.NewRepositoryUserCrud(db)
						err = userRepo.UpdatePassword(db, record.Email, pass.Password)
						if err != nil {
							responses.ERROR(w, http.StatusUnprocessableEntity, err)
							return
						}

						// mark token as used
						err = passwordRecoveryRepo.MarkTokenAsUsed(int(record.ID))
						if err != nil {
							responses.ERROR(w, http.StatusUnprocessableEntity, err)
							return
						}

						// success,
						responses.JSON(w, http.StatusOK, 1)
					} else {
						responses.ERROR(w, http.StatusBadRequest, errors.New("Token used or Expired"))
						return
					}

				} else {
					responses.ERROR(w, http.StatusBadRequest, errors.New("Token Invalid"))
					return
				}

			} else {
				responses.ERROR(w, http.StatusBadRequest, errors.New("Token Invalid"))
				return
			}

		}

	}(repo)

}
