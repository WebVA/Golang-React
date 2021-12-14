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
	"github.com/gorilla/mux"
	"net/http"
	"strconv"
)

// GetAllTickets will return the first 100 coupons
func GetAllTickets(w http.ResponseWriter, r *http.Request) {
	db, err := database.Connect()
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}

	vars := mux.Vars(r)
	competitionID, err := strconv.ParseInt(vars["competitionID"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}
	defer database.Close(db)

	repo := crud.NewRepositoryTicketCrud(db)

	func(ticketRepository repository.TicketRepository) {

		coupons, err := ticketRepository.FindAll(uint(competitionID))

		if err != nil {
			responses.ERROR(w, http.StatusInternalServerError, err)
		}

		responses.JSON(w, http.StatusOK, coupons)

	}(repo)
}

// CreateTicket will save new ticket to the db and redirect to its page
func CreateTicket(w http.ResponseWriter, r *http.Request) {
	ticket := models.Ticket{}
	err := json.NewDecoder(r.Body).Decode(&ticket)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	db, err := database.Connect()
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}

	vars := mux.Vars(r)
	competitionID, err := strconv.ParseInt(vars["competitionID"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
	}
	defer database.Close(db)

	repo := crud.NewRepositoryTicketCrud(db)

	func(ticketRepository repository.TicketRepository) {
		ticket, err := ticketRepository.Save(uint(competitionID), ticket)
		if err != nil {
			responses.ERROR(w, http.StatusUnprocessableEntity, err)
			return
		}

		w.Header().Set("Location", fmt.Sprintf("%s%s/%d", r.Host, r.RequestURI, ticket.ID))
		responses.JSON(w, http.StatusCreated, err)
	}(repo)
}

// GetTicketByID will return the ticket with id specifies in the request
func GetTicketByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	competitionID, err := strconv.ParseInt(vars["competitionID"], 10, 64)
	ticketID, err := strconv.ParseInt(vars["ticketID"], 10, 64)

	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	db, err := database.Connect()

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
	}
	defer database.Close(db)

	repo := crud.NewRepositoryTicketCrud(db)

	func(ticketRepository repository.TicketRepository) {
		ticket, err := ticketRepository.FindByID(uint(competitionID), uint(ticketID))

		if err != nil {
			responses.ERROR(w, http.StatusUnprocessableEntity, err)
			return
		}

		responses.JSON(w, http.StatusOK, ticket)
	}(repo)
}

// UpdateTicketByID will replace the ticket data with ones that comes form client
func UpdateTicketByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	competitionID, err := strconv.ParseInt(vars["competitionID"], 10, 64)
	ticketID, err := strconv.ParseInt(vars["ticketID"], 10, 64)

	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	ticket := models.Ticket{}
	err = json.NewDecoder(r.Body).Decode(&ticket)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	db, err := database.Connect()

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
	}
	defer database.Close(db)

	repo := crud.NewRepositoryTicketCrud(db)

	func(ticketRepository repository.TicketRepository) {
		rows, err := ticketRepository.Update(uint(competitionID), uint(ticketID), ticket)
		if err != nil {
			responses.ERROR(w, http.StatusBadRequest, err)
			return
		}

		responses.JSON(w, http.StatusOK, rows)

	}(repo)

}

// DeleteTicketByID will delete a ticket by its ID
func DeleteTicketByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	competitionID, err := strconv.ParseInt(vars["competitionID"], 10, 64)
	ticketID, err := strconv.ParseInt(vars["ticketID"], 10, 64)

	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	db, err := database.Connect()

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
	}
	defer database.Close(db)

	repo := crud.NewRepositoryTicketCrud(db)

	func(ticketRepository repository.TicketRepository) {
		_, err := ticketRepository.Delete(uint(competitionID), uint(ticketID))
		if err != nil {
			responses.ERROR(w, http.StatusBadRequest, err)
			return
		}
		w.Header().Set("Entity", fmt.Sprintf("%d-%d", competitionID, ticketID))
		responses.JSON(w, http.StatusNoContent, "")

	}(repo)

}

func LockTicket(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	competitionID, err := strconv.ParseInt(vars["competitionID"], 10, 64)

	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	ticket := models.Ticket{}
	err = json.NewDecoder(r.Body).Decode(&ticket)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	db, err := database.Connect()

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
	}
	defer database.Close(db)

	repo := crud.NewRepositoryTicketCrud(db)

	func(ticketRepository repository.TicketRepository) {
		err := ticketRepository.MarkTicketLocked(uint(competitionID), ticket)
		if err != nil {
			responses.ERROR(w, http.StatusBadRequest, err)
			return
		}

		responses.JSON(w, http.StatusOK, 1)

	}(repo)
}
