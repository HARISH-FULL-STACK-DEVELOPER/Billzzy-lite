// 'use client';

// import React, { useState, useEffect, useRef } from 'react';
// import QRCode from 'react-qr-code';
// import { Scan, Trash2, Send, CreditCard } from 'lucide-react';
// import { Html5Qrcode } from 'html5-qrcode';

// type CartItem = {
//   id: number;
//   productId?: number;
//   name: string;
//   quantity: number;
//   price: number;
// };

// type InventoryProduct = {
//   id: number;
//   name: string;
//   quantity: number;
//   sellingPrice: number;
//   image?: string;
// };

// export default function BillingPage() {
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [productName, setProductName] = useState('');
//   const [productPrice, setProductPrice] = useState<number>(0);
//   const [whatsappNumber, setWhatsappNumber] = useState('');
//   const [scanning, setScanning] = useState(false);
//   const [showPaymentOptions, setShowPaymentOptions] = useState(false);
//   const [selectedPayment, setSelectedPayment] = useState<string>('');

//   const [inventory, setInventory] = useState<InventoryProduct[]>([]);
//   const [suggestions, setSuggestions] = useState<InventoryProduct[]>([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const suggestionsRef = useRef<HTMLDivElement | null>(null);
//   const scannerRef = useRef<Html5Qrcode | null>(null);
//   const qrRegionId = 'qr-scanner-region';

//   const totalAmount = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);
//   const merchantUpi = 'harish2harish2004@okaxis';
//   const merchantName = 'Billzzy Lite';
//   const upiQR = `upi://pay?pa=${merchantUpi}&pn=${encodeURIComponent(
//     merchantName
//   )}&am=${totalAmount.toFixed(2)}&cu=INR&tn=${encodeURIComponent('Bill Payment')}`;

//   // Fetch inventory
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await fetch('/api/products');
//         if (!res.ok) throw new Error('Failed to fetch products');
//         const data: InventoryProduct[] = await res.json();
//         setInventory(data);
//       } catch (err) {
//         console.error('Error fetching inventory:', err);
//       }
//     };
//     fetchProducts();
//   }, []);

//   // Suggestions logic
//   useEffect(() => {
//     if (!productName) {
//       setSuggestions([]);
//       setShowSuggestions(false);
//       return;
//     }
//     const q = productName.trim().toLowerCase();
//     const filtered = inventory
//       .filter((p) => p.name.toLowerCase().includes(q))
//       .slice(0, 8);
//     setSuggestions(filtered);
//     setShowSuggestions(filtered.length > 0);
//   }, [productName, inventory]);

//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (!suggestionsRef.current) return;
//       if (!suggestionsRef.current.contains(e.target as Node)) {
//         setShowSuggestions(false);
//       }
//     };
//     document.addEventListener('mousedown', handler);
//     return () => document.removeEventListener('mousedown', handler);
//   }, []);

//   // QR Scanner
//   useEffect(() => {
//     const startScanner = async () => {
//       if (!scanning) return;

//       const qrRegion = document.getElementById(qrRegionId);
//       if (!qrRegion) return;

//       const html5Qrcode = new Html5Qrcode(qrRegionId);
//       scannerRef.current = html5Qrcode;

//       try {
//         await html5Qrcode.start(
//           { facingMode: 'environment' },
//           { fps: 10, qrbox: 250 },
//           (decodedText) => {
//             const product = inventory.find(
//               (p) => p.name.toLowerCase() === decodedText.toLowerCase()
//             );
//             if (product) addToCart(product.name, product.sellingPrice, product.id);
//             else addToCart(decodedText, 0);
//           },
//           (_) => {}
//         );
//       } catch (err) {
//         console.error('Scanner error:', err);
//         alert('Unable to access camera. Please allow camera permissions.');
//         setScanning(false);
//       }
//     };

//     // Stop previous scanner if any
//     if (scannerRef.current) {
//       scannerRef.current
//         .stop()
//         .then(() => scannerRef.current?.clear())
//         .catch(() => {})
//         .finally(() => {
//           scannerRef.current = null;
//           if (scanning) startScanner();
//         });
//     } else {
//       if (scanning) startScanner();
//     }

//     return () => {
//       if (scannerRef.current) {
//         scannerRef.current
//           .stop()
//           .then(() => scannerRef.current?.clear())
//           .catch(() => {})
//           .finally(() => (scannerRef.current = null));
//       }
//     };
//   }, [scanning, inventory]);

//   // Cart operations
//   const addToCart = (name: string, price: number, productId?: number) => {
//     if (!name || price < 0) return;
//     setCart((prev) => {
//       if (productId) {
//         const existing = prev.find((c) => c.productId === productId);
//         if (existing)
//           return prev.map((c) =>
//             c.productId === productId ? { ...c, quantity: c.quantity + 1 } : c
//           );
//       }
//       const item: CartItem = {
//         id: Date.now() + Math.floor(Math.random() * 1000),
//         productId,
//         name,
//         quantity: 1,
//         price,
//       };
//       return [...prev, item];
//     });
//     setProductName('');
//     setProductPrice(0);
//     setShowSuggestions(false);
//   };

//   const onSelectSuggestion = (p: InventoryProduct) =>
//     addToCart(p.name, p.sellingPrice, p.id);

//   const handleManualAdd = () => {
//     if (!productName || productPrice <= 0) {
//       alert('Enter valid name and price');
//       return;
//     }
//     const match = inventory.find(
//       (inv) => inv.name.toLowerCase() === productName.trim().toLowerCase()
//     );
//     if (match) addToCart(match.name, match.sellingPrice, match.id);
//     else addToCart(productName.trim(), productPrice);
//   };

//   const editCartItem = (
//     id: number,
//     field: 'name' | 'price' | 'quantity',
//     value: string | number
//   ) => {
//     setCart(
//       cart.map((c) => {
//         if (c.id === id) {
//           let newValue: any = value;
//           if (field === 'quantity') newValue = parseInt(value as string) || 1;
//           if (field === 'price') newValue = parseFloat(value as string) || c.price;
//           return { ...c, [field]: newValue };
//         }
//         return c;
//       })
//     );
//   };

//   const deleteCartItem = (id: number) =>
//     setCart(cart.filter((c) => c.id !== id));

//   const sendWhatsApp = () => {
//     if (!whatsappNumber) return alert('Enter WhatsApp number');
//     if (!selectedPayment) return alert('Select a payment method');

//     const message = cart
//       .map((p) => `${p.name} x${p.quantity} = ₹${(p.price * p.quantity).toFixed(2)}`)
//       .join('\n');

//     const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
//       `Hello! Here is your bill:\n${message}\nTotal: ₹${totalAmount.toFixed(
//         2
//       )}\nPayment Method: ${selectedPayment}`
//     )}`;
//     window.open(url, '_blank');
//   };

//   return (
//     <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
//       {/* Header */}
//       <div className="p-4 bg-white shadow-md flex justify-between items-center gap-3">
//         <span className="font-bold text-[#5a4fcf] text-lg">Billing</span>
//         <button
//           onClick={() => setScanning((prev) => !prev)}
//           className="flex items-center gap-2 px-4 py-2 bg-[#5a4fcf] text-white rounded-xl font-semibold hover:bg-[#4a3faf]"
//         >
//           <Scan className="w-5 h-5" />
//           {scanning ? 'Stop' : 'Scan'}
//         </button>
//       </div>

//       {/* Main */}
//       <div className="flex flex-col lg:flex-row flex-1 overflow-hidden gap-4 p-4">
//         {/* Left - Cart */}
//         <div className="flex-1 flex flex-col">
//           {/* Add Product */}
//           <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm mb-5">
//             <div className="flex flex-col gap-3">
//               <div className="relative" ref={suggestionsRef}>
//                 <input
//                   type="text"
//                   placeholder="Search or enter product name"
//                   className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#5a4fcf] focus:border-[#5a4fcf] outline-none transition-all"
//                   value={productName}
//                   onChange={(e) => {
//                     setProductName(e.target.value);
//                     setShowSuggestions(true);
//                   }}
//                 />
//                 {showSuggestions && suggestions.length > 0 && (
//                   <div className="absolute z-50 bg-white border-2 border-gray-200 mt-2 w-full rounded-xl shadow-lg max-h-64 overflow-auto">
//                     {suggestions.map((s) => (
//                       <button
//                         key={s.id}
//                         onClick={() => onSelectSuggestion(s)}
//                         className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
//                       >
//                         <div className="flex justify-between items-center">
//                           <span className="font-semibold text-gray-900">{s.name}</span>
//                           <span className="text-[#5a4fcf] font-bold">₹{s.sellingPrice}</span>
//                         </div>
//                         <div className="text-sm text-gray-500 mt-1">{s.quantity} in stock</div>
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <div className="flex gap-3">
//                 <input
//                   type="number"
//                   placeholder="Price"
//                   className="flex-1 border-2 border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-[#5a4fcf] focus:border-[#5a4fcf] outline-none transition-all text-sm"
//                   value={productPrice || ''}
//                   onChange={(e) => setProductPrice(parseFloat(e.target.value) || 0)}
//                 />
//                 <button
//                   onClick={handleManualAdd}
//                   className="bg-green-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-600 transition-all shadow-md"
//                 >
//                   Add
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Cart Items */}
//           <div className="flex-1 overflow-y-auto space-y-3">
//             {cart.map((product) => (
//               <div key={product.id} className="bg-white rounded-2xl p-4 shadow-sm">
//                 <div className="flex flex-col gap-3">
//                   <input
//                     type="text"
//                     value={product.name}
//                     onChange={(e) => editCartItem(product.id, 'name', e.target.value)}
//                     className="border-2 border-gray-200 p-2 rounded-xl font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-[#5a4fcf] focus:border-[#5a4fcf]"
//                   />
//                   <div className="flex items-center justify-between gap-3">
//                     <div className="flex items-center gap-3 flex-1">
//                       <div className="flex items-center gap-2">
//                         <span className="text-sm text-gray-600">Qty:</span>
//                         <input
//                           type="number"
//                           value={product.quantity}
//                           onChange={(e) =>
//                             editCartItem(product.id, 'quantity', e.target.value)
//                           }
//                           className="border-2 border-gray-200 p-2 rounded-xl w-14 text-center font-semibold outline-none focus:ring-2 focus:ring-[#5a4fcf] focus:border-[#5a4fcf] text-sm"
//                           min="1"
//                         />
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <span className="text-sm text-gray-600">₹</span>
//                         <input
//                           type="number"
//                           value={product.price}
//                           onChange={(e) =>
//                             editCartItem(product.id, 'price', e.target.value)
//                           }
//                           className="border-2 border-gray-200 p-2 rounded-xl w-20 text-right font-semibold outline-none focus:ring-2 focus:ring-[#5a4fcf] focus:border-[#5a4fcf] text-sm"
//                         />
//                       </div>
//                       <span className="text-sm text-gray-600">
//                         Total: ₹{(product.quantity * product.price).toFixed(2)}
//                       </span>
//                     </div>
//                     <button
//                       onClick={() => deleteCartItem(product.id)}
//                       className="bg-red-500 text-white p-3 rounded-xl hover:bg-red-600 transition-all"
//                     >
//                       <Trash2 className="w-5 h-5" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Right - Scanner */}
//         <div className="lg:w-96 flex flex-col gap-4">
//           {scanning && (
//             <div className="bg-white p-4 rounded-xl border-2 border-[#5a4fcf] shadow-lg">
//               <h3 className="font-bold text-[#5a4fcf] mb-3 text-center">Scanner Active</h3>
//               <div
//                 id={qrRegionId}
//                 className="w-full rounded-xl"
//                 style={{ height: 300 }}
//               />
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="bg-white border-t-2 border-[#5a4fcf] shadow-2xl p-5">
//         <div className="flex flex-col gap-3 max-w-5xl mx-auto">
//           <div className="flex justify-between text-gray-700 text-lg font-semibold">
//             <span>Grand Total</span>
//             <span className="text-3xl font-bold text-[#5a4fcf]">
//               ₹{totalAmount.toFixed(2)}
//             </span>
//           </div>

//           <input
//             type="tel"
//             placeholder="WhatsApp number (e.g., 919876543210)"
//             className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#5a4fcf] focus:border-[#5a4fcf] outline-none transition-all"
//             value={whatsappNumber}
//             onChange={(e) => setWhatsappNumber(e.target.value)}
//           />

//           {/* Payment Options */}
//           <div className="flex flex-wrap items-center gap-3 mt-2">
//             <button
//               onClick={sendWhatsApp}
//               className="flex-1 bg-green-500 text-white px-6 py-4 rounded-xl font-bold hover:bg-green-600 transition-all shadow-lg flex items-center justify-center gap-2 min-w-[140px]"
//             >
//               <Send className="w-5 h-5" />
//               Send Bill in Whatsapp
//             </button>

//             <button
//               onClick={() => setShowPaymentOptions(!showPaymentOptions)}
//               className="bg-blue-500 text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg flex items-center justify-center gap-2 min-w-[120px]"
//             >
//               <CreditCard className="w-5 h-5" />
//               Payment
//             </button>
//           </div>

//           {showPaymentOptions && (
//             <div className="flex gap-2 flex-wrap mt-2">
//               {['Cash', 'UPI', 'QR Code', 'Card'].map((method) => (
//                 <button
//                   key={method}
//                   onClick={() => setSelectedPayment(method)}
//                   className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
//                     selectedPayment === method
//                       ? 'bg-[#5a4fcf] text-white shadow-lg'
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                   }`}
//                 >
//                   {method}
//                 </button>
//               ))}
//             </div>
//           )}

//           {selectedPayment === 'QR Code' && (
//             <div className="p-4 bg-white border-2 border-[#5a4fcf] rounded-2xl mt-3">
//               <h3 className="text-gray-900 font-bold mb-3 text-center">Scan to Pay</h3>
//               <div className="flex justify-center">
//                 <QRCode value={upiQR} size={200} />
//               </div>
//               <p className="text-center mt-2 text-gray-600 text-sm">
//                 Pay using any UPI app to <b>{merchantUpi}</b>
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



'use client';

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'react-qr-code';
import { Scan, Trash2, Send, CreditCard, ShoppingCart, Plus, X } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

type CartItem = {
  id: number;
  productId?: number;
  name: string;
  quantity: number;
  price: number;
};

type InventoryProduct = {
  id: number;
  name: string;
  quantity: number;
  sellingPrice: number;
  image?: string;
};

export default function BillingPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState<number>(0);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [scanning, setScanning] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>('');

  const [inventory, setInventory] = useState<InventoryProduct[]>([]);
  const [suggestions, setSuggestions] = useState<InventoryProduct[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const qrRegionId = 'qr-scanner-region';

  const totalAmount = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const merchantUpi = 'harish2harish2004@okaxis';
  const merchantName = 'Billzzy Lite';
  const upiQR = `upi://pay?pa=${merchantUpi}&pn=${encodeURIComponent(
    merchantName
  )}&am=${totalAmount.toFixed(2)}&cu=INR&tn=${encodeURIComponent('Bill Payment')}`;

  // Fetch inventory
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data: InventoryProduct[] = await res.json();
        setInventory(data);
      } catch (err) {
        console.error('Error fetching inventory:', err);
      }
    };
    fetchProducts();
  }, []);

  // Suggestions logic
  useEffect(() => {
    if (!productName) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const q = productName.trim().toLowerCase();
    const filtered = inventory
      .filter((p) => p.name.toLowerCase().includes(q))
      .slice(0, 8);
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  }, [productName, inventory]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!suggestionsRef.current) return;
      if (!suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // QR Scanner
  useEffect(() => {
    const startScanner = async () => {
      if (!scanning) return;

      const qrRegion = document.getElementById(qrRegionId);
      if (!qrRegion) return;

      const html5Qrcode = new Html5Qrcode(qrRegionId);
      scannerRef.current = html5Qrcode;

      try {
        await html5Qrcode.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: 250 },
          (decodedText) => {
            const product = inventory.find(
              (p) => p.name.toLowerCase() === decodedText.toLowerCase()
            );
            if (product) addToCart(product.name, product.sellingPrice, product.id);
            else addToCart(decodedText, 0);
          },
          (_) => {}
        );
      } catch (err) {
        console.error('Scanner error:', err);
        alert('Unable to access camera. Please allow camera permissions.');
        setScanning(false);
      }
    };

    if (scannerRef.current) {
      scannerRef.current
        .stop()
        .then(() => scannerRef.current?.clear())
        .catch(() => {})
        .finally(() => {
          scannerRef.current = null;
          if (scanning) startScanner();
        });
    } else {
      if (scanning) startScanner();
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => scannerRef.current?.clear())
          .catch(() => {})
          .finally(() => (scannerRef.current = null));
      }
    };
  }, [scanning, inventory]);

  // Cart operations
  const addToCart = (name: string, price: number, productId?: number) => {
    if (!name || price < 0) return;
    setCart((prev) => {
      if (productId) {
        const existing = prev.find((c) => c.productId === productId);
        if (existing)
          return prev.map((c) =>
            c.productId === productId ? { ...c, quantity: c.quantity + 1 } : c
          );
      }
      const item: CartItem = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        productId,
        name,
        quantity: 1,
        price,
      };
      return [...prev, item];
    });
    setProductName('');
    setProductPrice(0);
    setShowSuggestions(false);
  };

  const onSelectSuggestion = (p: InventoryProduct) =>
    addToCart(p.name, p.sellingPrice, p.id);

  const handleManualAdd = () => {
    if (!productName || productPrice <= 0) {
      alert('Enter valid name and price');
      return;
    }
    const match = inventory.find(
      (inv) => inv.name.toLowerCase() === productName.trim().toLowerCase()
    );
    if (match) addToCart(match.name, match.sellingPrice, match.id);
    else addToCart(productName.trim(), productPrice);
  };

  const editCartItem = (
    id: number,
    field: 'name' | 'price' | 'quantity',
    value: string | number
  ) => {
    setCart(
      cart.map((c) => {
        if (c.id === id) {
          let newValue: any = value;
          if (field === 'quantity') newValue = parseInt(value as string) || 1;
          if (field === 'price') newValue = parseFloat(value as string) || c.price;
          return { ...c, [field]: newValue };
        }
        return c;
      })
    );
  };

  const deleteCartItem = (id: number) =>
    setCart(cart.filter((c) => c.id !== id));

  const sendWhatsApp = () => {
    if (!whatsappNumber) return alert('Enter WhatsApp number');
    if (!selectedPayment) return alert('Select a payment method');

    const message = cart
      .map((p) => `${p.name} x${p.quantity} = ₹${(p.price * p.quantity).toFixed(2)}`)
      .join('\n');

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      `Hello! Here is your bill:\n${message}\nTotal: ₹${totalAmount.toFixed(
        2
      )}\nPayment Method: ${selectedPayment}`
    )}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#5a4fcf] to-[#7b6fd8] text-white px-4 py-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <ShoppingCart className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Billing</h1>
              <p className="text-sm text-white/80">{cart.length} items in cart</p>
            </div>
          </div>
          <button
            onClick={() => setScanning((prev) => !prev)}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-bold transition-all shadow-lg ${
              scanning
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-white text-[#5a4fcf] hover:shadow-xl'
            }`}
          >
            {scanning ? <X className="w-5 h-5" /> : <Scan className="w-5 h-5" />}
            {scanning ? 'Stop' : 'Scan'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {/* Scanner */}
        {scanning && (
          <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-[#5a4fcf]">
            <h3 className="font-bold text-[#5a4fcf] mb-3 text-center text-lg">
              Scanner Active - Point at QR/Barcode
            </h3>
            <div
              id={qrRegionId}
              className="w-full rounded-xl overflow-hidden"
              style={{ height: 300 }}
            />
          </div>
        )}

        {/* Add Product Section */}
        <div className="bg-white rounded-2xl p-4 shadow-md">
          <h3 className="font-bold text-gray-900 mb-3 text-lg flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#5a4fcf]" />
            Add Product
          </h3>
          <div className="flex flex-col gap-3">
            <div className="relative" ref={suggestionsRef}>
              <input
                type="text"
                placeholder="Search or enter product name"
                className="w-full border-2 border-gray-200 p-3 rounded-2xl focus:ring-2 focus:ring-[#5a4fcf] focus:border-[#5a4fcf] outline-none transition-all font-medium"
                value={productName}
                onChange={(e) => {
                  setProductName(e.target.value);
                  setShowSuggestions(true);
                }}
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 bg-white border-2 border-gray-200 mt-2 w-full rounded-2xl shadow-xl max-h-64 overflow-auto">
                  {suggestions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => onSelectSuggestion(s)}
                      className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-[#5a4fcf]/10 hover:to-[#7b6fd8]/10 border-b border-gray-100 last:border-0 transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900">{s.name}</span>
                        <span className="text-[#5a4fcf] font-bold text-lg">₹{s.sellingPrice}</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1 font-medium">
                        {s.quantity} in stock
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  placeholder="Price"
                  className="w-full border-2 border-gray-200 pl-8 pr-4 py-3 rounded-2xl focus:ring-2 focus:ring-[#5a4fcf] focus:border-[#5a4fcf] outline-none transition-all font-bold"
                  value={productPrice || ''}
                  onChange={(e) => setProductPrice(parseFloat(e.target.value) || 0)}
                />
              </div>
              <button
                onClick={handleManualAdd}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-2xl font-bold hover:shadow-lg transition-all"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Cart Items */}
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium text-lg">Cart is empty</p>
            <p className="text-sm text-gray-400 mt-1">Add products to get started</p>
          </div>
        ) : (
          <div className="space-y-3 pb-64">
            {cart.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-4 shadow-md border-2 border-gray-100 hover:border-[#5a4fcf] transition-all"
              >
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => editCartItem(product.id, 'name', e.target.value)}
                    className="border-2 border-gray-200 p-3 rounded-xl font-bold text-gray-900 outline-none focus:ring-2 focus:ring-[#5a4fcf] focus:border-[#5a4fcf] transition-all"
                  />
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-wrap flex-1">
                      <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl">
                        <span className="text-sm text-gray-600 font-semibold">Qty:</span>
                        <input
                          type="number"
                          value={product.quantity}
                          onChange={(e) =>
                            editCartItem(product.id, 'quantity', e.target.value)
                          }
                          className="border-2 border-gray-200 p-2 rounded-lg w-16 text-center font-bold outline-none focus:ring-2 focus:ring-[#5a4fcf] focus:border-[#5a4fcf] bg-white"
                          min="1"
                        />
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl">
                        <span className="text-sm text-gray-600 font-semibold">₹</span>
                        <input
                          type="number"
                          value={product.price}
                          onChange={(e) =>
                            editCartItem(product.id, 'price', e.target.value)
                          }
                          className="border-2 border-gray-200 p-2 rounded-lg w-20 text-right font-bold outline-none focus:ring-2 focus:ring-[#5a4fcf] focus:border-[#5a4fcf] bg-white"
                        />
                      </div>
                      <div className="bg-[#5a4fcf]/10 text-[#5a4fcf] px-4 py-2 rounded-xl font-bold">
                        Total: ₹{(product.quantity * product.price).toFixed(2)}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteCartItem(product.id)}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-xl hover:shadow-lg transition-all flex-shrink-0"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer - Payment Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-[#5a4fcf] shadow-2xl p-4">
        <div className="flex flex-col gap-3 max-w-5xl mx-auto">
          {/* Total */}
          <div className="flex justify-between items-center bg-gradient-to-r from-[#5a4fcf]/10 to-[#7b6fd8]/10 p-4 rounded-2xl">
            <span className="text-gray-700 text-lg font-bold">Grand Total</span>
            <span className="text-3xl font-bold text-[#5a4fcf]">
              ₹{totalAmount.toFixed(2)}
            </span>
          </div>

          {/* WhatsApp Input */}
          <input
            type="tel"
            placeholder="WhatsApp number (e.g., 919876543210)"
            className="w-full border-2 border-gray-200 p-3 rounded-2xl focus:ring-2 focus:ring-[#5a4fcf] focus:border-[#5a4fcf] outline-none transition-all font-medium"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
          />

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={sendWhatsApp}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send Bill
            </button>

            <button
              onClick={() => setShowPaymentOptions(!showPaymentOptions)}
              className={`bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 ${
                showPaymentOptions ? 'ring-4 ring-blue-300' : ''
              }`}
            >
              <CreditCard className="w-5 h-5" />
              Payment
            </button>
          </div>

          {/* Payment Options */}
          {showPaymentOptions && (
            <div className="flex gap-2 flex-wrap">
              {['Cash', 'UPI', 'QR Code', 'Card'].map((method) => (
                <button
                  key={method}
                  onClick={() => setSelectedPayment(method)}
                  className={`px-5 py-3 rounded-2xl font-bold transition-all ${
                    selectedPayment === method
                      ? 'bg-gradient-to-r from-[#5a4fcf] to-[#7b6fd8] text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          )}

          {/* QR Code Display */}
          {selectedPayment === 'QR Code' && (
            <div className="p-5 bg-gradient-to-br from-white to-gray-50 border-2 border-[#5a4fcf] rounded-2xl shadow-xl">
              <h3 className="text-gray-900 font-bold mb-4 text-center text-xl">
                Scan to Pay
              </h3>
              <div className="flex justify-center bg-white p-4 rounded-2xl">
                <QRCode value={upiQR} size={200} />
              </div>
              <p className="text-center mt-4 text-gray-600 font-medium">
                Pay using any UPI app to <b className="text-[#5a4fcf]">{merchantUpi}</b>
              </p>
              <p className="text-center mt-2 text-sm text-gray-500">
                Amount: <span className="font-bold text-[#5a4fcf] text-lg">₹{totalAmount.toFixed(2)}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
