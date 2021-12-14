export function prepareProduct(comp, givenAnswer, isAnswerRight) {
  let p = {
    id: comp.ID,
    name: comp.title,
    // price_id: "price_GBJ2Ep8246qeeT",
    price: comp.reduced_price ? comp.reduced_price : comp.price,
    image: comp.featured_image,
    currency: "GBP",
    quantity: 1,
    subTotal: 0,
    tickets: [],
    competition: comp,
    quiz: comp?.quiz,
    given_answer: givenAnswer,
    is_answer_right: isAnswerRight,
  };

  return p;
}

export function calculateSubTotal(price, quantity) {
  return Number(parseFloat(price * quantity).toFixed(2));
}

export function calculateCartTotal(items) {
  let total = 0;
  if (Object.keys(items).length === 0) {
    return total;
  }

  for (let id in items) {
    const i = items[id];
    if (!i.subTotal) i.subTotal = 0;
    total += i.subTotal;
  }

  return Number(total.toFixed(2));
}

/**
 *
 * @param {Array} items
 * @param {String} id
 * checks if `items` object keys contains the key `id`
 */
export function isProductInItems(items, id) {
  const keys = Object.keys(items);
  if (keys.includes(String(id))) {
    return true;
  }
  return false;
}

export function getProductFromItems(items, id) {
  if (isProductInItems(items, id)) {
    return items[id];
  }
}

export function isTicketsExceedsMaxPerPerson(tickets, comp) {
  // user can't buy more of the maximum of this order
  if (tickets.length > comp.max_tickets_per_person) {
    return true;
  }
  return false;
}
