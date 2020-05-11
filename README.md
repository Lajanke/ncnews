# Laura Kenny - NC News
---------------------------------------------------------
A reddit style news API that offers up articles, comments, topics and users. As well as performing GET requests it will also provide the ability to POST (articles, comments), PATCH (ammend votes on articles and comments) and DELETE (article, comment).

## Getting Started

The instructions below will allow you to get a copy of this project up and running on your local machine for development and testing purposes.

## Prerequisites

- Node.js (13.13.0) 
- PostgreSQL (12.2)

## Installing

1. Fork the project and clone to your local environment:

   `git clone your-forked-url`

cd into the project file. 

2. Install dependencies: Express, Knex and PostgreSQL:

   `npm i express knex pg`

3. Installing dev-dependencies: jest and Supertest should be installed using the following command:

   `npm i -D jest supertest`

4. Install jest-sorted. Inspired by chai sorted and jest-extended. This package extends jest.expect with 2 custom matchers, toBeSorted and toBeSortedBy. https://www.npmjs.com/package/jest-sorted

  `npm i jest-sorted` 

5. Create a `knexfile.js` and add in the following code. Ubuntu users need to add their username and password (not required for Mac OS users). Ensure all paths are correct for your file configuration. Remember to .gitignore this file when pushing work up to gitHub, especially when passwords are contained.

```js
```

   ```js
   const ENV = process.env.NODE_ENV || 'development';

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations'
  },
  seeds: {
    directory: './db/seeds'
  }
};

const customConfig = {
  development: {
    connection: {
      database: 'nc_news',
      username: ///////
      password: ///////
    }
  },
  test: {
    connection: {
      database: 'nc_news_test',
      username: ///////
      password: ///////
    }
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };
```

6. This project includes two databases, **test** and **development**. You are also provided with scripts in the package.json to assist in setting up files and seeding the database.

   - First setup your databases using the following command:

     `npm run setup-dbs`

   - Then seed the database you wish to work with:

     - development - `npm run seed`
     - test - `npm run seed-test`

## Running tests

To test the util functions:

`npm t utils.spec.js`

To run the app test file:

`npm t app.spec.js`

## Built with:

- **Node.js** - JavaScript runtime built on Chrome's V8 JavaScript engine
- **PostgreSQL** - powerful, open source object-relational database system
- **Express** - web application framework
- **Knex** - SQL query builder http://knexjs.org/
- **Jest** - delightful JavaScript Testing Framework with a focus on simplicity https://jestjs.io/
- **Jest-sorted** - extends jest.expect https://www.npmjs.com/package/jest-sorted
- **Supertest** - Super-agent driven library for testing node.js HTTP servers

## Hosted with Heroku:

https://lk-news.herokuapp.com/api

## Author

Laura Kenny

## Acknowledgements

Northcoders.