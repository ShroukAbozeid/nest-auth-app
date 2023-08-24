## Description

A simple app that implments Authentication and Authorization features with simple front end using handlebars

## Setup

```bash
$ npm install
```

1. create .env.development file
2. copy from env.sample and fill in with approiate values
3. set up app on google cloud to use for login with google

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Libraries used

- _passport_ for authentication
- _bcrypt_ for hasing passwords
- _cookie-parser_ is used with Jwt to handle cookies
- _typeorm_ and _pg_ for db
- _nodemailer_ for sending confirmation emails
- _express-session_ for session management
- _connect-flash_ for flash messages
- _cross-env_ for handling different enviroments
- _class-validator_ and _class-transformer_ for validations
- _nest config_ for handling secrets and env variables

## Notes

The _main_ branch implements authentication using JWT strategy

there is another branch named _using-express-session_ that implements authentication using sessions and has error handling
