
/***
 * To buy a ticket, 
 * 1- ticket should available (not sold) at the real time.
 * 2- user should be able to buy tickets (he hasn't exceeded the maximum tickets per person)
 * 3- the ticket number hasn't been bought this session.
 */
import { isDatePassed } from "./utils";

export const findAllTicketsBoughtByUser = (tickets, user) => {
    const result = [];

    tickets.forEach((t) => {
        if (Number(t.buyer_id) === Number(user.ID)) {
            result.push(t);
        }
    })

    return result;
}

export const extractAvailableTicketsIdsArray = (tickets) => {
    const ids = [];

    tickets.forEach(t => {
        if (isTicketAvailable(t)) {
            ids.push(t.ID);
        }
    })

    return ids;
}

/***
 * checks if ticket available to buy
 */
export const isTicketAvailable = (t) => {
    let free = true;
    if (t.locked_till) free = isDatePassed(t.locked_till);
    if (!t.sold && free) {
        return true;
    }
    return false;
}