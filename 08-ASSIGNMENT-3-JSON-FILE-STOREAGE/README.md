# Assignment-3: JSON File Storage.
Assignment-3 from Pocket School for Profession Back-End software development program.

### TASK:
Build a simple product API usign JSON file storage.
### objective:
Build two REST API endpoints using Node.js and Express - that return product data saved in .json file.


## API Reference
### GET ALL PRODUCTS

```http
  GET /api/proudcts
```
#### Example Outputs:

```txt
[
    {
        "id": 1,
        "name": "Product Name",
        "price": 45.55,
        "category": "Fish",
        "rating": 4.8,
        "reviews": 3,
    }
]
```

### GET A SINGLE PRODUCT

```http
  GET /api/proudct/${id}
```
#### Example Outputs:

```txt
{
    "id": 1,
    "title": "Essence Mascara Lash Princess",
    "description": "The Essence Mascara Lash Princess is a popular mascara known for its volumizing andlengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.",
    "category": "beauty",
    "price": 9.99,
    "discountPercentage": 10.48,
    "rating": 2.56,
    "stock": 99,
    "tags": [
        "beauty",
        "mascara"
    ],
    "brand": "Essence",
    "sku": "BEA-ESS-ESS-001",
    "weight": 4,
    "dimensions": {
        "width": 15.14,
        "height": 13.08,
        "depth": 22.99
    },
    "warrantyInformation": "1 week warranty",
    "shippingInformation": "Ships in 3-5 business days",
    "availabilityStatus": "In Stock",
    "reviews": [
        {
            "rating": 3,
            "comment": "Would not recommend!",
            "date": "2025-04-30T09:41:02.053Z",
            "reviewerName": "Eleanor Collins",
            "reviewerEmail": "eleanor.collins@x.dummyjson.com"
        },
        {
            "rating": 4,
            "comment": "Very satisfied!",
            "date": "2025-04-30T09:41:02.053Z",
            "reviewerName": "Lucas Gordon",
            "reviewerEmail": "lucas.gordon@x.dummyjson.com"
        },
        {
            "rating": 5,
            "comment": "Highly impressed!",
            "date": "2025-04-30T09:41:02.053Z",
            "reviewerName": "Eleanor Collins",
            "reviewerEmail": "eleanor.collins@x.dummyjson.com"
        }
    ],
    "returnPolicy": "No return policy",
    "minimumOrderQuantity": 48,
    "meta": {
        "createdAt": "2025-04-30T09:41:02.053Z",
        "updatedAt": "2025-04-30T09:41:02.053Z",
        "barcode": "5784719087687",
        "qrCode": "https://cdn.dummyjson.com/public/qr-code.png"
    },
    "images": [
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp"
    ],
    "thumbnail": "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp"
}
```


## Run Locally

Clone the project

```bash
  git clone https://github.com/shahjalalhazari/PS-Assignment-3-JSON-File-Storage
```

Go to the project directory

```bash
  cd PS-Assignment-3-JSON-File-Storage
```

Install dependencies

```bash
  npm install
  npm i express express-rate-limit
```

Start the server

```bash
  npm start
```

##### localhost post is 3000

## Thank You