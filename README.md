# weather
This is a weather app built with postgres, node, react, and styled with tailwind.css. The weather data is pulled from the https://openweathermap.org/ api.

## Running instrucitons

### Start the server
> Open a new terminal window/tab in the `server` directory.
> Run npm install first if their are new packages to install.
`npm i`
> Start up your server.
`npm run dev`

### Start the client
> Open a new terminal window/tab in the `client` directory.
> Run npm install first if their are new packages to install.
`npm i`
> Start up your server to serve the client.
`npm run dev`
 
## Installation Instructions

### Start your .env file
> Open a new terminal window/tab in the `server` directory.
`touch .env`
`cp example.env .env`
Get an api key from [https://openweathermap.org/](https://openweathermap.org/), and add it to your .env file.

### Generate ssl certs
> [generate ssl certs](https://medium.com/@nitinpatel_20236/how-to-create-an-https-server-on-localhost-using-express-366435d61f28)
`openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365`
`openssl rsa -in keytmp.pem -out key.pem`

### Initialize your database
> Install postgres. I installed PostgreSQL 14.1 for Unbuntu.
> Pick values for your database stuff in the .env and then use those here while creating it.

`sudo service postgresql start`
`sudo -u postgres createuser <DB_USER>`
`sudo -u postgres createdb <DB_NAME>`
`sudo -u postgres psql`
>>psql=# `alter user <DB_USER> with encrypted password '<DB_PASSWORD>';`
>>psql=# `grant all privileges on database <DB_NAME> to <DB_USER> ;`
>>psql=# `\q`

Use a combo of [this](https://harshityadav95.medium.com/postgresql-in-windows-subsystem-for-linux-wsl-6dc751ac1ff3) and [this](https://gist.github.com/michaeltreat/40a2f444d8ff6c89af958733448da093) to troubleshoot setting up a postgres database if needed.

> Now you can get into your db with `psql -U <DB_USER> -d <DB_NAME>`, but you don't need to do that right now.

> Run the following script to initialize the database.

`psql <DB_USER> -h 127.0.0.1 -d <DB_NAME> -f ./sql/init.sql -a`

### Start the server
> Run npm install to install all the node packages.
`npm i`
> Start up your server.
`npm run dev`

### Start the client
> Open a new terminal window/tab in the `client` directory.
> Run npm install to install all the packages.
`npm i`
> Start up your server to serve the client.
`npm run dev`