package crud

import (
	"comp-performance/api/models"
	"comp-performance/api/utils/channels"
	"errors"
	"time"

	"fmt"

	"gorm.io/gorm"
)

// RepositoryTicketCrud organises all user curd with the db
type RepositoryTicketCrud struct {
	db *gorm.DB
}

// NewRepositoryTicketCrud constructor
func NewRepositoryTicketCrud(db *gorm.DB) *RepositoryTicketCrud {
	return &RepositoryTicketCrud{db}
}

// Save new ticket
func (r *RepositoryTicketCrud) Save(competitionID uint, ticket models.Ticket) (models.Ticket, error) {
	var err error
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(done)
		err = r.db.Debug().Table(fmt.Sprintf("ticket_c_%d", competitionID)).Create(&ticket).Error
		if err != nil {
			ch <- false
			return
		}
		ch <- true
	}(done)

	if channels.OK(done) {
		return ticket, nil
	}

	return models.Ticket{}, err
}

// FindAll users
func (r *RepositoryTicketCrud) FindAll(competitionID uint) ([]models.Ticket, error) {
	var err error
	tickets := []models.Ticket{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Table(fmt.Sprintf("ticket_c_%d", competitionID)).Find(&tickets).Error
		if err != nil {
			ch <- false
			return
		}

		ch <- true
	}(done)

	if tickets == nil {
		return nil, errors.New("No tickets Found")
	}

	if channels.OK(done) {
		return tickets, nil
	}
	return nil, err
}

// FindByID will Find user by ID
func (r *RepositoryTicketCrud) FindByID(competitionID, ticketID uint) (models.Ticket, error) {
	var err error
	ticket := models.Ticket{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Table(fmt.Sprintf("ticket_c_%d", competitionID)).Find(&ticket, "id = ?", ticketID).Error

		if err != nil {
			ch <- false
			return
		}

		if ticket.ID != ticketID {
			err = errors.New("record not found")
			ch <- false
			return

		}

		ch <- true
	}(done)

	if channels.OK(done) {
		if err != nil {
			return ticket, err
		}
		return ticket, nil
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return models.Ticket{}, errors.New("No ticket with these data found")
	}

	if ticket.ID != ticketID {
		err = errors.New("No ticket found")
		return ticket, err

	}
	return models.Ticket{}, err

}

// Update Ticket data
func (r *RepositoryTicketCrud) Update(competitionID uint, ticketID uint, user models.Ticket) (int, error) {
	return 0, nil
}

// MarkTicketSold , should be sold on createing the order
func (r *RepositoryTicketCrud) MarkTicketSold(competitionID uint, ticket models.Ticket) error {
	var err error
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(done)
		err = r.db.Debug().Table(fmt.Sprintf("ticket_c_%d", competitionID)).Updates(&ticket).Error
		if err != nil {
			ch <- false
			return
		}
		ch <- true
	}(done)

	if channels.OK(done) {
		return nil
	}

	return err
}

// MarkTicketLocked , should be sold on createing the order
func (r *RepositoryTicketCrud) MarkTicketLocked(competitionID uint, ticket models.Ticket) error {
	var err error
	done := make(chan bool)

	ticket.LockedTill = time.Now().Add(10 * time.Minute)

	go func(ch chan<- bool) {
		defer close(done)
		err = r.db.Debug().Table(fmt.Sprintf("ticket_c_%d", competitionID)).Updates(&ticket).Error
		if err != nil {
			ch <- false
			return
		}
		ch <- true
	}(done)

	if channels.OK(done) {
		return nil
	}

	return err
}

// Delete a specific user by ID
func (r *RepositoryTicketCrud) Delete(competitionID, ticketID uint) (int, error) {
	var rs *gorm.DB
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		rs = r.db.Debug().Table(fmt.Sprintf("ticket_c_%d", competitionID)).Where("id = ?", ticketID).Take(&models.Ticket{}).Delete(&models.Ticket{})
		ch <- true
	}(done)

	if channels.OK(done) {
		if rs.Error != nil {
			return 0, rs.Error
		}

		return int(rs.RowsAffected), nil
	}

	return 0, rs.Error
}

// CreateTicketTable will create new tickets table
func (r *RepositoryTicketCrud) CreateTicketTable(tableName string) error {
	done := make(chan bool)
	var err error

	go func(ch chan<- bool) {
		defer close(ch)
		err = r.db.Exec(fmt.Sprintf("CREATE TABLE IF NOT EXISTS`%s` (`competition_id` bigint NOT NULL, `ticket_number` bigint NOT NULL, `sold` boolean DEFAULT false, `buyer_id` bigint NOT NULL,`locked_till` datetime(3) NULL ,`id` bigint unsigned AUTO_INCREMENT,`created_at` datetime(3) NULL,`updated_at` datetime(3) NULL,`deleted_at` datetime(3) NULL,PRIMARY KEY (`id`),INDEX idx_couponType_deleted_at (`deleted_at`))", tableName)).Error

		if err != nil {
			ch <- false
			return
		}

		ch <- true
	}(done)

	if channels.OK(done) {
		return nil
	} else {
		return err
	}
}

// InitializeTickets will initialize a specific number of tickets
func (r *RepositoryTicketCrud) InitializeTickets(tableName string, c *models.Competition) error {

	// var err error

	// for i := 0; i < c.NumberOfTickets; i++ {
	// 	fmt.Println("creating ticket", i)
	// 	done := make(chan bool)
	// 	go func(ch chan<- bool) {
	// 		var t = models.Ticket{
	// 			CompetitionID: c.ID,
	// 			TicketNumber:  i + 1,
	// 		}
	// 		err = r.db.Debug().Table(tableName).Create(&t).Error
	// 		if err != nil {
	// 			ch <- false
	// 			return
	// 		}
	// 		ch <- true
	// 	}(done)
	// }

	// return nil

	for i := 0; i < c.NumberOfTickets; i++ {
		var t = models.Ticket{
			CompetitionID: c.ID,
			TicketNumber:  i + 1,
		}
		err := r.db.Debug().Table(tableName).Create(&t).Error
		if err != nil {
			return err
		}

	}

	return nil
}
