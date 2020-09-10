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

### List all advertisments

GET /api/ads

## Author

👤 **Sebastián Pérez**

* Github: [@sebperezCL](https://github.com/sebperezCL)

## Show your support

Give a ⭐️ if this project helped you!

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_