// 'use client';

// import React, { useState, useEffect } from 'react';
// import BarcodeScannerComponent from 'react-qr-barcode-scanner';
// import { Trash2, CreditCard } from 'lucide-react';
// import axios from 'axios';

// type CartItem = {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
// };

// const BillingPage = () => {
//   const [scanning, setScanning] = useState(false);
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [manualInput, setManualInput] = useState('');
//   const [total, setTotal] = useState(0);
//   const [cameraAllowed, setCameraAllowed] = useState(true);

//   // Calculate total
//   useEffect(() => {
//     const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
//     setTotal(totalAmount);
//   }, [cart]);

//   // Check camera permission
//   useEffect(() => {
//     navigator.permissions?.query({ name: 'camera' as PermissionName }).then((result) => {
//       setCameraAllowed(result.state !== 'denied');
//     });
//   }, []);

//   const addProductToCart = (product: CartItem) => {
//     const existing = cart.find((item) => item.id === product.id);
//     if (existing) {
//       setCart(
//         cart.map((item) =>
//           item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
//         )
//       );
//     } else {
//       setCart([...cart, { ...product, quantity: 1 }]);
//     }
//   };

//   const handleScan = async (code: string | null) => {
//     if (code) {
//       try {
//         const res = await axios.get(`http://localhost:5001/products/${code}`);
//         const product = res.data;
//         addProductToCart({
//           id: product._id,
//           name: product.name,
//           price: product.price,
//           quantity: 1,
//         });
//         setScanning(false);
//       } catch (err) {
//         console.error('Product not found', err);
//         alert('Product not found!');
//       }
//     }
//   };

//   const handleManualAdd = async () => {
//     if (!manualInput) return;
//     try {
//       const res = await axios.get(`http://localhost:5001/products/${manualInput}`);
//       const product = res.data;
//       addProductToCart({
//         id: product._id,
//         name: product.name,
//         price: product.price,
//         quantity: 1,
//       });
//       setManualInput('');
//     } catch (err) {
//       console.error('Product not found', err);
//       alert('Product not found!');
//     }
//   };

//   const removeFromCart = (id: string) => {
//     setCart(cart.filter((item) => item.id !== id));
//   };

//   const saveBill = async () => {
//     try {
//       const res = await axios.post('http://localhost:5001/bills', {
//         items: cart,
//         totalAmount: total,
//       });
//       alert(`Bill saved successfully! ID: ${res.data.billId}`);
//       setCart([]);
//     } catch (err) {
//       console.error('Error saving bill', err);
//       alert('Failed to save bill.');
//     }
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Billing Page</h1>

//       <div className="mb-4">
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//           onClick={() => setScanning(!scanning)}
//         >
//           {scanning ? 'Stop Scanner' : 'Start Scanner'}
//         </button>
//       </div>

//       {scanning && (
//         <div className="mb-4">
//           {cameraAllowed ? (
//             <BarcodeScannerComponent
//               width={400}
//               height={300}
//               onUpdate={(err, result) => {
//                 if (err) {
//                   console.error('Scanner error:', err);
//                 } else if (result) {
//                   handleScan(result.text);
//                 }
//               }}
//             />
//           ) : (
//             <p className="text-red-500">Camera access denied. Please allow camera permissions.</p>
//           )}
//         </div>
//       )}

//       <div className="mb-4 flex gap-2">
//         <input
//           type="text"
//           value={manualInput}
//           placeholder="Enter Product ID"
//           onChange={(e) => setManualInput(e.target.value)}
//           className="border p-2 rounded"
//         />
//         <button
//           className="bg-green-500 text-white px-4 py-2 rounded"
//           onClick={handleManualAdd}
//         >
//           Add Product
//         </button>
//       </div>

//       <table className="w-full border mb-4">
//         <thead>
//           <tr className="border-b">
//             <th className="p-2">Name</th>
//             <th className="p-2">Price</th>
//             <th className="p-2">Quantity</th>
//             <th className="p-2">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {cart.map((item) => (
//             <tr key={item.id} className="border-b">
//               <td className="p-2">{item.name}</td>
//               <td className="p-2">{item.price}</td>
//               <td className="p-2">{item.quantity}</td>
//               <td className="p-2">
//                 <button onClick={() => removeFromCart(item.id)}>
//                   <Trash2 />
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div className="mb-4 text-xl font-bold">Total: ₹{total}</div>

//       <button
//         className="bg-purple-500 text-white px-4 py-2 rounded flex items-center gap-2"
//         onClick={saveBill}
//       >
//         <CreditCard /> Save Bill
//       </button>
//     </div>
//   );
// };

// export default BillingPage;


import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);
let db: any;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db('billingDB'); // database name
  }
  return db;
}

// POST /api/billing -> Save a new bill
export async function POST(req: NextRequest) {
  try {
    const db = await connectDB();
    const body = await req.json();
    const { items, totalAmount } = body;

    if (!items || !totalAmount) {
      return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
    }

    const result = await db.collection('bills').insertOne({
      items,
      totalAmount,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: 'Bill saved', billId: result.insertedId });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// GET /api/billing -> Fetch all bills
export async function GET(req: NextRequest) {
  try {
    const db = await connectDB();
    const bills = await db.collection('bills').find().sort({ createdAt: -1 }).toArray();
    return NextResponse.json(bills);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
