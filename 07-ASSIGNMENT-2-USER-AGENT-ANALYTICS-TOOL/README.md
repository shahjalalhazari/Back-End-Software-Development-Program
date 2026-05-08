# Assignment-2: User Agent Analytics Tool.

Assignment-2 of Pocket School Profession Back-End software development program.
An Express.js app that tracks and visualizes user-agent data from incoming HTTP requests. Each request is classified by their User-Agent header, counted, and stored persistently. Finally, view user-agent data in bar chart in browser.

## Run Locally

Clone the project

```bash
  git clone https://github.com/shahjalalhazari/PS-Assignment-2-User-Agent-Analytics-Tool
```

Go to the project directory

```bash
  cd PS-Assignment-2-User-Agent-Analytics-Tool
```

Install dependencies

```bash
  npm install
  npm i express express-rate-limit chart.js
```

Start the server

```bash
  npm start
```

##### localhost post is 3000


## API Reference

### GET 

```http
  GET /api/analytics
```
#### Screenshots
![fad Screenshot](https://i.ibb.co/SwgQFNM5/screenshot.png)


### GET mock user agent count

```http
  GET /api/analytics/user-agent
```
#### Screenshots
![fad Screenshot](https://i.ibb.co/Gf62xm50/Screenshot-2026-05-09-035007.png)


### GET real user agent count

```http
  GET /api/analytics/real-user-agent
```
#### Screenshots
![fad Screenshot](https://i.ibb.co/CKB6tBKt/Screenshot-2026-05-09-034947.png)


### GET some mock user data

```http
  GET /api/users
```
#### Screenshots
![fad Screenshot](https://i.ibb.co/Hf1yPkXw/Screenshot-2026-05-09-035236.png)


## Thank You