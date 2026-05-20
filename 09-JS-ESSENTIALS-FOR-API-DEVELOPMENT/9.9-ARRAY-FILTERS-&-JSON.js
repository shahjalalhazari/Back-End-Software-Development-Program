// Here are several common "pipeline" patterns backend developers use when working with an array of product-JSON, leveraging map, filter, reduce and related array methods. Feel free to mix and match there idioms to build clean, declarative data flows.


// SOME DUMMY PRODUCTS DATA FROM AN THIRD-PARTY API
const getProducts = async () => {
    const res = await fetch('https://dummyjson.com/products?limit=10');
    const data = await res.json();
    return data.products;
};
const products = await getProducts();

// 1: Filter by criteria
// Only keep products that match one or more conditions:
// in-stock and under $50
const affordableInStock1 = products.filter(p => p.stock > 0).filter(p => p.price < 50);
// or combined
const affordableInStock2 = product.filter(
    p => p.stock > 0 && p.price < 50
);


// 2: Map to a lighter DTO
// Project each product to a samller object (e.g. for API responses):
const lightProducts = products.map(p => ({
    id: p.id,
    name: p.tilte,
    price: p.price.toFixed(2),
    inStock: p.stock > 0
}));


// 3: Chained transformations
// Compose multiple steps in one fluent chain:
const result = products
    .filter(p => p.active)  // only active items
    .map(p => ({            // add a discount field
        ...p,
        discountedPrice: p.price * 0.9,
    }))
    .filter(p => p.discountedPrice <= 100)  // low-cost deals
    .sort((a, b) => a.discountedPrice - b.discountedPrice);


// 4: Aggregations with reduce
// Compute totals, groupings, or other roll-ups:
// Total inventory value
const totalValue = products.reduce(
    (sum, p) => sum + p.price * p.stock,
    0
);

// Group by category
const byCategory = products.reduce((acc, p) => {
    (acc[p.category] = acc[p.category] || []).push(p);
    return acc;
}, {});


// 5: Finding & Checking
// Find a specific product
const skuToFind = "BEA-ESS-ESS-001";
const product = products.find(p => p.sku === skuToFind);
// return the first match or undefined

// Check if any products is on sale
const hasSale = product.some(p => p.onSale === true) ;

// Ensure all products have a price
const allPriced = product.every(p => p.price != null);


// 6: Pagination with slice
// Brake a large array into pages:
function paginate(arr, page=1, perPage=10) {
    const start = (page - 1) * perPage;
    return arr.slice(start, start + perPage);
};


// 7: Sorting
// Sort by any numeric or string field:

// Ascendig Price
product.sort((a, b) => a.price - b.price);

// alphabeticaly by name
products.sort((a, b) => a.title.localCompate(b.title));


// 8: Deduplicating by key
// Remove duplicate products based on an id:
const unique = products.reduce((acc, p) => {
    if (!acc.fint(existing => existing.id === p.id )) {
        acc.push(p);
    }
    return acc;
}, []);


// 9: Combining multiple arrays
// Merge two product lists and dedupe:
const all = [...listA, ...listB];
const mergedUnique = all.reduce((acc, p) => {
    if (!acc.some(x => x.id === p.id)) acc.push(p);
    return acc;
}, []);


// 10: Side-Effects with forEach
// Perform operations without changing the array shape:

// e.g. preload images or sync logs
products.forEach(p => {
    cacheProductImage(p.imageUrl);
    logAccess(`Loaded product ${p.id}`);
});


// Putting it all together
// Can build complex API endpoints by snapping together these patterns:
app.get("/api/deals", (req, res) => {
    const deals = products
        .filter(p => p.active && p.stock > 0)
        .map(p => ({
            id: p.id, name: p.title,
            dealPrice: (p.price * 0.85).toFixed(2)
        }))
        .filter(p => p.dealPrice < 100)
        .sort((a, b) => a.dealPrice - b.dealPrice);

    res.json({count: deals.length, deals});
})