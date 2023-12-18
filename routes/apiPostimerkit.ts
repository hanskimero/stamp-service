import express from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { ErrorInfo } from "../errors/errorhandler";

const prisma : PrismaClient = new PrismaClient({log:["query"]});

const apiPostimerkitRouter : express.Router = express.Router();

apiPostimerkitRouter.get("/", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    try {


        if (typeof req.query.hakusana === "string" && String(req.query.hakusana).length > 0) {

            let hakusana : string = `${req.query.hakusana}`;

            let hakukohde : string = String(req.query.hakukohde);

            const timespan = (req.query.timespan as string)?.split(',') || ['1856', '2020'];
            const timespanAlku = parseInt(timespan[0]) || 1856;
            const timespanLoppu = parseInt(timespan[1]) || 2020;

            let postimerkit;

            switch (hakukohde) {
                case 'asiasanat':
             
                    let haku1 = `% ${req.query.hakusana} %`;
                    let haku2 = `% ${req.query.hakusana}%`;
                    let haku3 = `%${req.query.hakusana} %`;
                    let haku4 = `%${req.query.hakusana}%`;
                    postimerkit = await prisma.$queryRaw`SELECT * FROM postimerkki WHERE
                                                           (LOWER(asiasanat) LIKE LOWER(${haku1}) OR
                                                           LOWER(asiasanat) LIKE LOWER(${haku2}) OR
                                                           LOWER(asiasanat) LIKE LOWER(${haku3}) OR
                                                           LOWER(asiasanat) LIKE LOWER(${haku4})) AND
                                                           ilmestymisvuosi BETWEEN ${timespanAlku} AND ${timespanLoppu}`; 
                    break;  
                case 'merkinNimi':
                  
                    postimerkit = await prisma.$queryRaw`SELECT * FROM postimerkki WHERE 
                                                        LOWER(merkinNimi) = LOWER(${hakusana}) AND
                                                        (ilmestymisvuosi BETWEEN ${timespanAlku} AND ${timespanLoppu})`;
                  
                    break;
                case 'taiteilija':
                
                    postimerkit = await prisma.$queryRaw`SELECT * FROM postimerkki WHERE 
                                                        LOWER(taiteilija) = LOWER(${hakusana}) AND
                                                        (ilmestymisvuosi BETWEEN ${timespanAlku} AND ${timespanLoppu})`;
                    break;
            }

            res.json(postimerkit);

        } else {
            next(new ErrorInfo(400))
        }

       

    } catch (e : any) {
        next(new ErrorInfo());
    }
});

export default apiPostimerkitRouter;