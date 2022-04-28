# Bookmarks

This API allow you to save bookmarks and uses expressjs and MySQL with TypeORM

# Installation

```
yarn install
```

Then create a `.env` file bases on `env.dist` file.

API is secured with an OAuth Basic token generated with `OAUTH_USER` and `OAUTH_PASSWORD` fields present in `.env` file

Create two MariaDB databases (one for test - eg. `bookmarks_test` - and one for API usage - eg. `bookmarks`)

Run migrations

```
yarn migration:run
```

Now you can launch API

```
yarn dev
```

API will be available on http://localhost:3000 (Assuming you have set port value to 3000 on `.env` file)

# Build

You can build app with `yarn build` command.
Build files will be generated on `dist` folder.
You will then be able to start built server with `yarn start`

# Lint

```
yarn lint
yarn lint:fix
```

# Insomnia

You can test API with insomnia using `insomnia.json` file in the root directory

# API Routes

## 1. GET /bookmarks/:page/:id

Retrive bookmarks paginated

## 2. POST /bookmark

Add bookmark with JSON payload like :

```
{
    "url": "https://flickr.com/photos/vinchey/3193201837"
}
```

Exemple of content returned by endpoint :

```
{
	"id": "93650a4b-6ee7-4b23-ab3c-a886ef528705",
	"type": "photo",
	"url": "https://flickr.com/photos/feuilllu/45771361701/",
	"title": "2018 Visite de Klaxoon",
	"authorName": "Pierre Metivier",
	"authorUrl": "https://www.flickr.com/photos/feuilllu/",
	"createdAt": "2022-04-28T12:34:15.619Z",
	"publishedAt": null,
	"thumbnail": "https://live.staticflickr.com/4817/45771361701_2678123510_q.jpg",
	"width": 1024,
	"height": 685,
	"duration": null
}
```

## 3. PUT /bookmark/:id

Edit bookmarked defined by its id.

Payload is identical to POST payload

## 4. GET /bookmark/:id

Get bookmark detail from bookmark id

```
{
	"id": "93650a4b-6ee7-4b23-ab3c-a886ef528705",
	"type": "photo",
	"url": "https://flickr.com/photos/feuilllu/45771361701/",
	"title": "2018 Visite de Klaxoon",
	"authorName": "Pierre Metivier",
	"authorUrl": "https://www.flickr.com/photos/feuilllu/",
	"createdAt": "2022-04-28T12:34:15.619Z",
	"publishedAt": null,
	"thumbnail": "https://live.staticflickr.com/4817/45771361701_2678123510_q.jpg",
	"width": 1024,
	"height": 685,
	"duration": null
}
```

## 5. DELETE /bookmark/:id

Soft remove bookmarked defined by its id.

# Tests suite

```
yarn test
```
