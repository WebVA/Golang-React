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
	"fmt"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

// GetAllUsers will return the first 100 users
func GetAllUsers(w http.ResponseWriter, r *http.Request) {
	db, err := database.Connect()
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	defer database.Close(db)

	repo := crud.NewRepositoryUserCrud(db)

	func(userRepository repository.UserRepository) {
		users, err := userRepository.FindAll()

		if err != nil {
			responses.ERROR(w, http.StatusInternalServerError, err)
		}

		responses.JSON(w, http.StatusOK, users)

	}(repo)
}

// CreateUser will save new user to the db and redirect to its page
func CreateUser(w http.ResponseWriter, r *http.Request) {
	user := models.User{}
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, errors.New("Unable process your information, please check the information again."))
		return
	}

	user.Prepare()
	err = user.Validate("")

	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	db, err := database.Connect()
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, errors.New("Something went wrong, please try again."))
	}
	defer database.Close(db)

	repo := crud.NewRepositoryUserCrud(db)

	func(userRepository repository.UserRepository) {
		user, err := userRepository.Save(user)
		if err != nil {
			responses.ERROR(w, http.StatusUnprocessableEntity, errors.New("This email has already been registered, please go to login."))
			return
		}

		token, err := auth.SendVerificationEmail(user)
		// if err != nil {
		// 	responses.ERROR(w, http.StatusUnprocessableEntity, err)
		// 	return
		// }

		emailVerificationRepo := crud.NewRepositoryEmailVerification(db)

		emailVerificationRepo.Save(models.EmailVerification{
			Email: user.Email,
			Token: token,
		})
		w.Header().Set("Location", fmt.Sprintf("%s%s/%d", r.Host, r.RequestURI, user.ID))
		responses.JSON(w, http.StatusCreated, err)
	}(repo)
}

// GetUserByID will return the user with id specifies in the request
func GetUserByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	uid, err := strconv.ParseInt(vars["id"], 10, 64)

	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	db, err := database.Connect()

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
	}
	defer database.Close(db)

	repo := crud.NewRepositoryUserCrud(db)

	func(userRepository repository.UserRepository) {
		user, err := userRepository.FindByID(int(uid))

		if err != nil {
			responses.ERROR(w, http.StatusUnprocessableEntity, err)
			return
		}

		responses.JSON(w, http.StatusOK, user)
	}(repo)
}

// FindUserByEmail will return the user with id specifies in the request
func FindUserByEmail(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	uid, err := strconv.ParseInt(vars["id"], 10, 64)

	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	db, err := database.Connect()

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
	}
	defer database.Close(db)

	repo := crud.NewRepositoryUserCrud(db)

	func(userRepository repository.UserRepository) {
		user, err := userRepository.FindByID(int(uid))

		if err != nil {
			responses.ERROR(w, http.StatusUnprocessableEntity, err)
			return
		}

		responses.JSON(w, http.StatusOK, user)
	}(repo)
}

// UpdateUserByID will replace the user data with ones that comes form client
func UpdateUserByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	uid, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	user := models.User{}
	err = json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	db, err := database.Connect()

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
	}
	defer database.Close(db)

	repo := crud.NewRepositoryUserCrud(db)

	func(userRepository repository.UserRepository) {
		_, err := userRepository.Update(int(uid), user)
		if err != nil {
			responses.ERROR(w, http.StatusBadRequest, err)
			return
		}

		usr, err := userRepository.FindByID(int(uid))

		responses.JSON(w, http.StatusOK, usr)

	}(repo)

}

// DeleteUserByID will delete a user by its ID
func DeleteUserByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	uid, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	db, err := database.Connect()

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
	}
	defer database.Close(db)

	repo := crud.NewRepositoryUserCrud(db)

	func(userRepository repository.UserRepository) {
		_, err := userRepository.Delete(int(uid))
		if err != nil {
			responses.ERROR(w, http.StatusBadRequest, err)
			return
		}
		w.Header().Set("Entity", fmt.Sprintf("%d", uid))
		responses.JSON(w, http.StatusNoContent, "")

	}(repo)

}

// VerifyUserAccount will VerifyUserAccount
func VerifyUserAccount(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	tokenString := vars["token"]

	db, err := database.Connect()

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	defer database.Close(db)

	repo := crud.NewRepositoryEmailVerification(db)

	func(emailVerificationRepo repository.EmailVerificationRepository) {
		record, err := emailVerificationRepo.FindByToken(tokenString)
		if err != nil {
			responses.ERROR(w, http.StatusBadRequest, errors.New("Token not found, please generate new one."))
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
						err = userRepo.VerifyAccount(db, record.Email)
						if err != nil {
							responses.ERROR(w, http.StatusUnprocessableEntity, err)
							return
						}

						// mark token as used
						err = emailVerificationRepo.MarkTokenAsUsed(int(record.ID))
						if err != nil {
							responses.ERROR(w, http.StatusUnprocessableEntity, err)
							return
						}

						// success,
						responses.JSON(w, http.StatusOK, 1)
					} else {
						responses.ERROR(w, http.StatusBadRequest, errors.New("Token used or expired."))
						return
					}

				} else {
					responses.ERROR(w, http.StatusBadRequest, errors.New("Token invalid."))
					return
				}

			} else {
				responses.ERROR(w, http.StatusBadRequest, errors.New("Token invalid."))
				return
			}

		}

	}(repo)

}

func ResendVerificationEmail(w http.ResponseWriter, r *http.Request) {
	user := models.User{}
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, errors.New("Unable process your information, please check the information again."))
		return
	}

	token, err := auth.SendVerificationEmail(user)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	db, err := database.Connect()

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
	}
	defer database.Close(db)

	emailVerificationRepo := crud.NewRepositoryEmailVerification(db)

	err = emailVerificationRepo.Save(models.EmailVerification{
		Email: user.Email,
		Token: token,
	})

	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	responses.JSON(w, http.StatusCreated, err)

}

func UpdateUserRewardPoints(w http.ResponseWriter, r *http.Request) {
	user := models.User{}
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, errors.New("Unable process your information, please check the information again."))
		return
	}

	db, err := database.Connect()
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	defer database.Close(db)

	userRepo := crud.NewRepositoryUserCrud(db)
	err = userRepo.UpdateRewardPoints(user)

	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	responses.JSON(w, http.StatusOK, err)
}
