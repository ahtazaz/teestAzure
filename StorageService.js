const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

class StorageService {
    constructor() {
        this.storagePath = path.join(__dirname, 'storage'); // Adjust the path as needed
    }

    async initialize(storageType, context, logger) {
        if (storageType !== 'json') {
            throw new Error('Unsupported storage type');
        }
        this.context = context;
        this.logger = logger;

        try {
            await fs.mkdir(this.storagePath, { recursive: true });
        } catch (error) {
            this.logger.error('Error initializing storage:', error);
            throw error;
        }
    }

    async get(bucket, key) {
        try {
            const filePath = path.join(this.storagePath, bucket, `${key}.json`);
            const data = await fs.readFile(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                this.logger.warn('File not found:', key);
                return null;
            }
            this.logger.error('Error reading file:', error);
            throw error;
        }
    }

    async set(bucket, key, data, properties) {
        try {
            const bucketPath = path.join(this.storagePath, bucket);
            await fs.mkdir(bucketPath, { recursive: true });
            const filePath = path.join(bucketPath, `${key}.json`);
            await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
        } catch (error) {
            this.logger.error('Error writing file:', error);
            throw error;
        }
    }
}

module.exports = StorageService;
