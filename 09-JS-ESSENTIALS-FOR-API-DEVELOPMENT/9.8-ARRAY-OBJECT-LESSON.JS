// 1: What's the difference between an Array and an Object in JS?
// * Array is an ordered list of values accessed by numeric indices (0,1,2...).
// * Object is a collection of key-value pairs where keys are strings (or Symbols) and values can be anything.


// 2: How to add and remove elements from an array?
let arr = [1, 2, 3];

// Add to end
arr.push(4); // arr -> [1, 2, 3, 4]

// Remove from end
arr.pop(); // returns 4, arr -> [1, 2, 3]

// Add to front
arr.unshift(0); // arr -> [0, 1, 2, 3]

// Remove from front
arr.shift(); // returns 0, arr -> [1, 2, 3]


// 3: How to combine two arrays into one?
// Using Concat:
[1,2].concat([3, 4]); // -> [1, 2, 3, 4]
// Using spread syntax:
[...[1,2], ...[3,4]]; // -> [1, 2, 3, 4]


// 4: What does Array.prototype.map do? Give an example:
// Creates a new array by transforming each element with a callback.
const nums = [1, 2, 3];
const squares = nums.map(n => n * n); // squares -> [1, 4, 9]


// 5: How can filter out only even numbers from an array?
const numbers = [1, 2, 3, 4, 5, 6];
const evens = numbers.filter(n => n % 2 === 0); // evens -> [2, 4, 6]


// 6: What's the purpose of reduce on an array? Illustrate by summing an array
// reduce "accumulates" each element into a single value via a callback.
const nums = [1, 2, 3, 4];
const sum = nums.reduce((acc, cur) => acc + cur, 0); // sum -> 10


// 7: How to loop over all propertices of a object?
const person = { name: "Alice", age: 30, city: "Dhaka"};
for (let key in person) {
    console.log(key, person[kay]);
};
// name Alice
// age 30
// city Dhaka


// 8: What is object destructuring? Give an example
// Extracts properties into variables in one step:
const point = { x: 10, y: 20, z: 30 };
const { x, y } = point;
console.log(x, y); // 10 20


// 9: How to add a new key-value pair to and existing object?
const obj = {a:1};
obj.b = 2; // using dot
obj["c"] = 3 // using brackets
// obj -> { a:1, b:2, c:3}


// 10: Explain to difference between shallow and deep copy of arrays/objects.
// * Shallow copy (e.g. [...arr] or {...obg}) duplicates only the top level. Nested objects/arrays ramain shared.
// Deep Copy duplicates everything recursively (e.g. using JSON.parse(JSON.stringify(...)), or structured cloning).


// 11: How to check if a value is an array?
Array.isArray([1, 2, 3]); // true
Array.isArray({length: 3}); // false


// 12: What does Object.keys(obj) return?
// An array of an object's own enumerable property names:
Object.keys({ a:1, b:2 }); //-> ["a", "b"]