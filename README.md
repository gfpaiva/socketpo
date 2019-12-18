# ✊ 🤚 ✌️ SOCKETPO ✊ 🤚 ✌️ #

[![Build Status](https://travis-ci.org/gfpaiva/socketpo.svg?branch=master)](https://travis-ci.org/gfpaiva/socketpo) [![Coverage Status](https://coveralls.io/repos/github/gfpaiva/socketpo/badge.svg?branch=master)](https://coveralls.io/github/gfpaiva/socketpo?branch=master) [![StackShare](http://img.shields.io/badge/tech-stack-0690fa.svg?style=flat)](https://stackshare.io/gfpaiva/socketpo)
[SocketPO](https://socketpo.herokuapp.com) is a JokenPo (Rock, Paper, Scissors) game made with NodeJS, GraphQL and React for study and fun.

_Had a cool idea? Please open an [Issue](https://github.com/gfpaiva/socketpo/issues/new) and let's talk!_

## ⚙️ Requires

- Node 10.9.0+
- NPM 6.4.1

## 🏃🏽‍♂️ Running locally

First of all you will need to create a `.env` file on the root folder, with a required configs:
- **MONGODB_URI**={URI from a mongodb} (I am using [MLab](https://mlab.com/) for local development)
- **NODE_ENV**=`DEVELOPMENT`

**Installation**
- Run `npm install` on root folder
- Run `npm install` on `/client` folder

Npm scripts:

| command              | description                                                                                                                                  |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| npm run dev          | start local both **client** at `localhost:3000` and the **server** at `localhost:3001` (GraphQL Playground at http://localhost:3001/graphql) |
| npm run dev:server   | start local **server**  at `localhost:3001` (GraphQL Playground at http://localhost:3001/graphql)                                            |
| npm run dev:client   | start local **client** at `localhost:3000`                                                                                                   |

## ✔️ Checks

- [TravisCI](https://travis-ci.org) checks both server and client tests and build
- [Coveralls](https://coveralls.io) check the coverage of client tests

## 🔍 Testing

**Server-side** tests are made with [Jest](https://jestjs.io/) and [supertest](https://github.com/visionmedia/supertest) to request the GraphQL endpoint and run some queries/mutations. (local mongodb)

Npm scripts:

| command              | description                                |
| -------------------- | ------------------------------------------ |
| npm test             | run all server tests without a watch mode  |
| npm run test:client  | run all the client side tests and build    |


**Client-side** tests are made with [Jest](https://jestjs.io/) and [Enzyme](https://airbnb.io/enzyme/)

Npm scripts:

| command              | description                                        |
| -------------------- | -------------------------------------------------- |
| npm test              | run all client tests with a watch mode            |
| npm run test:coverage | run all client tests and extract coverage reports |

## 📦 Build

Server start on Heroku, and Client (React) build run after with a [heroku-postbuild](https://devcenter.heroku.com/articles/nodejs-support#customizing-the-build-process)

On `client/` folder:

| command              | description                                                   |
| -------------------- | ------------------------------------------------------------- |
| npm run build        | serve files into `/build` folder                              |

## 🚀 Deploy

Both Server-side and Client-side are hosted at [Heroku](https://www.heroku.com/).
Deploy and build process are run automatically after the CI checks on branch `master`.

## 👨‍💻 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## ⚖️ License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

___

This RADME doc is highly inspired by [this one](https://github.com/rodgerpaulo/rogerramos.me)

Thank You My King 💚
