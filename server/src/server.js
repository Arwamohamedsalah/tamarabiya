require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { seedCategories } = require('./services/categorySeedService');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();

    const categorySeed = await seedCategories();
    console.log(
      `Categories ready: ${categorySeed.total} total (${categorySeed.created} new, ${categorySeed.existing} existing)`
    );

    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();

