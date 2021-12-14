import { createSlice } from "@reduxjs/toolkit";
import {
  calculateSubTotal,
  calculateCartTotal,
  isProductInItems,
  getProductFromItems,
  isTicketsExceedsMaxPerPerson,
} from "../helpers/cart-helpers";

const initialCompCart = localStorage.getItem("comp-cart")
  ? JSON.parse(localStorage.getItem("comp-cart"))
  : { items: {}, count: 0, total: 0 };

const saveCartToLocalStorage = (cart) => {
  localStorage.setItem("comp-cart", JSON.stringify(cart));
};

const automateCartAction = (state) => {
  state.total = calculateCartTotal(state.items);
  state.count = Object.keys(state.items).length;
  saveCartToLocalStorage(state);
};

export const compCartSlice = createSlice({
  name: "compCart",
  initialState: initialCompCart,
  reducers: {
    add: (state, action) => {
      const id = action.payload.id;
      state.items[id] = action.payload;
      automateCartAction(state);
    },
    update: (state, action) => {
      const newItem = action.payload;
      const id = newItem.id;
      state.items[id] = newItem;
      automateCartAction(state);
    },
    increase: (state, action) => { },
    decrease: (state, action) => {
      const id = action.payload.id;
      const item = state.items[id];
      item.quantity--;
      
    },
    remove: (state, action) => {
      delete state.items[action.payload];
      automateCartAction(state);
    },
    clear: (state, action) => {
      state.items = {};
      automateCartAction(state);
    },
    updateCount: (state, action) => { },
    updateTotal: (state, action) => { },
    saveToLocalStorage: (state, action) => {
      localStorage.setItem("comp-cart", state);
    },
    updateItemTickets: (state, action) => {
      const id = action.payload.id;
      state.items[id].tickets = action.payload.tickets;
      automateCartAction(state);
    },
  },
});

export const addItemToCompCart = (item) => (dispatch, getState) => {
  /** 1- if item already in cart, updateItem
   *  2- if item exceeds the limit, don't add, return a message.
   *
   */
  const items = getState().compCart.items;
  const allTickets = getState().ticket.tickets;
  const user = getState().user.profile;
  const previousTicketsByThisUser = allTickets.filter((t) => {
    if (!user?.ID) return false;
    return Number(t.buyer_id) === Number(user.ID);
  });
  const quantity = item.tickets.length;

  // if product is already in cart, update it
  if (isProductInItems(items, item.id)) {
    const prevItem = getProductFromItems(items, item.id);
    const newQuantity = prevItem.quantity + quantity;
    const newSubtotal = calculateSubTotal(item.price, newQuantity);
    const newTickets = [...prevItem.tickets, ...item.tickets];
    if (
      isTicketsExceedsMaxPerPerson(
        [...previousTicketsByThisUser, ...newTickets],
        item.competition
      )
    ) {
      return `you are exceeding the max number of tickets per person which is: ${item.competition.max_tickets_per_person
        } , you can buy only: ${item.competition.max_tickets_per_person -
        (previousTicketsByThisUser.length + prevItem.quantity)
        } `;
    }
    item.quantity = newQuantity;
    item.subTotal = newSubtotal;
    item.tickets = newTickets;
    dispatch(update(item));
  } else {
    // add new product
    const newSubtotal = calculateSubTotal(item.price, quantity);
    if (
      isTicketsExceedsMaxPerPerson(
        [...previousTicketsByThisUser, ...item.tickets],
        item.competition
      )
    ) {
      return `you are exceeding the max number of tickets per person which is: ${item.competition.max_tickets_per_person
        } , you can buy only: ${item.competition.max_tickets_per_person -
        previousTicketsByThisUser.length
        } `;
    }
    item.quantity = quantity;
    item.subTotal = newSubtotal;
    dispatch(add(item));
  }

  // if product in cart;

  dispatch(add(item));
};

export const removeTicketsFromCompCart = (item, removeQuantity) => (dispatch, getState) => {
  /** 1- if item already in cart, updateItem
   *  2- if item exceeds the limit, don't add, return a message.
   *
   */
  const items = getState().compCart.items;
  const allTickets = getState().ticket.tickets;
  const user = getState().user.profile;
  const previousTicketsByThisUser = allTickets.filter((t) => {
    if (!user?.ID) return false;
    return Number(t.buyer_id) === Number(user.ID);
  });

  // if product is already in cart, update it
  if (isProductInItems(items, item.id)) {
    const prevItem = getProductFromItems(items, item.id);
    const newQuantity = prevItem.quantity - removeQuantity;
    const newSubtotal = calculateSubTotal(item.price, newQuantity);
    const newTickets = prevItem.tickets.slice(removeQuantity);
    const newItem = {...item};
    if (
      isTicketsExceedsMaxPerPerson(
        [...previousTicketsByThisUser, ...newTickets],
        item.competition
      )
    ) {
      return `you are exceeding the max number of tickets per person which is: ${
        item.competition.max_tickets_per_person}, you can buy only: ${
        item.competition.max_tickets_per_person - (previousTicketsByThisUser.length + prevItem.quantity)}`;
    }
    newItem.quantity = newQuantity;
    newItem.subTotal = newSubtotal;
    newItem.tickets = newTickets;
    dispatch(update(newItem));
  } else {
    return `Product not exist`;
  }
};

export const updateCompetitionTickets = (compID, ticks) => (dispatch) => {
  const payload = {
    id: compID,
    tickets: ticks,
  };
  dispatch(updateItemTickets(payload));
};

export const removeItemFromCompCart = (id) => (dispatch) => {
  dispatch(remove(String(id)));
};
export const {
  add,
  update,
  increase,
  decrease,
  remove,
  clear,
  updateCount,
  updateTotal,
  saveToLocalStorage,
  updateItemTickets,
} = compCartSlice.actions;

export const clearCompCart = () => (dispatch) => {
  dispatch(clear());
};

export const _compCartItems = (state) => state.compCart.items;
export const _compCartCount = (state) => state.compCart.count;
export const _compCartTotal = (state) => state.compCart.total;
export const _compCart = (state) => state.compCart;

export default compCartSlice.reducer;
