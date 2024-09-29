import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import cookieParser from 'cookie-parser'
import { globalErrorHandler } from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';
import router from './app/routes';
import handleEmptyResponse from './app/middleware/handleEmptyResponse';
import fileUpload from 'express-fileupload'

const app: Application = express();

//parsers
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(fileUpload())
app.use(handleEmptyResponse);


//root route
app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Welcome to the Car Washing Service API');
  });
// application routes
app.use('/api', router);


app.use(globalErrorHandler)
app.use(notFound)

export default app;
