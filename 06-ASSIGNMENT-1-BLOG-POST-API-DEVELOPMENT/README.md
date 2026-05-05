# Assignment-1: Blog Post API development with GET & POST endpoints.

Assignment-1 of Pocket School Profession Back-End software development program. Where the task was to create / develop a blog post API with only POST & GET methods / endpoints.

## Run Locally

Clone the project

```bash
  git clone https://github.com/shahjalalhazari/PS-Assignment-1-Blog-Post-API-Development
```

Go to the project directory

```bash
  cd PS-Assignment-1-Blog-Post-API-Development
```

Install dependencies

```bash
  npm install
  npm i express joi
```

Start the server

```bash
  npm start
```

##### localhost post is 3000


## API Reference

### POST New Blog

```http
  POST /blogs
```
| Data | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `title` | `string` | **Required**. Minimun **3** characters |
| `content` | `string` | **Required**. Minimun **10** characters |
| `author` | `string` | **Required** |

##### Make sure to fullfil all the requirments data mentioned above.

#### Screenshots
- POST REQ

![fad Screenshot](https://i.ibb.co/gZwBwds3/SUCCESSFULL-POST-REQ-RESULT.png)


### GET a single Blog

```http
  GET /blog/${id}
```

### GET all Blog

```http
  GET /blogs
```

#### Screenshots
- GET REQ FOR SINGLE BLOG & ALL BLOGS

![fad Screenshot](https://i.ibb.co/Lhk51kjg/SUCCESSFULL-POST-REQ-RESULT.png)


## Thank You