# nuxt-basic

> Basic example showing how to use Flamelink with Nuxt, both server and client side.

___

## Assumption

This example assumes you have a Flamelink project with a `Products` collection with at least the following fields:

**Field Name**: Field Type
* **Name**: Text
* **Price**: Number
* **Image**: Media

___

## Setup

### Install Dependencies

``` bash
$ npm install # Or yarn install
```

### Set environment variables

* Copy the `.env.sample` file and name it `.env`
* Replace all the dummy placeholder values with your Firebase project details, eg. `<firebase-db-url>` becomes `https://flamelink-example-project.firebaseio.com`

The `firebase` SDK package does not support server-side usage for things like accessing the Storage bucket. For that reason, `flamelink` requires that you use the `firebase` SDK client/browser side and the `firebase-admin` SDK server-side. This example aims to hide some of that for you, and only requires that you specify the absolute path to your Firebase service account JSON file in the `.env` file.

You can read more about creating the service account JSON file and setting up the `firebase-admin` app instance in the [Firebase docs](https://firebase.google.com/docs/admin/setup)).

> Important! Node v10 is currently NOT supported

## Usage

``` bash
# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).
