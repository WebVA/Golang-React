export const API_KEY = "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"  // this key should have the permission  to  lists.
// it's important to change the key at the server as well, at: ./api/controllers/sendgrid_controllers.go
export const API_BASE_URL = "https://api.sendgrid.com/v3";

export const endpoints = {
  marketingContacts: "/marketing/contacts",
  searchContacts: "marketing/contacts/search",
  marketingLists: "marketing/lists"
};

export const listsIDs = {
  NewCompList: "4ba7e6c3-d2a4-41b1-806e-5d008b982df5",
  EndingSoonList: "62edf4b4-211e-44d3-a2e5-b49082484931",
  SpecialDiscountList: "87cf46cf-1eda-4454-a5b2-7a65580e3687",
  WinnerEmailList: "bba15ae2-eac4-45e0-8f6d-aa78e8259ae4",
  NewsletterList: "7ba4a4a3-e259-4a06-97f4-0802966c73a4"
};
