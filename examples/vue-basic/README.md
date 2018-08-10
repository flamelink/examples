# vue-basic

> Project bootstrapped with [@vue/cli](https://cli.vuejs.org/)

## Setup

### Firebase Project Config

Ensure that you have an existing Firebase project that you can use. Copy the `.env` file and save as `.env.local`. Ensure to replace all the environment variables with your Firebase project config details, eg:

Change:

```sh
VUE_APP_FLAMELINK_API_KEY="<firebase-api-key>"
```

with:

```sh
VUE_APP_FLAMELINK_API_KEY=AIzaSyDuTZiS23eqbkLA557_rlO9F0NBRZWViRx
```

#### Database Rules

To quickly make the content and navigation items available from our app without a user being authenticated, I've updated the default Flamelink Database rules to the following:

```json
{
  "rules": {
    "flamelink": {
      ".read": "auth != null",
      ".write": "auth != null",
      "environments": {
        "$env": {
          ".read": true
        }
      },
      "users": {
        ".indexOn": ["email"]
      }
    }
  }
}
```

It simply makes everything inside the `flamelink/environments` reference readable to anyone.

> When you roll out your own app to production, make sure to set the strictest rules possible for your use case.

### Install dependencies

```bash
yarn install
```

### Compiles and hot-reloads for development

```bash
yarn run serve
```

### Compiles and minifies for production

```bash
yarn run build
```

### Lints and fixes files

```bash
yarn run lint
```
