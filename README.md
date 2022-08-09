# GitHub Repositories downloader TG bot
Bot that can download github repositories directly from Telegram!

- [Navigation](#navigation)
    - [Features](#features)
    - [Commands](#commands)
    - [Screenshots](#screenshots)
    - [Installation](#prerequisites)
    - [Docker](#docker)

## Features:
* Downloading any public repository from github (by default master branch, if there is none, bot downloads default branch)
* Smart storage system - after the initial download, bot stores repositories on its server, and does not download it again
* Updating the repository on request once every N days (configured in settings, default: 7 days)
* Logging actions and errors to console and to file (src/debug.log)

## Commands:
* /start - a greeting
* /help - all commands
* /getRepo - download github repository
* /getAllRepos - get a list of all repositories, that are stored on database

## Screenshots:
![image](https://user-images.githubusercontent.com/92920845/183630632-e0add9b7-27df-4f68-9428-d63ec6a463fd.png)
<img src="https://user-images.githubusercontent.com/92920845/183629425-5234ebc9-acb4-454b-b0d9-5b827f25a3d0.png" width="33%"/>
<img src="https://user-images.githubusercontent.com/92920845/183628662-fd6c2506-c5e0-47ec-a527-82acb83edd17.png" width="33%" /> <img 
src="https://user-images.githubusercontent.com/92920845/183628794-03d4e1ee-ff77-406e-be24-50797f3122c1.png" width="33%" />

## Getting Started
### Prerequisites
* NodeJS, NPM (https://www.npmjs.com/get-npm)
* PostgreSQL (https://www.postgresql.org)

### Installing
```bash
# Get the latest snapshot
git clone https://github.com/Bioneisme/gitrepo-download-tg-bot.git
```
``` bash
# Change directory
cd gitrepo-download-tg-bot
```
``` bash
# Install dependencies
npm install
```
Create an .env file locally. You can duplicate .env.example and name the new copy .env. Adapt the variables to your needs.
``` bash
# After setting up .env start app
npm run start
```

### Docker
Alternatively it is also possible to setup project through docker. To setup the container you have to checkout the repository and run the following commands:
``` bash
docker-compose build
```
``` bash
docker-compose up
```
! Before setup by docker, make sure that you have configured .env files correctly
