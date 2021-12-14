import { createSlice } from "@reduxjs/toolkit";
import endpoints from "../constants/endpoints";
import { fetchGetJSON, fetchPostJSON } from "../helpers/api-helpers";
import { getRandomInt } from "../helpers/utils";
import { findAllTicketsBoughtByUser, extractAvailableTicketsIdsArray, isTicketAvailable } from '../helpers/ticket-helpers';

export const ticketSlice = createSlice({
  name: "ticket",
  initialState: {
    tickets: [],
    sold: 0,
    available: 0,
  },
  reducers: {
    setTickets: (state, action) => {
      state.tickets = action.payload;
    },
    setSold: (state, action) => {
      state.sold = action.payload;
    },
    setAvailable: (state, action) => {
      state.available = action.payload;
    },
  },
});

export const getAllTicketsFromServer = (compID) => async (dispatch) => {
  const response = await fetchGetJSON(
    endpoints.server + endpoints.allTickets + compID
  );
  if (response.error) {
    console.error(response.error);
    return;
  }

  const tickets = response.result;
  dispatch(setTickets(tickets));

  let sold = 0;
  let total = tickets?.length || 0;
  tickets?.forEach((t) => {
    if (t.sold) sold = sold + 1;
  });

  let available = total - sold;

  dispatch(setSold(sold));
  dispatch(setAvailable(available));

  return response;
};


const getTicketInfoNow = async (compID, ticketId) => {
  const r = await fetchGetJSON(endpoints.server + endpoints.getSingleTicketInformation(compID, ticketId));
  return r.result;
}

const lockTicket = async (compID, ticketId) => {
  const fetchOptions = {
    url: endpoints.server + endpoints.lockTicketUrl(compID),
    data: { ID: ticketId }
  }
  await fetchPostJSON(fetchOptions);
}

export const getTicketsToBuy = (quantity, competition) => async (dispatch, getState) => {
  const returnObj = {
    error: null,
    result: [],
  }
  /** updating tickets at the purchase real time */
  await dispatch(getAllTicketsFromServer(competition.ID));

  let tickets = getState().ticket.tickets;
  const availableTickets = getState().ticket.available;
  const user = getState().user.profile;

  if (quantity > availableTickets) {
    returnObj.error = `Tickets are sold, you can buy up to ${availableTickets} tickets`;
    return returnObj;
  }


  /** if user loggedIn (at the checkout, check if they have exceeded their limits),
   *  else (on the competition page, just continue ) 
   *  */
  if (user?.ID) {
    const ticketsPreviouslyBoughtByUser = findAllTicketsBoughtByUser(tickets, user);
    if ((ticketsPreviouslyBoughtByUser.length + quantity) > competition.max_tickets_per_person) {
      returnObj.error = `Tickets are sold, you have bought from this competition before, you can buy up to ${competition.max_tickets_per_person - ticketsPreviouslyBoughtByUser.length} tickets`;
      return returnObj;
    }
  }

  let availableTicketsIDS = extractAvailableTicketsIdsArray(tickets);

  const getIdNumber = () => {
    let rand = getRandomInt(availableTicketsIDS.length);
    let id = availableTicketsIDS[rand];
    return id;

  }

  const chooseTicketId = async () => {
    let tid = getIdNumber();
    let done = false;
    /********
   * a - we need to get ticket information now, if it's free go:
   *      1- lock ticket;
   * b- if ticket is not free:
   *      1- getAllTicketsFromServer again;
   *      2- update the availableTickets
   *      3- choose another number.
   */
    while (!done) {
      const ticketInRealTime = await getTicketInfoNow(competition.ID, tid);
      const available = isTicketAvailable(ticketInRealTime);
      if (available) {
        await lockTicket(competition.ID, tid);
        done = true;
      } else {
        await dispatch(getAllTicketsFromServer(competition.ID));
        tickets = getState().ticket.tickets;
        availableTicketsIDS = extractAvailableTicketsIdsArray(tickets);
        if (!availableTicketsIDS.length) {
          return null;
        }
        tid = getIdNumber();
      }
    }
    return tid;

  }

  for (let i = 1; i <= quantity; i++) {
    let ticketId = await chooseTicketId();

    /****
     * if no more tickets to buy
     */
    if (!ticketId) {
      returnObj.error = `Tickets are sold, you can buy up to ${availableTicketsIDS.length} tickets`;
      return returnObj;
    }
    while (returnObj.result.includes(ticketId)) {
      ticketId = await chooseTicketId();
    }
    returnObj.result.push(ticketId);
  }

  if (returnObj.result.length !== quantity || returnObj.result.length === 0) {
    returnObj.error = `something went wrong, please try again`;
    return returnObj;
  }

  return returnObj;

}

export const { setTickets, setAvailable, setSold } = ticketSlice.actions;

export const _tickets = (state) => state.ticket.tickets;

/** get the number of available and sold tickets */
export const _ticketsCountState = (state) => {
  let res = {
    soldTickets: state.ticket.sold,
    availableTickets: state.ticket.available,
  };
  return res;
};

export default ticketSlice.reducer;
