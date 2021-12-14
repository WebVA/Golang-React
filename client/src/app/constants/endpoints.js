/**
 * put all endpoints at one place
 */

const REACT_APP_DEV_SERVER_URL = "http://localhost:9000/api";
const REACT_APP_PRODUCTION_SERVER_URL = "/api";
const endpoints = {
  // server
  server: extractServerUrl(),
  //  server: "http://localhost:9000/api",
  // user
  login: "/login",
  signup: "/users",
  updateUser: "/users/id/",
  updateAddress: "/address/",
  updateNotificationSettings: "/notification-settings/",
  verifyEmail: "/verify-email/",
  requestNewPassword: "/request-new-password",
  setNewPassword: "/set-new-password",
  getUserByID: "/users/id",
  resendEmailVerification: "/resend-email-verification",

  // token
  checkUserToken: "/check-user-token",
  checkAdminToken: "/check-admin-token",

  // competitions
  allCompetitions: "/competitions",
  defaultCompetitionImage: "/img/default.png", // default image to be presented when no image for the competition
  uploadCompetitionImage: "/upload/competition-image",
  updateCompetition: "/competitions/id",

  // category
  allCategories: "/categories",
  uploadCategoryImage: "/upload/category-image",
  updateCategory: "/categories/id",

  // Orders
  allOrdersByUser: "/orders/buyer",

  // tickets
  allTickets: "/tickets/cid/",
  getSingleTicketInformation: (cid, tid) => `/tickets/cid/${cid}/tid/${tid}`,
  lockTicketUrl: (competitionID) => `/tickets/lock-ticket/cid/${competitionID}`,
  // stripe
  stripeCreateSession: "/stripe/create-session",
  getStripeSessionData: "/stripe/get-session-data",
  // paytriot
  paytriotCreateLink: "/paytriot/create-link",

  // messages
  allMessages: "/messages",

  // newsletter
  subscribeToNewsLetter: "/news-letter/subscribe",

  // App options
  getAppOptions: "/get-app-options",
  addAppOptions: "/add-app-options",
  updateAppOptions: "/update-app-options",

  // sendGrid Routes on our server
  searchSendGridContacts: "/sendgrid/contacts/search",
  removeSendGridContactFromList: "/sendgrid/contacts/remove-from-list",

  //quiz
  updateQuiz: "/quizzes/id",


  // reward
  updateRewardPoints: "/update-reward-points",
  createCoupon: "/coupon/create-coupon",
  getCouponData: "/coupon/get-coupon-data",
  allPrizes: '/prizes',
  updatePrize: (id) => `/prizes/id/${id}`,

};

export default endpoints;

function extractServerUrl() {
  if (process.env.NODE_ENV === "development") {
    return REACT_APP_DEV_SERVER_URL;
  }
  return REACT_APP_PRODUCTION_SERVER_URL;
}

/***
 * take a competition, grab its images file names string,
 * 2- separate on ;
 * 3- add the img url to each photo.
 */
export const prepareCompetitionImagesUrlsArray = (comp) => {
  const cid = comp.ID;
  if (!comp.images || comp.images === " ") {
    // if no images, check featured image.
    if (comp.featured_image && comp.featured_image !== " ") {
      const arr = [
        `${endpoints.server}/image/cid/${cid}/f/${comp.featured_image}`,
      ];
      return arr;
    } else {
      // if no featured image, assign the default image
      const arr = [endpoints.defaultCompetitionImage];
      return arr;
    }
  }

  const filenamesArray = comp.images.trim().split(";");

  const imagesUrlArray = [];
  filenamesArray.forEach((file) => {
    if (file && file !== " ") {
      const sanitizedFile = file.replace(/#/i, "%23");
      imagesUrlArray.push(
        `${endpoints.server}/image/cid/${cid}/f/${sanitizedFile}`
      );
    }
  });

  return imagesUrlArray;
};

/***
 * take a competition, grab its featured image,
 */
export const prepareCompetitionFeaturedImage = (comp) => {
  const cid = comp.ID;
  const filename = comp.featured_image;
  const imageUrl = `${endpoints.server}/image/cid/${cid}/f/${filename}`;
  return imageUrl;
};
