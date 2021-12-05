
# Maon-backend

This backend challenge is a clone that mimics stackoverflow.

The clone covers only 4 basic endpoints to enable users ask questions. It focuses on only the question , comment , search , and single question retrieval service.

## Table of Contents

1. Description
1. Table of Contents
1. Technology Stack
1. Project Dependencies
1. Installation
1. Configuration
1. Getting Started
1. API Documentation
1. Testing

## Technlogy Stack

Maon Backend Challenge is built using Nodejs , Express , MongoDB , Redis , and the ELK Stack

-   NodeJS

    > A JavaScript runtime environment

-   ExpressJs

    > An un-opinionated Nodejs web application framework suitable for buiding APIs and webservers

-   MongoDB

    > A Document based NoSQL

-   Redis

    > An in-memory database primarily used for server side caching. It provides useful data structures

-   Elasticsearch
    > For near real-time full-text search

## Project Dependencies

The dependencies of this project are listed in _[package.json]_. and they include :

-   **Express** : NodeJS web application framework that powers Eventals API.
-   **Mongodb** : Client for interacting with MongoDB
-   **axios** for asynchronous HTTP communication between services
-   **bcryptjs** for encrypting password at rest
-   **compression** for compressing request headers
-   **dotenv** for loading environment(found inside .env file) variables at runtime
-   **cors** for managing cross origin request
-   **mongoose**
-   **mocha**
-   **chai**
-   **chai-http**

### Installation

Clone this repository , and install the project dependencies using :

>

    `$ git clone https://github.com/adeisbright/maon-backend-challenge
    $ cd maon-backend-challenge
    $ npm install`

## Configuration

Configure the project before you launch it by doing the following :

-   Create a .env file in the root of the application
    The content of the file should contain the following :

>

    LocalDB = "mongodb://127.0.0.1:27017"

    dbName = "maon"

    Server_Port = 4000

Ensure you install Redis , and ElasticSearch on your device

### Getting Started

-   Run this command to launch the development server : npm run devstart
-   Add a Question
-   Search for a question
-   Retrieve a question
-   Add comments to a question

### API Documentation

The API is documented using OpenAPI specification.

Check the file [openapi.json](http://github.com/adeisbright/maon-backend/openapi.json)

### Testing

The testing is split into two:

1. Unit Test : located in /test/unit

This can be run from the command line using

> `npm run unittest`

1. Integration test
    > `npm run integrationtest`

To check for code coverage for any of the test above, Istabul was used.

Run Istabul CLI :

> `nyc npm run unittest`

> `nyc npm run integrationtest`

For Static Code Analysis , Eslint and Google Eslint Configuration was used.

Lint the code by running this command:

> `npm run lint-fix`
