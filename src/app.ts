import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

const app = express();

// Defining the public directory
app.use(express.static(__dirname + '/public'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Routes

// Home Route
app.get('/', cors(), async (req, res) => {
  res.status(200).json({ name: 'Hack-X Server' });
});

// Not found route
app.get('*', cors(), (req, res) => {
  return res.status(404).json({ message: 'API URL is not valid' });
});

export default app;
