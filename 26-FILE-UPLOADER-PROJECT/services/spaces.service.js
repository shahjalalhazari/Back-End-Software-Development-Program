const path = require("path");
const crypto = require("crypto");
const fs = require("fs");
const {
	S3Client,
	PutObjectCommand,
} = require("@aws-sdk/client-s3");

const REQUIRED_ENV_VARS = [
	"DO_SPACES_KEY",
	"DO_SPACES_SECRET",
	"DO_SPACES_ENDPOINT",
	"DO_SPACES_BUCKET",
	"DO_SPACES_REGION",
];

function getSpacesConfig() {
	const missing = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);

	if (missing.length > 0) {
		throw new Error(`Missing DigitalOcean Spaces configuration: ${missing.join(", ")}`);
	}

	return {
		bucket: process.env.DO_SPACES_BUCKET,
		endpoint: process.env.DO_SPACES_ENDPOINT,
		region: process.env.DO_SPACES_REGION,
	};
}

function createSpacesClient() {
	const config = getSpacesConfig();

	return {
		config,
		client: new S3Client({
			endpoint: config.endpoint,
			region: config.region,
			credentials: {
				accessKeyId: process.env.DO_SPACES_KEY,
				secretAccessKey: process.env.DO_SPACES_SECRET,
			},
		}),
	};
}

const { client: spacesClient, config: spacesConfig } = createSpacesClient();

function createObjectKey(originalName) {
	const extension = path.extname(originalName).toLowerCase();
	const safeName = path
		.basename(originalName, extension)
		.replace(/[^a-zA-Z0-9_-]/g, "-")
		.slice(0, 80) || "file";

	return `${crypto.randomUUID()}-${safeName}${extension}`;
}

async function uploadToSpaces(file, key = createObjectKey(file.originalname)) {
	await spacesClient.send(new PutObjectCommand({
		Bucket: spacesConfig.bucket,
		Key: key,
		Body: fs.createReadStream(file.path),
		ContentLength: file.size,
		ContentType: file.mimetype,
		ACL: "public-read",
	}));

	return {
		key,
		url: `https://${spacesConfig.bucket}.${spacesConfig.endpoint.replace(/^https?:\/\//, "").replace(/\/$/, "")}/${encodeURI(key)}`,
	};
}

function uploadFile(file) {
	if (!file || !file.path) {
		return Promise.reject(new Error("A local file path is required for Spaces upload"));
	}

	return uploadToSpaces(file);
}

module.exports = {
	uploadFile,
	createObjectKey,
};
