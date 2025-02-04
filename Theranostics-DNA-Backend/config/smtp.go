// config/smtp.go
package config

import (
	"log"

	"gopkg.in/gomail.v2"
)

// SendEmail sends an email to the given recipients with the given subject and body.
// The email is sent via SMTP using the server, username, and password configured in the AppConfig.
func SendEmail(recipients []string, subject, body string) error {
	log.Printf("Sending email to: %v", recipients)
	m := gomail.NewMessage()
	// Set the "From" field with the desired format: "Theransotics.com"
	// The email address is the same as the SmtpEmail address.
	fromEmail := AppConfig.SmtpFromEmail
	fromName := "Theransotics.com"
	m.SetHeader("From", fromName+" <"+fromEmail+">")
	m.SetHeader("To", recipients...)
	m.SetHeader("Subject", subject)
	// Set the body to be HTML content.
	m.SetBody("text/html", body)

	// Create a new dialer with the SMTP server details.
	d := gomail.NewDialer(AppConfig.SmtpServer, 587, AppConfig.SmtpEmail, AppConfig.SmtpPassword)

	// Dial the SMTP server and send the email.
	if err := d.DialAndSend(m); err != nil {
		// Log the error if the email can't be sent.
		log.Printf("Failed to send email: %v", err)
		return err
	}

	// Log a success message if the email is sent successfully.
	log.Println("Email sent successfully")
	return nil
}
