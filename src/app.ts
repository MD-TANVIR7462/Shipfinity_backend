import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import httpStatus from 'http-status';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';

const app: Application = express();


//parsers

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ['https://myshopfinity.vercel.app', 'http://localhost:5173'],
    credentials: true,
  }),
);

//welcome route
app.get('/', (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: 'Welcome to shopfinity Server',
    data: null,
  });
});

// application routes
app.use('/api', router);

//global error handler
app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
