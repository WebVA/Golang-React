package types

import(
	"comp-performance/api/models"
)

type FullOrder struct {
	Order models.Order
	Items []models.OrderItem
}