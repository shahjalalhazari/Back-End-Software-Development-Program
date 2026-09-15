const fs = require("fs");
const fastq = require("fastq");
const { uploadFile } = require("./spaces.service");

async function uploadAndDeleteLocalFile(file) {
	const uploadedFile = await uploadFile(file);
	await fs.promises.unlink(file.path);

	return {
		...uploadedFile,
		originalname: file.originalname,
		size: file.size,
		mimetype: file.mimetype,
	};
}

const uploadQueue = fastq.promise(uploadAndDeleteLocalFile, 3);

function enqueueUpload(file) {
	return uploadQueue.push(file);
}

function enqueueUploads(files) {
	return Promise.all(files.map(enqueueUpload));
}

module.exports = {
	enqueueUpload,
	enqueueUploads,
};