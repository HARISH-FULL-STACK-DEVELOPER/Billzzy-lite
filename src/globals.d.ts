// src/globals.d.ts

import { Mongoose } from 'mongoose';

declare global {
  var mongoose: {
    promise: Promise<Mongoose> | null;
    conn: Mongoose | null;
  };
}

declare module 'react-qr-barcode-scanner';
