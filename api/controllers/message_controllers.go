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
	"strconv"

	"github.com/gorilla/mux"
)

// GetAllMessages will return the first 100 GetAllMessages
func GetAllMessagesByUserId(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	db, err := database.Connect()
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	defer database.Close(db)

	userRepo := crud.NewRepositoryUserCrud(db)
	repo := crud.NewRepositoryMessageCrud(db)

	func(messageRepo repository.MessageRepository, userRepo repository.UserRepository) {
		userID, err := strconv.ParseInt(vars["id"], 10, 64)
		user, err := userRepo.FindByID(int(userID))

		userMessages, err := messageRepo.FindAfterDate(user.CreatedAt)

		if err != nil {
			responses.ERROR(w, http.StatusInternalServerError, err)
		}

		responses.JSON(w, http.StatusOK, userMessages)

	}(repo, userRepo)
}

// CreateMessage will save new msg to the db and redirect to its page
func CreateMessage(w http.ResponseWriter, r *http.Request) {
	msg := models.Message{}
	err := json.NewDecoder(r.Body).Decode(&msg)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	db, err := database.Connect()
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
	}
	defer database.Close(db)

	repo := crud.NewRepositoryMessageCrud(db)

	func(messageRepo repository.MessageRepository) {
		msg, err := messageRepo.Save(msg)
		if err != nil {
			responses.ERROR(w, http.StatusUnprocessableEntity, err)
			return
		}

		w.Header().Set("Location", fmt.Sprintf("%s%s/%d", r.Host, r.RequestURI, msg.ID))
		responses.JSON(w, http.StatusCreated, err)
	}(repo)
}

// GetMessageByID will return the msg with id specifies in the request
func GetMessageByID(w http.ResponseWriter, r *http.Request) {
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

	repo := crud.NewRepositoryMessageCrud(db)

	func(messageRepo repository.MessageRepository) {
		msg, err := messageRepo.FindByID(int(uid))

		if err != nil {
			responses.ERROR(w, http.StatusUnprocessableEntity, err)
			return
		}

		responses.JSON(w, http.StatusOK, msg)
	}(repo)
}

// UpdateMessageByID will replace the msg data with ones that comes form client
func UpdateMessageByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	uid, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	msg := models.Message{}
	err = json.NewDecoder(r.Body).Decode(&msg)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	db, err := database.Connect()

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
	}
	defer database.Close(db)

	repo := crud.NewRepositoryMessageCrud(db)

	func(messageRepo repository.MessageRepository) {
		rows, err := messageRepo.Update(int(uid), msg)
		if err != nil {
			responses.ERROR(w, http.StatusBadRequest, err)
			return
		}

		responses.JSON(w, http.StatusOK, rows)

	}(repo)

}

// DeleteMessageByID will delete a msg by its ID
func DeleteMessageByID(w http.ResponseWriter, r *http.Request) {
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

	repo := crud.NewRepositoryMessageCrud(db)

	func(messageRepo repository.MessageRepository) {
		_, err := messageRepo.Delete(int(uid))
		if err != nil {
			responses.ERROR(w, http.StatusBadRequest, err)
			return
		}
		w.Header().Set("Entity", fmt.Sprintf("%d", uid))
		responses.JSON(w, http.StatusNoContent, "")

	}(repo)

}
