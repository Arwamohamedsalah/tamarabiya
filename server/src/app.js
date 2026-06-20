const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const categoryRoutes = require('./routes/categoryRoutes');
const imageRoutes = require('./routes/imageRoutes');
const pageContentRoutes = require('./routes/pageContentRoutes');
const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');
const contactRoutes = require('./routes/contactRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

/* ======================
   Security & Middleware
   ====================== */

// Basic security headers
app.use(helmet());

// CORS
const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  'http://localhost:5173',
  'http://localhost:3000',
  'https://tamarabiya.com',
  'http://tamarabiya.com',
  'https://www.tamarabiya.com',
  'http://www.tamarabiya.com',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, postman)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        process.env.NODE_ENV !== 'production'
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Logging (development only)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsers
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

/* ======================
   Health Check
   ====================== */

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

/* ======================
   Routes
   ====================== */

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/page-content', pageContentRoutes);
app.use('/api/site-settings', require('./routes/siteSettingsRoutes'));
app.use('/api/contact', contactRoutes);
app.use('/api', fileRoutes);

/* ======================
   Error Handling
   ====================== */

app.use(notFound);
app.use(errorHandler);

module.exports = app;