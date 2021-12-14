package controllers

import (
	"comp-performance/api/responses"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
)

var SendGridMarketingListsKey = "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"

func SearchContactsByEmail(w http.ResponseWriter, r *http.Request) {

	type emailType struct {
		Email string `json:"email"`
	}

	email := emailType{}

	err := json.NewDecoder(r.Body).Decode(&email)

	fmt.Println(err)

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}

	url := "https://api.sendgrid.com/v3/marketing/contacts/search"

	s := fmt.Sprintf("{\"query\":\"email LIKE '%s%%' \"}", email.Email)

	// fmt.Println("s >>>>>>>>>>>>>>>>>>>>", s)

	payload := strings.NewReader(s)

	req, _ := http.NewRequest("POST", url, payload)

	req.Header.Add("authorization", fmt.Sprintf("Bearer %s", SendGridMarketingListsKey))
	req.Header.Add("content-type", "application/json")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, err := ioutil.ReadAll(res.Body)

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}

	// fmt.Println(res)
	// fmt.Println(string(body))

	responses.JSON(w, http.StatusOK, string(body))

}

func RemoveContactFromList(w http.ResponseWriter, r *http.Request) {

	type requestType struct {
		ContactID string `json:"contact_id"`
		ListID    string `json:"list_id"`
	}

	c := requestType{}

	err := json.NewDecoder(r.Body).Decode(&c)

	fmt.Println(err)

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}

	url := fmt.Sprintf("https://api.sendgrid.com/v3/marketing/lists/%s/contacts?contact_ids=%s", c.ListID, c.ContactID)

	// fmt.Println("s >>>>>>>>>>>>>>>>>>>>", s)

	payload := strings.NewReader("")

	req, _ := http.NewRequest("DELETE", url, payload)

	req.Header.Add("authorization", fmt.Sprintf("Bearer %s", SendGridMarketingListsKey))
	req.Header.Add("content-type", "application/json")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, err := ioutil.ReadAll(res.Body)

	if err != nil {
		responses.ERROR(w, http.StatusInternalServerError, err)
		return
	}

	// fmt.Println(res)
	// fmt.Println(string(body))

	responses.JSON(w, http.StatusOK, string(body))

}
