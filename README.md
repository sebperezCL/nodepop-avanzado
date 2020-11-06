<h1 align="center">Welcome to nodepop 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.0.1-blue.svg?cacheSeconds=2592000" />
</p>

> API to sell/buy used products

## Install

```sh
npm install
```

You will need to install pm2 to run the app and the microservices (the ecosystem). You can install it with the following command:

```sh
npm install pm2 -g
```

## Usage

To start the ecosystem

```sh
npm start
```

To stop the ecosystem

```sh
npm run stop
```

## Dev run

```sh
npm run dev
```

## Load initial data

You can create a first version of the advertisements in the database with:

```sh
npm run init-db
```

*The information will be loaded from the file **ads.json*** located in the root directory

**Warning**: This action will delete all the information in the "Advertise" collection. Please run this command only if you are ok with this.

## View advertisements

You can retrieve all the ads in a "human readable" format calling the url:

http://localhost:3000/?name=&tag=&currency=&price=&sort=&limit=&start=

or simply http://localhost:3000/ and use the form to search the ads

## API Use

**First of all: You need to authenticate to access the API methods**

### Authentication

POST /api/authenticate

body:
{
  email: string,
  password: string
}

Response:

{
    "tokenJWT": "xxxxx.yyyyyyy.zzzzzzz"
}

### Important!

The following API methods **needs authentication**. The JWT token must be sent either in the header or in the body.

### List all advertisements

GET /api/ads

### Filtered list of advertisements

GET /api/ads?name=&price=&tag=&currency=&sell&limit=&skip=&sort=

* name parameter can be a substring of the full name
* price parameter should be one of this options: 
  * integer: exact match
  * -integer: search ads with price lower than the value received
  * integer-: search ads with price greater than the value received
  * integer1-integer2: search ads with price between integer1 and integer2
* Multiple tag values can be sent (tag=value1&tag=value2&...tag=value-n)
* currency valid values are USD, EUR or CLP
* Send sell=true to search products for sale and sell=false to search products to buy

{
    "count": 1,
    "advertisements": [
        {
            "tags": [
                "libro",
                "usado",
                "raro"
            ],
            "_id": "5f5adf44b9f5141010914b61",
            "name": "Frankenstein primera edición",
            "sell": false,
            "price": 1600,
            "currency": "USD",
            "picture": "libro.jpg"
        }
    ]
}

### Search one advertisement

GET /api/ads/_id

### Create new advertisement

POST /api/ads

body:
{
  name: string,
  sell: boolean,
  price: number,
  currency: string,
  tags: [string]
}

file: picture

### Delete one advertisement

DELETE /api/ads/_id

## Author

👤 **Sebastián Pérez**

* Github: [@sebperezCL](https://github.com/sebperezCL)

## Show your support

Give a ⭐️ if this project helped you!

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_