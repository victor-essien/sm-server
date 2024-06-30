import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';
import { createServer } from 'http';
import dbConnection from './db/index.js';
//security packages
import helmet from 'helmet';
import errorMiddleware from './middleware/errorMiddleware.js';
import router from './routes/index.js';
import { initializeSocket } from './controllers/chatController.js';

const __dirname = path.resolve(path.dirname(""))

dotenv.config()

const app = express();
const server = createServer(app);
// Initialize Socket.IO
initializeSocket(server)

app.use(express.static(path.join(__dirname, "view/build")))

const PORT = process.env.PORT || 8800; 
const corsOptions = {
    origin: 'http://localhost:3000', // Allow this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow these methods
    allowedHeaders: ['Content-Type', 'Authorization']
  };
dbConnection()
app.use(helmet())
app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json({limit: '10mb'}))
app.use(express.urlencoded({extended : true}))
app.use(morgan('dev'))
app.use(router);
app.use(errorMiddleware)

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})