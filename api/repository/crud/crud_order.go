package crud

import (
	"comp-performance/api/models"
	"comp-performance/api/utils/channels"
	"comp-performance/api/utils/types"
	"errors"
	"fmt"

	"strings"

	"gorm.io/gorm"
)

// RepositoryOrderCrud organises all user curd with the db
type RepositoryOrderCrud struct {
	db *gorm.DB
}

// NewRepositoryOrderCrud constructor
func NewRepositoryOrderCrud(db *gorm.DB) *RepositoryOrderCrud {
	return &RepositoryOrderCrud{db}
}

// Save new order
func (r *RepositoryOrderCrud) Save(order models.Order) (models.Order, error) {
	var err error
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(done)
		err = r.db.Debug().Model(models.Order{}).Create(&order).Error

		if err != nil {
			fmt.Println(err)
			ch <- false
			return
		}

		repoTickets := NewRepositoryTicketCrud(r.db)
		for _, item := range order.OrderItems {
			//  fmt.Println(i, item)
			t := models.Ticket{}
			// fmt.Println("order item >>>>>>>>>>>>>>>>>>>>>>  ////////////////// ", item.TicketID)
			t.Sold = true
			t.BuyerID = int(order.UserID)
			t.TicketNumber = int(item.TicketID)
			t.CompetitionID = item.CompetitionID
			t.ID = uint(item.TicketID)

			err = repoTickets.MarkTicketSold(item.CompetitionID, t)

			if err != nil {
				fmt.Println(err)
				ch <- false
				return
			}

		}
		if err != nil {
			ch <- false
			return
		}
		ch <- true
	}(done)

	if channels.OK(done) {
		return order, nil
	}

	return models.Order{}, err
}

// FindAll users
func (r *RepositoryOrderCrud) FindAll() ([]models.Order, error) {
	var err error
	order := []models.Order{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.Order{}).Find(&order).Error
		if err != nil {
			ch <- false
			return
		}

		ch <- true
	}(done)

	if order == nil {
		return nil, errors.New("No order Found")
	}

	if channels.OK(done) {
		fmt.Println(order)
		return order, nil
	}
	return nil, err
}

// FindByID will Find user by ID
func (r *RepositoryOrderCrud) FindByID(uid uint) (models.Order, error) {
	var err error
	order := models.Order{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.Order{}).Find(&order, "id = ?", uint(uid)).Error

		if err != nil {
			ch <- false
			return
		}

		if uint(order.ID) != uid {
			err = errors.New("record not found")
			ch <- false
			return

		}

		ch <- true
	}(done)

	if channels.OK(done) {
		if err != nil {
			return order, err
		}
		return order, nil
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return models.Order{}, errors.New("No order with these data found")
	}

	if uint(order.ID) != uid {
		err = errors.New("No order found")
		return order, err

	}
	return models.Order{}, err

}

// Update Order data
func (r *RepositoryOrderCrud) Update(uid int, user models.Order) (int, error) {
	return 0, nil
}

// Delete a specific user by ID
func (r *RepositoryOrderCrud) Delete(uid int) (int, error) {
	var rs *gorm.DB
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		rs = r.db.Debug().Model(&models.Order{}).Where("id = ?", uid).Take(&models.Order{}).Delete(&models.Order{})
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

// FindByID will Find user by ID
func (r *RepositoryOrderCrud) FindFullOrderByID(uid uint) (types.FullOrder, error) {
	var err error
	order := models.Order{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.Order{}).Find(&order, "id = ?", uint(uid)).Error
		if err != nil {
			ch <- false
			return
		}

		if uint(order.ID) != uid {
			err = errors.New("record not found")
			ch <- false
			return

		}

		ch <- true
	}(done)

	if channels.OK(done) {
		if err != nil {
			return types.FullOrder{}, err
		}

		rr := NewRepositoryOrderItemCrud(r.db)

		items, err := rr.GetAllItemsOfOrder(order.ID)

		if err != nil {
			return types.FullOrder{}, err
		}

		return types.FullOrder{
			Order: order,
			Items: items,
		}, nil
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return types.FullOrder{}, errors.New("No order with these data found")
	}

	if uint(order.ID) != uid {
		err = errors.New("No order found")
		return types.FullOrder{}, err

	}
	return types.FullOrder{}, err

}

// FindAll users
func (r *RepositoryOrderCrud) FindAllFullOrders() ([]types.FullOrder, error) {
	var err error
	orders := []models.Order{}
	response := []types.FullOrder{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.Order{}).Find(&orders).Error
		if err != nil {
			ch <- false
			return
		}

		ch <- true
	}(done)

	if orders == nil {
		return nil, errors.New("No order Found")
	}

	if channels.OK(done) {
		for _, order := range orders {
			rr := NewRepositoryOrderItemCrud(r.db)

			items, err := rr.GetAllItemsOfOrder(order.ID)

			if err != nil {
				return []types.FullOrder{}, err
			}

			fo := types.FullOrder{
				Order: order,
				Items: items,
			}

			response = append(response, fo)
		}
		return response, nil
	}
	return nil, err
}

func (r *RepositoryOrderCrud) FindByBuyerID(id uint) ([]models.Order, error) {
	var err error
	orders := []models.Order{}
	done := make(chan bool)

	go func(ch chan<- bool) {
		defer close(ch)
		err := r.db.Debug().Model(&models.Order{}).Find(&orders, "buyer_id = ?", uint(id)).Error

		if err != nil {
			ch <- false
			return
		}

		for i := range orders {
			err = r.db.Preload("User", "id = ?", orders[i].UserID).Find(&orders[i]).Error
			if err != nil {
				ch <- false
				return
			}

			err = r.db.Preload("OrderStatus", "id = ?", orders[i].OrderStatusID).Find(&orders[i]).Error
			if err != nil {
				ch <- false
				return
			}

			rr := NewRepositoryOrderItemCrud(r.db)

			items, err := rr.GetAllItemsOfOrder(orders[i].ID)

			if err != nil {
				ch <- false
				return
			}

			orders[i].OrderItems = items

		}
		ch <- true
	}(done)

	if channels.OK(done) {
		if err != nil {
			return orders, err
		}
		return orders, nil
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return []models.Order{}, errors.New("No order with these data found")
	}

	return []models.Order{}, err

}

type ticketArrayType struct {
	Id       int
	Title    string
	Quantity int
	Price    float64
	Answer   string
	Tickets  []int
}

var styles = map[string]string{
	"table":      "min-width:50vw; width:80%;  border: 1px solid #e9e9f2; border-collapse: collapse; text-align: left; margin-bottom: 1rem; color: #737491; border-spacing: 2px; font-family: 'Inter',sans-serif;",
	"th":         "color: #4a4b65; border: 1px solid #e9e9f2; border-bottom-width: 2px; vertical-align: bottom; padding: .75rem; font-weight: 600;",
	"tr-odd":     "background-color: #f7f7fc",
	"td":         "border: 1px solid #e9e9f2; padding: .75rem; vertical-align: top;",
	"productsTd": "text-size: .875rem;",
}

func GenerateOrderEmail(order models.Order, or models.Order, usr models.User) string {
	var msg string

	msg += "<p> Hi " + usr.FirstName + "</p>"
	msg += "<p>Thank you for your order, here is your receipt.</p>"

	msg += fmt.Sprintf("<p> Payment Ref: %d </p>", int(or.ID))

	msg += ` <table style="` + styles["table"] + `">
				<thead>
                    <tr>
                      <th style='` + styles["th"] + `'>Product ID</th>
                      <th style='` + styles["th"] + `'>Product</th>
                      <th style='` + styles["th"] + `'>Quantity</th>
                      <th style='` + styles["th"] + `'>Price</th>
                    </tr>
				</thead>
                <tbody>`

	ids := []ticketArrayType{}

	for _, item := range order.OrderItems {
		if contains(ids, int(item.CompetitionID)) {
			for i := range ids {
				if uint(ids[i].Id) == item.CompetitionID {
					ids[i].Tickets = append(ids[i].Tickets, item.TicketID)
					ids[i].Quantity++
				}
			}
		} else {
			t := ticketArrayType{}

			t.Id = int(item.CompetitionID)
			t.Title = item.CompetitionTitle
			t.Quantity = 1
			t.Price = item.Price
			// choice := fmt.Sprintf("option%d", item.GivenAnswer)
			// t.Answer = item.Quiz[choice]
			// t.Answer = fmt.Sprintf("option  %d", item.GivenAnswer)
			t.Answer = item.GivenAnswerString
			t.Tickets = append(t.Tickets, item.TicketID)
			ids = append(ids, t)
		}
	}

	for i, obj := range ids {
		TrStyle := ""
		if i%2 == 0 {
			TrStyle = styles["tr-odd"]
		}
		msg += `<tr style='` + TrStyle + `'>
        	<td style='` + styles["td"] + `'>` + fmt.Sprintf("%d", obj.Id) + `</td>
        	<td style='` + styles["td"] + styles["productsTd"] + `'>
            	<p style="margin-top: 0">` + obj.Title + `</p>
            	<p style="margin-top: 0">answer:  ` + obj.Answer + `</p>
            	<p style="margin-top: 0">tickets: ` + arrayToString(obj.Tickets, ", ") + `</p>
        	</td>
        	<td style='` + styles["td"] + `'>` + fmt.Sprintf("%d", obj.Quantity) + `</td>
        	<td style='` + styles["td"] + `'>£` + fmt.Sprintf("%.2f", obj.Price) + `</td>
        </tr>`
	}

	TrStyle := ""
	if len(ids)%2 == 0 {
		TrStyle = styles["tr-odd"]
	}
	msg += `<tr style='` + TrStyle + `'>
				<td colspan="2" style='` + styles["td"] + `'>No. Of Competitions: ` + fmt.Sprintf("%d", or.NumberOfCompetitions) + ` </td>
				<td colspan="2" style='` + styles["td"] + `'>Total: £` + fmt.Sprintf("%.2f", or.Total) + `</td>
			</tr>`

	msg += `</tbody></table>`

	msg += `<br> 
			<p> Good luck! Please keep a lookout for our live draws, via our social media channels. </p>
			<p> Give us a share!<p> 
			<p>Thanks</p>
			<p>Comp Performance Limited </p>`

	return msg

}

func contains(s []ticketArrayType, e int) bool {
	for _, a := range s {
		if a.Id == e {
			return true
		}
	}
	return false
}

func arrayToString(a []int, delim string) string {
	return strings.Trim(strings.Replace(fmt.Sprint(a), " ", delim, -1), "[]")
	//return strings.Trim(strings.Join(strings.Split(fmt.Sprint(a), " "), delim), "[]")
	//return strings.Trim(strings.Join(strings.Fields(fmt.Sprint(a)), delim), "[]")
}
