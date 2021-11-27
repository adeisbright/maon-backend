# Maontech-backend-challenge

This backend challenge is a clone that mimics stackoverflow.

The clone covers only 4 basic endpoints to enable users ask questions. It focuses on only the question service.

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

-   ELK Stack
    > ELK is an acronym for ElasticSearch , LogStash , and Kibana. The services are offered by Elastic.
    > The stack makes it possible to build web search engines that provides near-real time search capability ,
    > monitoring , and security of data

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
-   **morgan** for application logging

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

    dbName = "tictactoe"

    Server_Port = 8000

Ensure you install Redis , and ElasticSearch on your device

### Getting Started

-   Run this command to launch the development server : npm run devstart
-   Add a Question
-   Search for a question
-   Remove a question
-   Add answers to a question
-   When testing set the Databse to the Test DB in App.js . Run : npm run test
