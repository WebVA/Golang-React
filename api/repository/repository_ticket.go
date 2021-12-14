package repository

import (
	"comp-performance/api/models"
)

// TicketRepository Interface
type TicketRepository interface {
	Save(uint, models.Ticket) (models.Ticket, error)
	FindAll(uint) ([]models.Ticket, error)
	FindByID(uint, uint) (models.Ticket, error)
	Update(uint, uint, models.Ticket) (int, error)
	Delete(uint, uint) (int, error)
	CreateTicketTable(string) error
	InitializeTickets(string, *models.Competition) error
	MarkTicketSold(uint, models.Ticket) error
	MarkTicketLocked(uint, models.Ticket) error
}
