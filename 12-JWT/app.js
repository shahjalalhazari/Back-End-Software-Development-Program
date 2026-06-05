const crypto = require('crypto');

const data = "Shahjalal Hazari";

const hash = crypto.createHash('sha256').update(data).digest('hex'); // WITHOUT SECRET KEY
const hash2 = crypto.createHmac("sha256", "1b96321b506ac595baf61ca").update(data).digest("hex"); // WITH SECRET KEY

console.log(`Data: ${data}`);
console.log(`SHA-256 Hash: ${hash}`);
console.log(`HMAC-SHA256 Hash: ${hash2}`);