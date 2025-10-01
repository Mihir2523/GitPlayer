import dotenv from 'dotenv';
import express from 'express';
import cron from 'node-cron';
import {connectDB} from './utils/connectDB.js';
import { startBot } from './Managers/BotManager.js';
import { RedisManager } from './Managers/RedisManager.js';
import EmailManager from './Managers/EmailManager.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const emailManager = new EmailManager();
const redisClient = RedisManager.getInstance();

async function checkEmailQueues() {
    try {
        const quizJob = await redisClient.getData('quiz');
        if (quizJob) {
            console.log("Processing 'quiz' job from queue...");
            await emailManager.sendEmail(quizJob.type, quizJob.data, quizJob.receipent);
            return; // Process one job per run to avoid rate limiting
        }

        const emailJob = await redisClient.getData('assignment');
        if (emailJob) {
             console.log("Processing 'email' job from queue...");
             await emailManager.sendEmail(emailJob.type, emailJob.data, emailJob.receipent);
        }
    } catch (error) {
        console.error('Error processing email queue:', error);
    }
}

app.post('/sendEmail', async (req, res) => {
    try {
        const { type, data, receipent } = req.body;
        console.log({
            type,
            data,
            receipent
        });
        // if (type !== 'quiz' && type !== 'assignment') {
        //     return res.status(400).json({ message: 'Invalid type specified. Must be "quiz" or "email".' });
        // }
        
        await redisClient.pushData(type, { type, data, receipent });
        res.status(200).json({ message: 'Email job queued successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error queueing email job', error: error.message });
    }
});

app.post('/botPost',async (req,res) => {

    /*
        The Title Should be like
        Notification for {Quiz,Group,Assignment}
        Then the Desciption for {endDate,groupName,Time if any}
    */
    const finalResult = req.body;
    const newPost = new RedditPosts({
                title: finalResult.title,
                description: finalResult.description,
                imgUrl: "",
                owner: "68c70472465e33a10dffca1f",
                group: null
            });
    await newPost.save();
    res.json({message:"Created"});
});
async function startServer() {
    try {
        await connectDB();
        
        await redisClient.connect();
        
        startBot();
        
        cron.schedule('*/1 * * * *', checkEmailQueues);

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Failed to start the server:", error);
        process.exit(1);
    }
}

startServer();