import { createClient } from 'redis';

export class RedisManager {
    static instance;
    redisClient;

    constructor() {
        this.redisClient = createClient({
    username: 'default',
    password: 'Uinvq64tiLm4sViipCv0hj4hZArGB6Hi',
    socket: {
        host: 'redis-18064.c10.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 18064
    }
});
        this.redisClient.on('error', err => console.log('Redis Client Error', err));
    }

    async connect() {
        if (!this.redisClient.isOpen) {
            await this.redisClient.connect();
            console.log("Connected to Redis successfully.");
        }
    }

    static getInstance() {
        if (!RedisManager.instance) {
            RedisManager.instance = new RedisManager();
        }
        return RedisManager.instance;
    }

    async pushData(queue, data) {
        if (!this.redisClient.isOpen) {
            await this.connect();
        }
        await this.redisClient.lPush(queue, JSON.stringify(data));
    }

    async getData(queue) {
        // Ensure the client is connected before getting data
        if (!this.redisClient.isOpen) {
            await this.connect();
        }
        const result = await this.redisClient.rPop(queue);
        
        if (result === null) {
            return null;
        }
        return JSON.parse(result);
    }
}