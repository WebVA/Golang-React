import * as sendgrid from "../constants/sendGrid";
import { fetchProtectedApi, fetchPostJSON } from "./api-helpers";
import endpoints from "../constants/endpoints";

/**
 *
 * @param {Array} listIDs
 * @param {Object} contactInfo
 */
export async function addContactToSendGridList(listIDs, contactInfo) {
  const dataToSend = {
    list_ids: [...listIDs],
    contacts: [{ ...contactInfo }],
  };

  const res = await fetchProtectedApi(
    sendgrid.API_BASE_URL + sendgrid.endpoints.marketingContacts,
    "PUT",
    sendgrid.API_KEY,
    dataToSend
  );

  return res;
}

export async function getMarketingListsSubscribedByUser(email, token) {
  const fetchOptions = {
    url: endpoints.server + endpoints.searchSendGridContacts,
    token: token,
    data: { email: email },
  };

  const res = await fetchPostJSON(fetchOptions);

  const answer = {
    id: null,
    list_ids: [],
  };

  if (res.error) return answer;

  const contact = JSON.parse(res.result);

  if (contact?.contact_count) {
    return { list_ids: contact?.result[0].list_ids, id: contact?.result[0].id };
  }

  return answer;
}

async function __removeContactFromSendGridList(listIDs, contactID) {
  const api = sendgrid.API_BASE_URL + sendgrid.endpoints.marketingLists;
  const promises = [];
  listIDs.forEach((lid) => {
    promises.push(
      fetchProtectedApi(
        `${api}/${lid}/contacts?contact_ids=${contactID}`,
        "DELETE",
        sendgrid.API_KEY
      )
    );
  });

  const r = await Promise.all(promises);
  return r;
}

export async function removeContactFromSendGridList(token, listIDs, contactID) {
  const promises = [];
  listIDs.forEach((lid) => {
    const fetchOptions = {
      url: endpoints.server + endpoints.removeSendGridContactFromList,
      token: token,
      data: {
        contact_id: contactID,
        list_id: lid,
      },
    };
    promises.push(fetchPostJSON(fetchOptions));
  });

  const r = await Promise.all(promises);
  return r;
}

export async function addContactToAllSendGridList(contactInfo) {
  const all = [];
  for (let lid in sendgrid.listsIDs) {
    all.push(sendgrid.listsIDs[lid]);
  }
  const dataToSend = {
    list_ids: all,
    contacts: [{ ...contactInfo }],
  };

  const res = await fetchProtectedApi(
    sendgrid.API_BASE_URL + sendgrid.endpoints.marketingContacts,
    "PUT",
    sendgrid.API_KEY,
    dataToSend
  );

  return res;
}
