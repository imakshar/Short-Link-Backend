# Short Link

  URL shortening service and link management platform, where you can create
  and manage your custom short links Easy access to long urls with custom
  short links 
  
## Shortlink Backend using Node-Express-GraphQL-ApolloServer with MONGO DB  

-   JWT authorization
-   web socket connection for graphql subscriptions.
-   graphQL directives for ACL.
-   nodemailer for sending email's
-   express 

### Tree Structure

    src
     ┣ models
     ┃ ┣ ShortLink.js
     ┃ ┣ TempResetToken.js
     ┃ ┣ User.js
     ┃ ┗ index.js
     ┣ resolvers
     ┃ ┣ index.js
     ┃ ┣ shortLink.js
     ┃ ┣ subscription.js
     ┃ ┣ tempResetToken.js
     ┃ ┗ user.js
     ┣ schema
     ┃ ┗ schema.gql
     ┣ index.js
     ┣ jwt.js
     ┗ utils.js
    .env
    start.js

`start.js` root entry point for backend server!

## create .env file

    APP_PORT=3000 || or any
    HOST=localhost || or any
    NODE_ENV=development || production
    APP_SECRET="somthing serious key"
    MONGO_DB="database url"
    EMAIL=your email account ( to send email's to client)
    PW=email account password

## Available Scripts

In the project directory, you can run:

### `npm i`

### `npm start`

### After installing dependencies, run npm start

`🚀 Server ready at http://localhost:<port>/<graphqlServerPath>`

`🚀 Subscriptions ready at ws://localhost:<port>/<graphqlServerPath>`
