# plan

## questions

1. mobile-first approach?
2. any front-end updates? 
3. access to the front-end code?


## previous server (laravel)

1. I can see mostly a list of template code.
2. it has a lot of unnecessary stuff.
3. I'm not sure if it's really working

## previous database (live)

1. some unnecessary items as well.

# Website Tasks

## General

### A user login & register system.

1. from the front end form, for register, you need: name, email, password.
2. login, with password and email.
3. I see 4 types of 2.0 auth factors, facebook, google, instagram, twitter. are they working now?

![](https://i.imgur.com/m5HLSd5.png)

###	A dynamically loading shop front (running competitions)

1. shop page that loads the products.

### Allow the website admin to upload, edit and delete competitions (products)

1. admin area
2. CRUD on products.
3. are admin allowed to change users data from adminArea?
4. are sending messages will be done here ??


## Account:

### Orders page, show previous orders.

- when a user purchase a product, order should be saved.
- order contains, product, ticket No, coupon(if any), 


### Messages, show admin sent messages.

- I haven't fully understood the messages part.


###	Profile info, allow the user to edit their profile information or delete their account.

- crud on user profile

### Payment methods, allow to add, delete or update methods. Including setting a default if multiple. (Stripe)

- user can use saved methods on stripe if they have stript account.
- no card data should be saved on your side.
- for saving payment methods, you can:
  1. add customer to your stripe bushiness account.
  2. save the payment methods when they pay to that customer.
  3. stripe handle all of this for you.


### Notifications, master switch notifications disable plus each slider for different types of notification. (Email settings basically)

- are these related to messages? 

## Running Competitions (Shopfront):

###	Show a list of products available.

- GET /products if they are not expired or sold out.
  
###	Show price, name and photo of each.

- GET /products/:productId , pulls all info about a product.


###	Show which are on sale or if added recently.

- add BOOLEAN featured property to a product.

## Competition Item

###	Show the product, photos description.

-  GET /products/:productId , pulls all info about a product.

###	A unique question with 4 answers required before allow adding to basket.

- GET /questions/:questionId , pulls all info about a question.

###	The competition unique information shown, draw date, max per person, max for competition, ID, number sold and further description of competition.

-  GET /products/:productId , pulls all info about a product.

## Checkout

###	User to enter billing info.

- Required By stripe, 
- shall we save those data ? to the users account.

###	Allow coupon codes.

- using coupon codes will change the price of the products.
- product should have 2 prices, one with coupon, one without, we can pull the second price if coupon used.
  
###	Integrate with stripe.

- you need a bushiness account with stripe.
- once payment done, competition should be updated.