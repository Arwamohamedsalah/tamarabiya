const mongoose = require('mongoose');

function getMongoOptions() {
  const options = { autoIndex: true };

  // Some Windows networks/antivirus block Atlas TLS cert verification
  if (process.env.MONGODB_TLS_INSECURE === 'true') {
    options.tlsAllowInvalidCertificates = true;
  }

  return options;
}

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri, getMongoOptions());

  console.log('MongoDB connected');
}

module.exports = connectDB;
module.exports.getMongoOptions = getMongoOptions;

