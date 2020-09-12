<h1 align="center">Welcome to nodepop 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.0.0-blue.svg?cacheSeconds=2592000" />
</p>

> API para la venta de artículos de segunda mano

## Install

```sh
npm install
```

## Usage

```sh
npm start
```

## Dev run

```sh
npm run dev
```

## Load initial data

You can create a first version of the advertisements in the database with:

```sh
node install_db.js
```

*The information will be loaded from the file **ads.json*** located in the root directory

**Warning**: This action will delete all the information in the "Advertise" collection. Please run this command only if you are ok with this.

## API Use

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