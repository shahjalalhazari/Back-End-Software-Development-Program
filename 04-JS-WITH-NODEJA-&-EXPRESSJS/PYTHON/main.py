from fastapi import FastAPI
app = FastAPI()

@app.get("/")
def read_root():
    return {
        "message": "Hellloooo, from FastAPI python project.",
        "name" : "Shahjalal Hazari",
        "age": 25,
        }