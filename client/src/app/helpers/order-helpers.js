export function calculateOrderSubTotal(order, competitionID) {
  let subTotal = 0;
  order?.order_items?.forEach((item) => {
    if (Number(item.competition_id) === Number(competitionID)) {
      subTotal += Number(parseFloat(item.price).toFixed(2));
    }
  });

  return subTotal.toFixed(2);
}

export function calculateOrderSubQuantity(order, competitionID) {
  let subTotal = 0;
  order?.order_items?.forEach((item) => {
    if (Number(item.competition_id) === Number(competitionID)) {
      subTotal += 1;
    }
  });

  return subTotal;
}

export function calculateOrderTicketsNumbers(order, competitionID) {
  let ticks = [];
  order?.order_items?.forEach((item) => {
    if (Number(item.competition_id) === Number(competitionID)) {
      ticks.push(item?.ticket_id);
    }
  });

  return ticks;
}

export function calculateOrderNumberOfCompetitions(order) {
  let comps = [];
  order?.order_items?.forEach((item) => {
    if (!comps.includes(item?.competition_id)) {
      comps.push(item?.competition_id);
    }
  });

  return comps.length;
}

export function calculateOrderTotal(order) {
  let total = 0;
  order?.order_items?.forEach((item) => {
    total += item.price;
  });

  return total.toFixed(2);
}

export function prepareOrderItemsForShow(order) {
  const ItemsToShow = [];
  const IDs = [];
  order?.order_items?.forEach((item) => {
    if (!IDs.includes(item.competition_id)) {
      IDs.push(item.competition_id);
      ItemsToShow.push(item);
    }
  });
  return ItemsToShow;
}

const emptyOrder = () => {
  return {
    buyer_id: null,
    order_status_id: null,
    total: 0,
    number_of_tickets: 0,
    number_of_competitions: 0,
    order_items: [],
    payment_session_id: null,
  };
};

/**
 * prepare cart information to be saved to the DB.
 */
export function prepareOrderToBeSavedToServer(cart, user, stripeSession) {
  const stripeSessionId = stripeSession.id;
  const stripeTotalPrice = (stripeSession.amount_total / 100).toFixed(2); //the amount the user actual paid
  const stripeBeforeCouponPrice = (stripeSession.amount_subtotal / 100).toFixed(2); // the amount before applying coupons
  /****
   * if no coupon is used then the stripeTotalPrice == stripeBeforeCouponPrice == cart.total
   * 
   * if a coupon is used then, stripeTotalPrice should be smaller than the  other 2 variables.
   * 
   * we can rely on stripe total price to be always the order total.
   * 
   */
  const order = emptyOrder();
  order.buyer_id = user.ID;
  order.order_status_id = 1;
  order.total = Number(stripeTotalPrice);
  order.number_of_competitions = cart.count;
  order.payment_session_id = stripeSessionId;
  for (let sku in cart.items) {
    const item = cart.items[sku];
    order.number_of_tickets += item.tickets.length;
    item.tickets.forEach((t) => {
      const orderItem = {
        competition_id: null,
        coupon_used: false,
        ticket_id: null,
        quiz_id: null,
        given_answer: null,
        is_answer_right: false,
        quantity: 1,
        price: null,
        competition_title: null,
        given_answer_string: null,
        // coupon_id: null,
      };

      orderItem.competition_id = Number(sku);
      orderItem.ticket_id = t;
      orderItem.price = Number(item.price);
      orderItem.quiz_id = item.quiz.ID;
      orderItem.given_answer = item.given_answer;
      orderItem.is_answer_right = item.is_answer_right;
      orderItem.competition_title = item.competition.title;
      orderItem.given_answer_string = item.quiz[`option${item?.given_answer}`];

      order.order_items.push(orderItem);
    });
  }

  return order;
}
