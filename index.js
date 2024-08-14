import mongodb from 'mongodb';
import dotenv from 'dotenv';
import app from './server.js';
import activitiesDAO from './dao/activitiesDAO.js';
import commentsDAO from './dao/commentsDAO.js';
import usersDAO from './dao/usersDAO.js';

async function main() {
    dotenv.config();

    const client = new mongodb.MongoClient(
        process.env.RUNRIDE_DB_URI
    );
    const port = process.env.PORT || 8000


    try {
        // Connect to MongoDB server
        await client.connect();
        await activitiesDAO.injectDB(client);
        await commentsDAO.injectDB(client);
        await usersDAO.injectDB(client);

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
   
}

main().catch(console.error);