export const defaultCountry = {
  code: 44,
  name: "UK",
  continent_name: "Europe",
};
export const defaultAddress = {
  country: defaultCountry,
  city: "",
  address_line: "",
  zip_code: "",
};

export const defaultNotificationSettings = {
  new_competitions: true,
  discounts: false,
  ending_soon_competitions: false,
  winner: false,
  competition_entry_details: true,
};

export const emptyCompetition = {
  title: "",
  price: 0.0,
  reduced_price: 0.0,
  end_time: "",
  number_of_tickets: 0,
  max_tickets_per_person: 0,
  Trending: false,
  // images: "",
  // featured_image: "",
  description: "",
  category_id: 0,
  headline: "",
  features: "",
};

export const emptyCategory = {
  ID: 0,
  name: "",
};

export const emptyQuiz = {
  question: "",
  option1: "",
  option2: "",
  option3: "",
  option4: "",
  correct_answer: null,
};
