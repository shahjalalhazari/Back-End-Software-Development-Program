const allProducts = require("../products.json");


const getSingleProduct = (req, res) => {
    const { id } = req.params;
    const product = allProducts.find(p => p.id === parseInt(id));
    res.status(200).send(product);
}

const getAllProducts = (req, res) => {
    // const simplifiedProductsList = allProducts.map(product => ({
    //     id: product.id,
    //     name: product.title,
    //     price: product.price,
    //     category: product.category,
    //     rating: product.rating,
    //     reviews: product.reviews.length
    // }));

    // GET ALL PRODUCTS DATA USIGN FOOR LOOP
    const simplifiedProudctsList = [];
    
    for (let i = 0; i < allProducts.length; i ++) {
        const product = allProducts[i];

        // COUNT REVIEWS USING FOR LOOP
        let reviewsCount = 0;
        for (let j = 0; j <product.reviews.length; j++) {
            reviewsCount++;
        }

        simplifiedProudctsList.push({
            id: product.id,
            name: product.title,
            price: product.price,
            category: product.category,
            rating: product.rating,
            reviews: reviewsCount
        });
    }
    res.status(200).send(simplifiedProudctsList);
}

module.exports = {
    getSingleProduct,
    getAllProducts
}