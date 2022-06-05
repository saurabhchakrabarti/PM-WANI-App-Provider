import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import 'express-async-errors'; // to use throw in async functions
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/error-handler';
// import BaseRouter from './routes';
const app = express();
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression())
// Add APIs
// app.use('/api', BaseRouter);
// Export express instance


app.use(errorHandler);
export { app };

