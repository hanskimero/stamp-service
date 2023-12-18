import express from 'express';
import apiPostimerkitRouter from './routes/apiPostimerkit';
import path from 'path';
import errorHandler from './errors/errorhandler';
import dotenv from 'dotenv';

dotenv.config();

const app : express.Application = express();

app.use(express.static(path.resolve(__dirname, "public")));

app.use("/api/postimerkit", apiPostimerkitRouter);

app.use(errorHandler);

app.use((req : express.Request, res : express.Response, next : express.NextFunction) => {

    if (!res.headersSent) {
        res.status(404).json({ viesti : "Faulty route"});
    }

    next();
    
});

app.listen(Number(process.env.PORT), () => {

    console.log(`Server running in route : ${Number(process.env.PORT)}`);    

});