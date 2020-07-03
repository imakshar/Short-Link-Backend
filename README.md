# Short Link

  URL shortening service and link management platform, where you can create
  and manage your custom short links Easy access to long urls with custom
  short links 
  
## Shortlink Backend using Node-Express-GraphQL-ApolloServer with MONGO DB  

-   with JWT authorization
-   web socket connection for graphql subscriptions.
-   with graphql directive auth

### Tree Structure

    src
     ┣ models
     ┃ ┣ ShortLink.js
     ┃ ┣ User.js
     ┃ ┗ index.js
     ┣ resolvers
     ┃ ┣ index.js
     ┃ ┣ shortLink.js
     ┃ ┣ subscription.js
     ┃ ┗ user.js
     ┣ schema
     ┃ ┗ schema.gql
     ┣ index.js
     ┣ jwt.js
     ┗ utils.js

`start.js` root entry point for backend server!

## create .env file

APP_PORT=port

NODE_ENV=development or production

MONGO_DB=connection url

APP_SECRET=serious key for jwt auth

### run npm i to install dependencies

### after installing dependencies, run npm start

`🚀 Server ready at http://localhost:<port>/<graphqlServerPath>`

`🚀 Subscriptions ready at ws://localhost:<port>/<graphqlServerPath>`
