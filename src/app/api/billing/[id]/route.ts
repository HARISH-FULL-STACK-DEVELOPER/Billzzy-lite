import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);
let db: any;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db('billingDB');
  }
  return db;
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await connectDB();
    const bill = await db.collection('bills').findOne({ _id: new ObjectId(params.id) });
    if (!bill) return NextResponse.json({ message: 'Bill not found' }, { status: 404 });
    return NextResponse.json(bill);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
