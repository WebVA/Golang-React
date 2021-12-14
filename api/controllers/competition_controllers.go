package controllers

import (
	"comp-performance/api/database"
	"comp-performance/api/models"
	"comp-performance/api/repository"
	"comp-performance/api/repository/crud"
	"comp-performance/api/responses"
	"log"

	// compErrors "comp-performance/api/utils/errors"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/gorilla/mux"
)

// GetAllCompetitions will return the first 100 users
func GetAllCompetitions(w http.ResponseWriter, r *http.Request) {
	db, err := database.Connect()
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}
	defer database.Close(db);

	repo := crud.NewRepositoryCompetitionCrud(db)

	func(competitionRepository repository.CompetitionRepository) {
		competitions, err := competitionRepository.FindAll()

		for i := range competitions {
			imagesString, _ := getImagesFilesFromUploadsFolder(competitions[i].ID)
			// fmt.Println("images: ", imagesString, competitions[i].ID)
			// if err != nil {
			// fmt.Println("asseting images: ", competitions[i].Images)
			competitions[i].Images = imagesString
			// fmt.Println("after asseting images: ", competitions[i].Images)

			// }
		}

		if err != nil {
			responses.ERROR(w, http.StatusInternalServerError, err)
		}

		responses.JSON(w, http.StatusOK, competitions)

	}(repo)
}

// CreateCompetition will save new competition to the db and redirect to its page
func CreateCompetition(w http.ResponseWriter, r *http.Request) {
	competition := models.Competition{}
	err := json.NewDecoder(r.Body).Decode(&competition)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	db, err := database.Connect()
	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
	}
	defer database.Close(db);

	repo := crud.NewRepositoryCompetitionCrud(db)
	ticketsRepo := crud.NewRepositoryTicketCrud(db)

	func(competitionRepository repository.CompetitionRepository) {
		competition, err := competitionRepository.Save(competition)
		if err != nil {
			fmt.Println(err)
			responses.ERROR(w, http.StatusUnprocessableEntity, err)
			return
		}

		func(ticketsRepository repository.TicketRepository) {
			err := ticketsRepository.CreateTicketTable(fmt.Sprintf("ticket_c_%d", competition.ID))

			if err != nil {
				responses.ERROR(w, http.StatusInternalServerError, err)
				return
			}

			err = ticketsRepository.InitializeTickets(fmt.Sprintf("ticket_c_%d", competition.ID), &competition)

			if err != nil {
				responses.ERROR(w, http.StatusInternalServerError, err)
				return
			}

			w.Header().Set("Location", fmt.Sprintf("%s%s/%d", r.Host, r.RequestURI, competition.ID))
			responses.JSON(w, http.StatusCreated, competition)

		}(ticketsRepo)
	}(repo)
}

// GetCompetitionByID will return the competition with id specifies in the request
func GetCompetitionByID(w http.ResponseWriter, r *http.Request) {
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
	defer database.Close(db);

	repo := crud.NewRepositoryCompetitionCrud(db)

	func(competitionRepository repository.CompetitionRepository) {
		competition, err := competitionRepository.FindByID(int(uid))

		imagesString, err := getImagesFilesFromUploadsFolder(competition.ID)

		if err != nil {
			competition.Images = imagesString

		}

		if err != nil {
			responses.ERROR(w, http.StatusUnprocessableEntity, err)
			return
		}

		responses.JSON(w, http.StatusOK, competition)
	}(repo)
}

// UpdateCompetitionByID will replace the competition data with ones that comes form client
func UpdateCompetitionByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	uid, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		responses.ERROR(w, http.StatusBadRequest, err)
		return
	}

	competition := models.Competition{}
	err = json.NewDecoder(r.Body).Decode(&competition)
	if err != nil {
		responses.ERROR(w, http.StatusUnprocessableEntity, err)
		return
	}

	db, err := database.Connect()

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
	}
	defer database.Close(db);

	repo := crud.NewRepositoryCompetitionCrud(db)

	func(competitionRepository repository.CompetitionRepository) {
		rows, err := competitionRepository.Update(int(uid), competition)
		if err != nil {
			responses.ERROR(w, http.StatusBadRequest, err)
			return
		}

		responses.JSON(w, http.StatusOK, rows)

	}(repo)

}

// DeleteCompetitionByID will delete a competition by its ID
func DeleteCompetitionByID(w http.ResponseWriter, r *http.Request) {
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
	defer database.Close(db);

	repo := crud.NewRepositoryCompetitionCrud(db)

	func(competitionRepository repository.CompetitionRepository) {
		_, err := competitionRepository.Delete(int(uid))
		if err != nil {
			responses.ERROR(w, http.StatusBadRequest, err)
			return
		}
		w.Header().Set("Entity", fmt.Sprintf("%d", uid))
		responses.JSON(w, http.StatusNoContent, "")

	}(repo)

}

func getImagesFilesFromUploadsFolder(cid uint) (string, error) {
	// done := make(chan bool)
	var files []string
	var filesString string
	var err error

	// go func(ch chan<- bool) {
	// 	defer close(done)
	root := fmt.Sprintf("uploads/images/competitions/%s", fmt.Sprint(cid))

	err = filepath.Walk(root, func(path string, info os.FileInfo, err error) error {

		if info != nil {
			if info.IsDir() {
				return nil
			}
			files = append(files, info.Name())
			return nil
		}

		return nil
	})

	if err != nil {
		log.Print(err)
		// ch <- false

	} else {
		for _, file := range files {
			// fmt.Println("file >>>>>>> ", file)
			filesString += file + ";"
		}
		// ch <- true
	}

	// }(done)

	// fmt.Println("files >>>>>>>>", files)

	// fmt.Println("filesString >>>>>>>>", filesString)

	if err != nil {
		return filesString, err
	}

	return filesString, nil
}
