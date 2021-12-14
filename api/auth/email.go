package auth

import (
	"fmt"
	"log"

	// "net/smtp"
	// "os"
	"comp-performance/config"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)



// SendEmail function, pass plainTextContent as empty string if you don't want to use it
func SendEmail(from_email, from_name, to_email, to_name, subject, plainTextContent, htmlContent string) error {

	// fmt.Println("sending email, key: ", config.SENDGRID_API_KEY)
	from := mail.NewEmail(from_name, from_email)
	to := mail.NewEmail(to_name, to_email)
	// txt := mail.NewContent("text/plain", plainTextContent)
	// ht := mail.NewContent("text/html", htmlContent)
	message := mail.NewSingleEmail(from, subject, to, plainTextContent, htmlContent)
	client := sendgrid.NewSendClient(config.SENDGRID_API_KEY)
	response, err := client.Send(message)
	if err != nil {
		log.Println(err)
		return err
	}
	fmt.Println(response.StatusCode)
	// fmt.Println(response.Body)
	// fmt.Println(response.Headers)
	return nil
}

func SendEmailWithBcc(to_name, to_email, bcc_email, bcc_name, subject, from_name, from_email, htmlContent string) error {
	// create new *SGMailV3
	m := mail.NewV3Mail()

	from := mail.NewEmail(from_name, from_email)
	content := mail.NewContent("text/html", htmlContent)

	m.SetFrom(from)
	m.AddContent(content)

	// create new *Personalization
	personalization := mail.NewPersonalization()

	// populate `personalization` with data
	to := mail.NewEmail(to_name, to_email)
	// cc1 := mail.NewEmail("Example CC", "test2@example.com")
	bcc1 := mail.NewEmail(bcc_name, bcc_email)

	personalization.AddTos(to)
	personalization.AddBCCs(bcc1)
	// personalization.SetSubstitution("%fname%", "recipient")
	// personalization.SetSubstitution("%CustomerID%", "CUSTOMER ID GOES HERE")
	personalization.Subject = subject

	// add `personalization` to `m`
	m.AddPersonalizations(personalization)

	request := sendgrid.GetRequest(config.SENDGRID_API_KEY, "/v3/mail/send", "https://api.sendgrid.com")
	request.Method = "POST"
	request.Body = mail.GetRequestBody(m)
	response, err := sendgrid.API(request)

	if err != nil {
		log.Println(err)
		return err
	} else {
		fmt.Println(response.StatusCode)
	}

	return nil
}