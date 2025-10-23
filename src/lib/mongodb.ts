// src/lib/mongodb.ts

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// Use the global variable we defined in globals.d.ts
let cached = global.mongoose;

if (!cached) {
  // If it's not cached, initialize it
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // If we have a cached connection, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If there's no promise, create one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // The fix is here: adding '!' tells TypeScript that MONGODB_URI is not undefined.
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    // Await the promise to get the connection
    cached.conn = await cached.promise;
  } catch (e) {
    // If connection fails, reset the promise and throw the error
    cached.promise = null;
    throw e;
  }
  
  return cached.conn;
}

export default dbConnect;