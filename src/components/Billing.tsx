// 'use client';

// import React, { useState, useEffect, useRef } from 'react';
// import { useSession } from 'next-auth/react'; // FIX: Added missing import
// import BarcodeScannerComponent from 'react-qr-barcode-scanner';
// import QRCode from 'react-qr-code';
// import { Scan, Trash2, Printer, X, AlertTriangle } from 'lucide-react'; // FIX: Added Printer, X, and AlertTriangle icons

// // --- TYPE DEFINITIONS ---
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

// type PrintableReceiptProps = {
//   cart: CartItem[];
//   totalAmount: number;
//   shopName: string;
// };

// // --- MODAL COMPONENT ---
// type ModalProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   title: string;
//   children: React.ReactNode;
//   onConfirm?: () => void;
//   confirmText?: string;
//   showCancel?: boolean;
// };

// // FIX: Added type for modal state to include message
// type ModalState = {
//     isOpen: boolean;
//     title: string;
//     message: string;
//     onConfirm?: () => void;
//     confirmText?: string;
//     showCancel?: boolean;
// }

// const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, onConfirm, confirmText = "OK", showCancel = false }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center transition-opacity" aria-modal="true" role="dialog">
//       <div className="relative w-full max-w-md transform rounded-xl bg-white p-6 shadow-xl transition-all m-4 border border-gray-200">
//         <div className="flex items-start">
//           <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
//             <AlertTriangle className="h-6 w-6 text-indigo-600" aria-hidden="true" />
//           </div>
//           <div className="ml-4 text-left">
//             <h3 className="text-xl font-semibold text-gray-800" id="modal-title">{title}</h3>
//             <div className="mt-2">
//               <div className="text-gray-600">{children}</div>
//             </div>
//           </div>
//         </div>
//         <div className="mt-6 flex justify-end gap-3">
//           {showCancel && (
//              <button onClick={onClose} type="button" className="rounded-lg bg-gray-200 px-5 py-2 font-semibold text-gray-800 transition-colors hover:bg-gray-300">
//                 Cancel
//              </button>
//           )}
//           <button
//             type="button"
//             onClick={() => {
//               if (onConfirm) onConfirm();
//               onClose();
//             }}
//             className="rounded-lg bg-indigo-600 px-5 py-2 font-semibold text-white transition-colors hover:bg-indigo-700"
//           >
//             {confirmText}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };


// // Printable Receipt Component
// const PrintableReceipt: React.FC<PrintableReceiptProps> = ({ cart, totalAmount, shopName }) => (
//     <div className="hidden print:block p-8 font-mono">
//     <h1 className="text-2xl font-bold text-center mb-2">{shopName}</h1>
//     <p className="text-center text-sm mb-6">Sale Invoice</p>
//     <div className="flex justify-between text-xs mb-4">
//       <span>Date: {new Date().toLocaleDateString()}</span>
//       <span>Time: {new Date().toLocaleTimeString()}</span>
//     </div>
//     <table className="w-full text-sm">
//       <thead>
//         <tr className="border-t border-b border-black">
//           <th className="text-left py-2">ITEM</th>
//           <th className="text-center py-2">QTY</th>
//           <th className="text-right py-2">PRICE</th>
//           <th className="text-right py-2">TOTAL</th>
//         </tr>
//       </thead>
//       <tbody>
//         {[...cart].reverse().map(item => (
//           <tr key={item.id} className="border-b">
//             <td className="py-2">{item.name}</td>
//             <td className="text-center py-2">{item.quantity}</td>
//             <td className="text-right py-2">₹{item.price.toFixed(2)}</td>
//             <td className="text-right py-2">₹{(item.price * item.quantity).toFixed(2)}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//     <div className="mt-6 flex justify-end">
//       <div className="w-2/5">
//         <div className="flex justify-between font-bold text-lg">
//           <span>Grand Total:</span>
//           <span>₹{totalAmount.toFixed(2)}</span>
//         </div>
//       </div>
//     </div>
//     <p className="text-center text-xs mt-10">--- Thank You! ---</p>
//   </div>
// );


// // --- MAIN COMPONENT ---
// export default function BillingPage() {
//   // --- STATE MANAGEMENT ---
//   const { data: session, status } = useSession();
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [productName, setProductName] = useState('');
//   const [productPrice, setProductPrice] = useState<number | ''>('');
//   const [scanning, setScanning] = useState(false);
//   const [selectedPayment, setSelectedPayment] = useState<string>('');
//   const [inventory, setInventory] = useState<InventoryProduct[]>([]);
//   const [suggestions, setSuggestions] = useState<InventoryProduct[]>([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const suggestionsRef = useRef<HTMLDivElement | null>(null);

//   // FIX: Added missing state declarations
//   const [cameraAllowed, setCameraAllowed] = useState(false);
//   const [whatsappNumber, setWhatsappNumber] = useState('');
//   const [modal, setModal] = useState<ModalState>({
//     isOpen: false,
//     title: '',
//     message: '',
//     onConfirm: undefined,
//     confirmText: 'OK',
//     showCancel: false,
//   });


//   const totalAmount = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);

//   // FIX: Removed duplicate state declaration of merchantUpi. Using const is correct here.
//   const merchantUpi = "harish2harish2004@okaxis";
//   const merchantName = "Billzzy Lite";
//   const upiQR = `upi://pay?pa=${merchantUpi}&pn=${encodeURIComponent(merchantName)}&am=${totalAmount.toFixed(2)}&cu=INR&tn=${encodeURIComponent('Bill Payment')}`;

//   // Fetch inventory
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await fetch('/api/products');
//         if (!res.ok) throw new Error('Failed to fetch');
//         const data: InventoryProduct[] = await res.json();
//         setInventory(data);
//       } catch (err) {
//         console.error('Error fetching inventory:', err);
//       }
//     };
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     if (!productName.trim()) {
//       setShowSuggestions(false);
//       return;
//     }
//     const q = productName.trim().toLowerCase();
//     const filtered = inventory.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 8);
//     setSuggestions(filtered);
//     setShowSuggestions(filtered.length > 0);
//   }, [productName, inventory]);

//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
//         setShowSuggestions(false);
//       }
//     };
//     document.addEventListener('mousedown', handler);
//     return () => document.removeEventListener('mousedown', handler);
//   }, []);

//   // --- FUNCTIONS ---
//   const closeModal = () => setModal({ ...modal, isOpen: false });
//   const handlePrint = () => window.print();

//   const handleStartScanner = async () => {
//     if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
//       alert('Camera not supported 😢');
//       return;
//     }
//     try {
//       await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
//       setCameraAllowed(true);
//       setScanning(true);
//     } catch (err) {
//       console.error('Camera error:', err);
//       alert('Unable to access camera. Please allow camera permissions.');
//     }
//   };

//   const addToCart = (name: string, price: number, productId?: number) => {
//     if (!name || price < 0) return;
//     setCart((prev) => {
//       if (productId) {
//         const existing = prev.find((c) => c.productId === productId);
//         if (existing) {
//           return prev.map((c) =>
//             c.productId === productId ? { ...c, quantity: c.quantity + 1 } : c
//           );
//         }
//       }
//       const newItem: CartItem = { id: Date.now(), productId, name, quantity: 1, price };
//       return [newItem, ...prev]; // FIX: Changed prevCart to prev
//     });
//     setProductName('');
//     setProductPrice('');
//     setShowSuggestions(false);
//   };

//   const handleManualAdd = () => {
//     if (!productName.trim() || !productPrice || productPrice <= 0) {
//       setModal({
//           isOpen: true,
//           title: 'Invalid Input',
//           message: 'Please enter a valid product name and a price greater than zero.',
//           showCancel: false,
//           confirmText: 'OK',
//           onConfirm: undefined,
//       });
//       return;
//     }
//     const matchedItem = inventory.find(p => p.name.toLowerCase() === productName.trim().toLowerCase());
//     if (matchedItem) {
//       addToCart(matchedItem.name, matchedItem.sellingPrice, matchedItem.id);
//     } else {
//       addToCart(productName.trim(), Number(productPrice));
//     }
//   };

//   const editCartItem = (id: number, field: 'name' | 'price' | 'quantity', value: string | number) => {
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

//   const deleteCartItem = (id: number) => setCart(cart.filter((c) => c.id !== id));

//   const sendWhatsApp = () => {
//     if (!whatsappNumber) return alert('Enter WhatsApp number');
//     if (!selectedPayment) return alert('Select a payment method');
//     const message = cart.map((p) => `${p.name} x${p.quantity} = ₹${(p.price * p.quantity).toFixed(2)}`).join('\n');
//     const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello! Here is your bill:\n${message}\nTotal: ₹${totalAmount.toFixed(2)}\nPayment Method: ${selectedPayment}`)}`;
//     window.open(url, '_blank');
//   };

//   const handleScannerUpdate = (err: any, result: any) => {
//     if (!result) return;
//     const scannedValue = result.getText?.() ?? String(result);
//     let found = inventory.find((p) => p.id.toString() === scannedValue) ?? inventory.find((p) => p.name.toLowerCase() === scannedValue.toLowerCase()) ?? inventory.find((p) => p.name.toLowerCase().includes(scannedValue.toLowerCase()));
//     if (found) addToCart(found.name, found.sellingPrice, found.id);
//     else addToCart(scannedValue, 0);
//     setScanning(false);
//   };

//   return (
//     <> {/* Use Fragment to wrap multiple root elements */}
//       <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
//         {/* Header */}
//         <div className="p-4 bg-white shadow-md flex justify-between items-center gap-3">
//           <span className="font-bold text-[#5a4fcf] text-lg">Billing</span>
//           <button onClick={() => (scanning ? setScanning(false) : handleStartScanner())} className="flex items-center gap-2 px-4 py-2 bg-[#5a4fcf] text-white rounded-xl font-semibold hover:bg-[#4a3faf]">
//             <Scan className="w-5 h-5" />
//             {scanning ? 'Stop' : 'Scan'}
//           </button>
//         </div>

//         {/* Main Section */}
//         <div className="flex flex-col lg:flex-row flex-1 overflow-hidden gap-4 p-4">
//           {/* Left - Cart Section */}
//           <div className="flex-1 flex flex-col">
//             {/* Add Product */}
//             <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm mb-5">
//               <div className="flex flex-col gap-3">
//                 <div className="relative" ref={suggestionsRef}>
//                   <input
//                     type="text"
//                     placeholder="Search or enter product name"
//                     className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#5a4fcf] focus:border-[#5a4fcf] outline-none transition-all"
//                     value={productName}
//                     onChange={(e) => {
//                       setProductName(e.target.value);
//                       setShowSuggestions(true);
//                     }}
//                   />
//                   {showSuggestions && suggestions.length > 0 && (
//                     <div className="absolute z-50 bg-white border-2 border-gray-200 mt-2 w-full rounded-xl shadow-lg max-h-64 overflow-auto">
//                       {suggestions.map((s) => (
//                         <div key={s.id} onClick={() => addToCart(s.name, s.sellingPrice, s.id)} className="cursor-pointer border-b p-3 last:border-b-0 hover:bg-indigo-50">
//                           <div className="flex justify-between font-semibold"><span>{s.name}</span><span>₹{s.sellingPrice.toFixed(2)}</span></div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//                 <div className="mt-3 flex gap-3">
//                   <input type="number" placeholder="Price" className="w-1/3 rounded-lg border-2 border-gray-200 p-3 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500" value={productPrice} onChange={(e) => setProductPrice(e.target.value === '' ? '' : parseFloat(e.target.value))} />
//                   <button onClick={handleManualAdd} className="w-2/3 rounded-lg bg-green-500 p-3 font-semibold text-white transition-all hover:bg-green-600">Add Manually</button>
//                 </div>
//               </div>
//             </div>

//             {/* Cart Items List */}
//             <div className="flex-1 overflow-y-auto space-y-3 pr-2">
//               {cart.length === 0 ? (
//                 <div className="pt-16 text-center text-gray-500"><p>Your cart is empty.</p><p className="text-sm">Scan an item or add it manually.</p></div>
//               ) : (
//                 cart.map((item) => (
//                   <div key={item.id} className="grid grid-cols-12 items-center gap-2 rounded-lg bg-white p-3 shadow-sm">
//                     <div className="col-span-12 md:col-span-5">
//                       <p className="font-semibold text-gray-800">{item.name}</p>
//                       <p className="text-sm text-gray-500 md:hidden">Total: ₹{(item.quantity * item.price).toFixed(2)}</p>
//                     </div>
//                     <div className="col-span-5 md:col-span-2 flex items-center">
//                        <label htmlFor={`quantity-${item.id}`} className="text-sm font-medium text-gray-500 mr-2">Qty:</label>
//                        <input id={`quantity-${item.id}`} type="number" value={item.quantity} onChange={(e) => editCartItem(item.id, 'quantity', e.target.value)} className="w-full rounded-md border-2 p-1.5 text-center font-semibold outline-none focus:ring-1 focus:ring-indigo-500" min="1" />
//                     </div>
//                      <div className="col-span-5 md:col-span-3 flex items-center">
//                        <label htmlFor={`price-${item.id}`} className="text-sm font-medium text-gray-500 mr-2">Price:</label>
//                        <input id={`price-${item.id}`} type="number" value={item.price} onChange={(e) => editCartItem(item.id, 'price', e.target.value)} className="w-full rounded-md border-2 p-1.5 text-right font-semibold outline-none focus:ring-1 focus:ring-indigo-500" />
//                     </div>
//                     <div className="col-span-2 md:col-span-1 text-right">
//                        <button onClick={() => deleteCartItem(item.id)} className="rounded-full p-2 text-red-500 transition-colors hover:bg-red-100 hover:text-red-700"><Trash2 size={20} /></button>
//                     </div>
//                      <div className="hidden md:block col-span-1 text-right font-semibold text-gray-700">
//                       ₹{(item.quantity * item.price).toFixed(2)}
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>

//           {/* Right - Scanner */}
//           <div className="lg:w-96 flex flex-col gap-4">
//             {scanning && cameraAllowed && (
//               <div className="bg-white p-4 rounded-xl border-2 border-[#5a4fcf] shadow-lg">
//                 <h3 className="font-bold text-[#5a4fcf] mb-3 text-center">Scanner Active</h3>
//                 <div className="overflow-hidden rounded-xl">
//                   <BarcodeScannerComponent width="100%" height={300} onUpdate={handleScannerUpdate} />
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="bg-white border-t-2 border-[#5a4fcf] shadow-2xl p-5">
//           <div className="flex flex-col gap-3 max-w-5xl mx-auto">
//             <div className="flex justify-between items-center text-gray-700">
//               <span className="text-lg font-semibold">Grand Total</span>
//               <span className="text-3xl font-bold text-[#5a4fcf]">₹{totalAmount.toFixed(2)}</span>
//             </div>
//             {/* The Print button was inside a deleted loop. Adding it here is a logical place */}
//             {cart.length > 0 && (
//                 <button
//                     onClick={handlePrint}
//                     className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-500 py-3 font-semibold text-white transition-all hover:bg-slate-600 mt-2"
//                 >
//                     <Printer size={18} />
//                     <span>Print Receipt</span>
//                 </button>
//             )}
//           </div>

//           {scanning && (
//             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
//               <div className="w-full max-w-sm rounded-xl bg-white p-4">
//                 <div className="mb-2 flex items-center justify-between"><h3 className="font-bold text-indigo-600">Scan Barcode/QR</h3><button onClick={() => setScanning(false)} className="rounded-full p-1 hover:bg-gray-200"><X size={24} /></button></div>
//                 <div className="overflow-hidden rounded-lg"><BarcodeScannerComponent width="100%" height="100%" onUpdate={handleScannerUpdate} /></div>
//               </div>
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

//       <PrintableReceipt cart={cart} totalAmount={totalAmount} shopName={merchantName} />

//       <Modal
//         isOpen={modal.isOpen}
//         onClose={closeModal}
//         title={modal.title}
//         onConfirm={modal.onConfirm}
//         confirmText={modal.confirmText}
//         showCancel={modal.showCancel}
//       >
//         <p>{modal.message}</p>
//       </Modal>
//     </>
//   );
// }


'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import QRCode from 'react-qr-code';
import { Scan, Trash2, Send, CreditCard, CheckCircle, X, Printer, DollarSign, MessageSquare, RefreshCw, AlertTriangle } from 'lucide-react';

// --- TYPE DEFINITIONS ---
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

type PrintableReceiptProps = {
  cart: CartItem[];
  totalAmount: number;
  shopName: string;
};

// A specific type for the scanner result to avoid using `any`
type BarcodeScannerResult = {
  getText: () => string;
} | null;

// --- MODAL COMPONENT ---
type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  showCancel?: boolean;
};

// Type for the modal's state object
type ModalState = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText: string;
  showCancel: boolean;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, onConfirm, confirmText = "OK", showCancel = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 transition-opacity" aria-modal="true" role="dialog">
      <div className="relative w-full max-w-md transform rounded-xl bg-white p-6 shadow-xl transition-all m-4 border border-gray-200">
        <div className="flex items-start">
          <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
            <AlertTriangle className="h-6 w-6 text-indigo-600" aria-hidden="true" />
          </div>
          <div className="ml-4 text-left">
            <h3 className="text-xl font-semibold text-gray-800" id="modal-title">{title}</h3>
            <div className="mt-2">
              <div className="text-gray-600">{children}</div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          {showCancel && (
             <button onClick={onClose} type="button" className="rounded-lg bg-gray-200 px-5 py-2 font-semibold text-gray-800 transition-colors hover:bg-gray-300">
                Cancel
             </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (onConfirm) onConfirm();
              onClose(); // Always close modal after action
            }}
            className="rounded-lg bg-indigo-600 px-5 py-2 font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};


// --- PRINTABLE RECEIPT COMPONENT ---
const PrintableReceipt: React.FC<PrintableReceiptProps> = ({ cart, totalAmount, shopName }) => (
    <div className="hidden print:block p-8 font-mono">
    <h1 className="text-2xl font-bold text-center mb-2">{shopName}</h1>
    <p className="text-center text-sm mb-6">Sale Invoice</p>
    <div className="flex justify-between text-xs mb-4">
      <span>Date: {new Date().toLocaleDateString()}</span>
      <span>Time: {new Date().toLocaleTimeString()}</span>
    </div>
    <table className="w-full text-sm">
      <thead>
        <tr className="border-t border-b border-black">
          <th className="text-left py-2">ITEM</th>
          <th className="text-center py-2">QTY</th>
          <th className="text-right py-2">PRICE</th>
          <th className="text-right py-2">TOTAL</th>
        </tr>
      </thead>
      <tbody>
        {[...cart].reverse().map(item => (
          <tr key={item.id} className="border-b">
            <td className="py-2">{item.name}</td>
            <td className="text-center py-2">{item.quantity}</td>
            <td className="text-right py-2">₹{item.price.toFixed(2)}</td>
            <td className="text-right py-2">₹{(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="mt-6 flex justify-end">
      <div className="w-2/5">
        <div className="flex justify-between font-bold text-lg">
          <span>Grand Total:</span>
          <span>₹{totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
    <p className="text-center text-xs mt-10">--- Thank You! ---</p>
  </div>
);


// --- MAIN COMPONENT ---
export default function BillingPage() {
  // --- STATE MANAGEMENT (Strongly Typed) ---
  const { data: session, status } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [productName, setProductName] = useState<string>('');
  const [productPrice, setProductPrice] = useState<number | ''>('');
  const [scanning, setScanning] = useState<boolean>(false);
  const [inventory, setInventory] = useState<InventoryProduct[]>([]);
  const [suggestions, setSuggestions] = useState<InventoryProduct[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // States from old code
  const [showPaymentOptions, setShowPaymentOptions] = useState<boolean>(false);
  const [showFinalizeOptions, setShowFinalizeOptions] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [merchantUpi, setMerchantUpi] = useState<string>('');
  const [showWhatsAppInput, setShowWhatsAppInput] = useState<boolean>(false);
  const [whatsAppNumber, setWhatsAppNumber] = useState<string>('');
  
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: undefined,
    confirmText: 'OK',
    showCancel: false,
  });

  // --- DERIVED STATE & CONSTANTS ---
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const merchantName = session?.user?.name || "Billzzy Lite";
  const upiQR = merchantUpi ? `upi://pay?pa=${merchantUpi}&pn=${encodeURIComponent(merchantName)}&am=${totalAmount.toFixed(2)}&cu=INR&tn=Bill%20Payment` : '';

  // --- DATA FETCHING & SIDE EFFECTS ---
  useEffect(() => {
    // Fetch UPI ID from localStorage
    if (status === 'authenticated' && session?.user?.email) {
      const savedData = localStorage.getItem(`userSettings-${session.user.email}`);
      if (savedData) {
        setMerchantUpi(JSON.parse(savedData).merchantUpiId || '');
      }
    }
  }, [status, session]);

  useEffect(() => {
    // Fetch inventory products
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch');
        const data: InventoryProduct[] = await res.json();
        setInventory(data);
      } catch (err) {
        console.error('Error fetching inventory:', err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    // Handle product name suggestions
    if (!productName.trim()) {
      setShowSuggestions(false);
      return;
    }
    const query = productName.trim().toLowerCase();
    const filtered = inventory.filter((p) => p.name.toLowerCase().includes(query)).slice(0, 5);
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  }, [productName, inventory]);

  useEffect(() => {
    // Close suggestions when clicking outside
    const handler = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  
  // --- CORE FUNCTIONS (Typed) ---
  const closeModal = () => setModal({ ...modal, isOpen: false });

  const handleStartScanner = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setModal({ ...modal, isOpen: true, title: 'Error', message: 'Camera access is not supported by your browser.' });
        return;
    }
    try {
      await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setScanning(true);
    } catch (err) {
      console.error('Camera error:', err);
      setModal({ ...modal, isOpen: true, title: 'Camera Permission', message: 'Unable to access camera. Please grant camera permissions in your browser settings.' });
    }
  };

  const addToCart = (name: string, price: number, productId?: number) => {
    if (!name || price < 0) return;
    setCart((prevCart) => {
      const existingItem = productId ? prevCart.find((item) => item.productId === productId) : null;
      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      const newItem: CartItem = { id: Date.now(), productId, name, quantity: 1, price };
      return [newItem, ...prevCart];
    });
    setProductName('');
    setProductPrice('');
    setShowSuggestions(false);
  };

  const handleManualAdd = () => {
    if (!productName.trim() || !productPrice || productPrice <= 0) {
      setModal({
          isOpen: true,
          title: 'Invalid Input',
          message: 'Please enter a valid product name and a price greater than zero.',
          showCancel: false,
          confirmText: 'OK',
          onConfirm: undefined,
      });
      return;
    }
    const matchedItem = inventory.find(p => p.name.toLowerCase() === productName.trim().toLowerCase());
    if (matchedItem) {
      addToCart(matchedItem.name, matchedItem.sellingPrice, matchedItem.id);
    } else {
      addToCart(productName.trim(), Number(productPrice));
    }
  };

  const editCartItem = (id: number, field: 'quantity' | 'price', value: string) => {
    const numericValue = parseFloat(value);
    setCart(cart.map(item => 
      item.id === id ? { ...item, [field]: Math.max(0, numericValue) || 0 } : item
    ));
  };
  
  const deleteCartItem = (id: number) => setCart(cart.filter((item) => item.id !== id));

  const handleTransactionDone = () => {
    setCart([]);
    setSelectedPayment('');
    setShowPaymentOptions(false);
    setShowFinalizeOptions(false);
  };
  
  const handlePaymentSuccess = () => {
    setModal({
        isOpen: true,
        title: 'Success',
        message: 'Payment marked as successful.',
        onConfirm: () => handleTransactionDone(),
        confirmText: 'Start New Bill',
        showCancel: false,
    });
  };

  const handleStartNewBill = () => {
    if (cart.length === 0) return;
    setModal({
        isOpen: true,
        title: 'Confirm Action',
        message: 'Are you sure you want to clear the current bill and start a new one?',
        showCancel: true,
        confirmText: 'Yes, Start New',
        onConfirm: () => handleTransactionDone()
    });
  };

  const handleWhatsAppShare = () => {
    if (!whatsAppNumber.trim() || !/^\d{10,15}$/.test(whatsAppNumber)) {
        setModal({
            isOpen: true,
            title: 'Invalid Number',
            message: 'Please enter a valid WhatsApp number including the country code (e.g., 919876543210).',
            showCancel: false,
            confirmText: 'Got it',
            onConfirm: undefined
        });
        return;
    }
    const message = [...cart].reverse().map(p => `${p.name} (x${p.quantity}) - ₹${(p.price * p.quantity).toFixed(2)}`).join('\n');
    const fullMessage = `Hello! Here is your bill from ${merchantName}:\n\n${message}\n\n*Grand Total: ₹${totalAmount.toFixed(2)}*`;
    window.open(`https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(fullMessage)}`, '_blank');
    setShowWhatsAppInput(false);
    setWhatsAppNumber('');
  };

  const handlePrint = () => window.print();
  
  const handleScannerUpdate = (error: Error | null, result: BarcodeScannerResult) => {
    if (result?.getText()) {
      setScanning(false);
      const scannedValue = result.getText();
      const foundProduct = inventory.find(p => p.id.toString() === scannedValue || p.name.toLowerCase() === scannedValue.toLowerCase());
      if (foundProduct) {
        addToCart(foundProduct.name, foundProduct.sellingPrice, foundProduct.id);
      } else {
        setProductName(scannedValue); // Pre-fill name for manual price entry
      }
    }
  };
  
  // --- RENDER ---
  return (
    <>
      <div className="flex h-screen w-full flex-col bg-gray-100 font-sans print:hidden">
        
        {/* Header */}
        <header className="flex flex-shrink-0 items-center justify-between p-4 bg-white shadow-md">
          <h1 className="text-2xl font-bold text-gray-800">Billing</h1>
          <button onClick={handleStartScanner} className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700">
            <Scan size={18} />
            <span>Scan Product</span>
          </button>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto">
          {/* Product Input Section */}
          <div className="flex-shrink-0 rounded-xl bg-white p-4 mb-4 shadow-sm">
            <div ref={suggestionsRef} className="relative">
              <input type="text" placeholder="Search or enter product name..." className="w-full rounded-lg border-2 border-gray-200 p-3 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500" value={productName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProductName(e.target.value)} />
              {showSuggestions && (
                <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                  {suggestions.map((s) => (
                    <div key={s.id} onClick={() => addToCart(s.name, s.sellingPrice, s.id)} className="cursor-pointer border-b p-3 last:border-b-0 hover:bg-indigo-50">
                      <div className="flex justify-between font-semibold"><span>{s.name}</span><span>₹{s.sellingPrice.toFixed(2)}</span></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-3 flex gap-3">
              <input type="number" placeholder="Price" className="w-1/3 rounded-lg border-2 border-gray-200 p-3 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500" value={productPrice} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProductPrice(e.target.value === '' ? '' : parseFloat(e.target.value))} />
              <button onClick={handleManualAdd} className="w-2/3 rounded-lg bg-green-500 p-3 font-semibold text-white transition-all hover:bg-green-600">Add Manually</button>
            </div>
          </div>
          
          {/* Cart Items List */}
          <div className="space-y-3 pr-2">
            {cart.length === 0 ? (
              <div className="pt-16 text-center text-gray-500"><p>Your cart is empty.</p><p className="text-sm">Scan an item or add it manually.</p></div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="grid grid-cols-12 items-center gap-2 rounded-lg bg-white p-3 shadow-sm">
                  <div className="col-span-12 md:col-span-5">
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500 md:hidden">Total: ₹{(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                  <div className="col-span-5 md:col-span-2 flex items-center">
                      <label htmlFor={`quantity-${item.id}`} className="text-sm font-medium text-gray-500 mr-2">Qty:</label>
                      <input id={`quantity-${item.id}`} type="number" value={item.quantity} onChange={(e: React.ChangeEvent<HTMLInputElement>) => editCartItem(item.id, 'quantity', e.target.value)} className="w-full rounded-md border-2 p-1.5 text-center font-semibold outline-none focus:ring-1 focus:ring-indigo-500" min="1" />
                  </div>
                    <div className="col-span-5 md:col-span-3 flex items-center">
                      <label htmlFor={`price-${item.id}`} className="text-sm font-medium text-gray-500 mr-2">Price:</label>
                      <input id={`price-${item.id}`} type="number" value={item.price} onChange={(e: React.ChangeEvent<HTMLInputElement>) => editCartItem(item.id, 'price', e.target.value)} className="w-full rounded-md border-2 p-1.5 text-right font-semibold outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div className="col-span-2 md:col-span-1 text-right">
                      <button onClick={() => deleteCartItem(item.id)} className="rounded-full p-2 text-red-500 transition-colors hover:bg-red-100 hover:text-red-700"><Trash2 size={20} /></button>
                  </div>
                    <div className="hidden md:block col-span-1 text-right font-semibold text-gray-700">
                    ₹{(item.quantity * item.price).toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>
        </main>

        {/* Footer / Order Summary Section */}
        <footer className="flex-shrink-0 border-t bg-white p-4 md:p-6 shadow-lg">
          <div className="space-y-4 max-w-4xl mx-auto">
            
            <div className="flex items-center justify-between border-b pb-2">
                <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>
                <button
                    onClick={handleStartNewBill}
                    className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-700 transition-colors disabled:text-gray-300 disabled:cursor-not-allowed"
                    title="Start New Bill"
                    disabled={cart.length === 0}
                >
                    <RefreshCw size={20} />
                </button>
            </div>
            
            <div className="flex items-center justify-between"><span className="text-lg font-medium text-gray-600">Grand Total</span><span className="text-3xl font-bold text-indigo-600">₹{totalAmount.toFixed(2)}</span></div>
            
            <div className="space-y-3 border-t pt-4">
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowFinalizeOptions(!showFinalizeOptions); setShowPaymentOptions(false); }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-700 py-3 px-3 font-semibold text-white transition-all hover:bg-gray-800 disabled:bg-gray-400"
                  disabled={cart.length === 0}
                >
                  <CheckCircle size={18} />
                  <span>Finalize Bill</span>
                </button>
                <button
                  onClick={() => { setShowPaymentOptions(!showPaymentOptions); setShowFinalizeOptions(false); }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-500 py-3 px-3 font-semibold text-white transition-all hover:bg-blue-600 disabled:bg-gray-400"
                  disabled={cart.length === 0}
                >
                  <CreditCard size={18} />
                  <span>Accept Payment</span>
                </button>
              </div>

              {showFinalizeOptions && cart.length > 0 && (
                <div className="space-y-3 rounded-lg bg-gray-50 p-3 pt-2">
                  {showWhatsAppInput ? (
                        <div className="flex gap-2">
                          <input 
                              type="tel" 
                              value={whatsAppNumber}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWhatsAppNumber(e.target.value)}
                              placeholder="WhatsApp Number with country code" 
                              className="flex-grow rounded-lg border-2 border-gray-300 p-2 outline-none focus:border-green-500"
                          />
                          <button onClick={handleWhatsAppShare} className="rounded-lg bg-green-500 p-2 text-white hover:bg-green-600"><Send size={20}/></button>
                        </div>
                  ) : (
                      <button
                          onClick={() => setShowWhatsAppInput(true)}
                          className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 py-2 px-3 font-semibold text-white transition-all hover:bg-green-600"
                          >
                          <MessageSquare size={16} />
                          <span>Share on WhatsApp</span>
                      </button>
                  )}

                  <button
                    onClick={handlePrint}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-500 py-2 px-3 font-semibold text-white transition-all hover:bg-slate-600"
                  >
                    <Printer size={16} />
                    <span>Print Receipt</span>
                  </button>
                </div>
              )}
            </div>
            
            {showPaymentOptions && cart.length > 0 && (
              <div className="space-y-3 border-t pt-4">
                <div className="flex flex-wrap gap-2">
                  {['Cash', 'QR Code', 'Card'].map((method) => (
                    <button key={method} onClick={() => setSelectedPayment(method)} className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${selectedPayment === method ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{method}</button>
                  ))}
                </div>
                
                {selectedPayment === 'Cash' && (
                  <div className="space-y-3 rounded-lg bg-gray-50 p-4 text-center">
                      <h3 className="font-bold text-gray-800">Confirm Cash Payment</h3>
                      <p className="text-sm text-gray-600">Confirm receipt of ₹{totalAmount.toFixed(2)} cash.</p>
                      <button onClick={handlePaymentSuccess} className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 p-3 font-bold text-white hover:bg-blue-700"><DollarSign size={20} /><span>Cash Received</span></button>
                  </div>
                )}

                {selectedPayment === 'QR Code' && (
                  <div className="space-y-3 rounded-lg bg-gray-50 p-4 text-center">
                    {upiQR ? (
                      <>
                        <h3 className="font-bold text-gray-800">Scan to Pay</h3>
                        <div style={{ height: "auto", margin: "0 auto", maxWidth: 200, width: "100%" }}>
                          <QRCode size={256} style={{ height: "auto", maxWidth: "100%", width: "100%" }} value={upiQR} viewBox={`0 0 256 256`} />
                        </div>
                        <p className="text-sm text-gray-600">Pay to <b>{merchantUpi}</b></p>
                        <button onClick={handlePaymentSuccess} className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 p-3 font-bold text-white hover:bg-green-700"><CheckCircle size={20} /><span>Payment Confirmed</span></button>
                      </>
                    ) : (
                      <p className="p-2 font-semibold text-red-600">UPI ID not configured in Settings.</p>
                    )}
                  </div>
                )}

                {selectedPayment === 'Card' && (
                  <div className="space-y-3 rounded-lg bg-gray-50 p-4 text-center">
                      <h3 className="font-bold text-gray-800">Confirm Card Payment</h3>
                      <p className="text-sm text-gray-600">Confirm transaction was successful on the card machine.</p>
                      <button onClick={handlePaymentSuccess} className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 p-3 font-bold text-white hover:bg-purple-700"><CreditCard size={20} /><span>Payment Successful</span></button>
                  </div>
                )}
              </div>
            )}
          </div>
        </footer>
      </div>
      
      {/* Scanner Modal */}
      {scanning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="w-full max-w-sm rounded-xl bg-white p-4">
            <div className="mb-2 flex items-center justify-between"><h3 className="font-bold text-indigo-600">Scan Barcode/QR</h3><button onClick={() => setScanning(false)} className="rounded-full p-1 hover:bg-gray-200"><X size={24} /></button></div>
            <div className="overflow-hidden rounded-lg">
                <BarcodeScannerComponent 
                    width="100%" 
                    height="100%" 
                    onUpdate={(err, result) => handleScannerUpdate(err as Error | null, result as BarcodeScannerResult)} 
                />
            </div>
          </div>
        </div>
      )}
      
      <PrintableReceipt cart={cart} totalAmount={totalAmount} shopName={merchantName} />

      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        onConfirm={modal.onConfirm}
        confirmText={modal.confirmText}
        showCancel={modal.showCancel}
      >
        <p>{modal.message}</p>
      </Modal>
    </>
  );
}