import express from "express";
import cookieParser from "cookie-parser";

import errorMiddleware from "./utils/errorhandler";

const app = express();

app.use(express.json());
app.use(cookieParser());

import userRoutes from './routes/users.routes';
import contentRoutes from './routes/contents.routes';
import categoryRoutes from './routes/categories.routes';
import tagRoutes from './routes/tags.routes';
import commentRoutes from './routes/comments.routes';
import roleRoutes from './routes/roles.routes';

app.use('/api/users', userRoutes);
app.use('/api/contents', contentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/roles', roleRoutes);


app.use(errorMiddleware)

export default app;