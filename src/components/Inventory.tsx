// 'use client';

// import React, { useState, useEffect, FC, ChangeEvent, useRef } from "react";
// import * as XLSX from "xlsx";
// import { Upload, Edit2, Plus, X, Trash2, Search, Image as ImageIcon, Camera } from "lucide-react";
// import { motion, useAnimationControls, PanInfo } from "framer-motion";
// import { Html5Qrcode, Html5QrcodeCameraScanConfig } from "html5-qrcode";

// // --- INTERFACES AND UTILITIES ---
// export interface Product {
//   id: string;
//   name: string;
//   quantity: number;
//   buyingPrice: number;
//   sellingPrice: number;
//   gstRate: number;
//   image?: string;
//   sku?: string;
// }

// const formatCurrency = (amount: number): string => {
//   return new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//   }).format(amount);
// };

// // --- MobileProductCard Component ---
// interface MobileProductCardProps {
//   product: Product;
//   isSwiped: boolean;
//   onSwipe: (id: string | null) => void;
//   onEdit: (product: Product) => void;
//   onDelete: (id: string) => void;
// }

// const MobileProductCard: FC<MobileProductCardProps> = ({ product, isSwiped, onSwipe, onEdit, onDelete }) => {
//   const controls = useAnimationControls();
//   const ACTION_WIDTH = 160;

//   useEffect(() => {
//     if (!isSwiped) {
//       controls.start({ x: 0 });
//     }
//   }, [isSwiped, controls]);

//   const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
//     if (info.offset.x < -ACTION_WIDTH / 2) {
//       controls.start({ x: -ACTION_WIDTH });
//       onSwipe(product.id);
//     } else {
//       controls.start({ x: 0 });
//     }
//   };

//   const calculateTotal = (quantity: number, sellingPrice: number, gstRate: number): number => {
//     return quantity * sellingPrice * (1 + gstRate / 100);
//   };

//   const hasValidImage = !!product.image && product.image.startsWith('/');

//   return (
//     <div className="relative w-full bg-gray-200 rounded-lg overflow-hidden shadow-sm">
//       <div className="absolute inset-y-0 right-0 flex" style={{ width: ACTION_WIDTH }}>
//         <button onClick={() => onEdit(product)} className="w-1/2 h-full flex flex-col items-center justify-center bg-indigo-500 text-white transition-colors hover:bg-indigo-600">
//           <Edit2 className="w-5 h-5" /><span className="text-xs mt-1">Edit</span>
//         </button>
//         <button onClick={() => onDelete(product.id)} className="w-1/2 h-full flex flex-col items-center justify-center bg-red-500 text-white transition-colors hover:bg-red-600">
//           <Trash2 className="w-5 h-5" /><span className="text-xs mt-1">Delete</span>
//         </button>
//       </div>
//       <motion.div
//         className="relative bg-white p-3 flex items-center gap-3 w-full cursor-grab"
//         drag="x" dragConstraints={{ right: 0, left: -ACTION_WIDTH }} onDragEnd={handleDragEnd}
//         animate={controls} transition={{ type: "spring", stiffness: 300, damping: 30 }}
//         onClick={() => { if (isSwiped) { controls.start({ x: 0 }); onSwipe(null); } }}
//       >
//         {hasValidImage ? (
//            <img
//              src={product.image}
//              alt={product.name}
//              className="w-16 h-16 object-cover rounded-md bg-gray-100 flex-shrink-0"
//            />
//          ) : (
//            <button
//              onClick={() => onEdit(product)}
//              className="w-16 h-16 flex-shrink-0 flex flex-col items-center justify-center bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
//            >
//              <Upload className="w-5 h-5 text-gray-500" />
//              <span className="text-xs mt-1 text-gray-600">Upload</span>
//            </button>
//          )}
//         <div className="flex-1 overflow-hidden">
//           <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
//           <p className="text-sm text-gray-500 truncate">Product ID: {product.sku || 'N/A'}</p>
//           <p className="text-sm text-gray-700 font-medium mt-1">Revenue: {formatCurrency(calculateTotal(product.quantity, product.sellingPrice, product.gstRate))}</p>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// // --- MAIN INVENTORY COMPONENT ---
// const Inventory: FC = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [showEditModal, setShowEditModal] = useState<boolean>(false);
//   const [showAddModal, setShowAddModal] = useState<boolean>(false);
//   const [swipedProductId, setSwipedProductId] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState<string>("");

//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [isScannerOpen, setIsScannerOpen] = useState(false);
//   const scannerRef = useRef<Html5Qrcode | null>(null);
//   const readerId = "qr-reader"; // Element ID where html5-qrcode will render

//   type NewProduct = Omit<Product, 'id'> & { sku?: string };
//   const [newProduct, setNewProduct] = useState<NewProduct>({ name: "", sku: "", quantity: 0, buyingPrice: 0, sellingPrice: 0, gstRate: 0, image: '' });

//   // Fetch products
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch('/api/products');
//         if (!response.ok) throw new Error('Failed to fetch products');
//         const data: Product[] = await response.json();
//         setProducts(data);
//       } catch (error) { console.error("Error fetching products:", error); }
//     };
//     fetchProducts();
//   }, []);

//   // Robust scanner startup & cleanup
//   useEffect(() => {
//     let mounted = true;
//     if (!isScannerOpen) return;

//     const startScanner = async () => {
//       try {
//         // create scanner instance (renders into element with id readerId)
//         const scanner = new Html5Qrcode(readerId, /* verbose= */ false);
//         scannerRef.current = scanner;

//         // config: lower fps and a square qrbox for mobile
//         const config: Html5QrcodeCameraScanConfig = { fps: 10, qrbox: { width: 250, height: 250 } };

//         // helper to choose back camera if available
//         const chooseCameraId = async (): Promise<string | { facingMode: "environment" } > => {
//           try {
//             const cameras = await Html5Qrcode.getCameras();
//             if (Array.isArray(cameras) && cameras.length > 0) {
//               // prefer camera whose label suggests back camera (common on many devices)
//               const backCam = cameras.find(cam => /back|rear|environment/i.test(cam.label));
//               return (backCam?.id) ?? cameras[cameras.length - 1].id; // fallback to last camera
//             }
//             // fallback to facingMode approach if no camera list
//             return { facingMode: "environment" };
//           } catch (err) {
//             // If getCameras fails (permissions or not supported), fallback
//             return { facingMode: "environment" };
//           }
//         };

//         const cameraOrFacing = await chooseCameraId();

//         const onScanSuccess = (decodedText: string) => {
//           // Put scanned text into SKU field depending on modal mode
//           if (!mounted) return;
//           if (showEditModal && editingProduct) {
//             setEditingProduct(prev => prev ? { ...prev, sku: decodedText } : null);
//           } else {
//             setNewProduct(prev => ({ ...prev, sku: decodedText }));
//           }
//           // close scanner after a successful read
//           setIsScannerOpen(false);
//         };

//         const onScanFailure = (_error: any) => {
//           // ignore frequent not-found errors, optionally log if needed
//         };

//         // Try to start scanner
//         try {
//           // If cameraOrFacing is an id string, start with that deviceId
//           if (typeof cameraOrFacing === "string") {
//             await scanner.start(cameraOrFacing, config, onScanSuccess, onScanFailure);
//           } else {
//             // start using facingMode constraint
//             await scanner.start(cameraOrFacing, config, onScanSuccess, onScanFailure);
//           }
//         } catch (startErr) {
//           // second-chance: try starting with facingMode explicitly (some devices prefer this)
//           try {
//             await scanner.start({ facingMode: "environment" }, config, onScanSuccess, onScanFailure);
//           } catch (err) {
//             console.error("Failed to start scanner (both attempts):", startErr, err);
//             alert("Unable to start camera scanner. Please make sure camera permissions are allowed and you're on HTTPS (Ngrok).");
//             setIsScannerOpen(false);
//           }
//         }
//       } catch (err) {
//         console.error("Scanner init error:", err);
//         alert("Scanner initialization failed.");
//         setIsScannerOpen(false);
//       }
//     };

//     startScanner();

//     // cleanup on unmount or when scanner is closed
//     return () => {
//       mounted = false;
//       const scanner = scannerRef.current;
//       if (scanner) {
//         scanner.stop().catch((err) => {
//           // stopping may fail if already stopped; ignore
//         }).finally(() => {
//           try {
//             scanner.clear(); // remove DOM elements and free resources
//           } catch (e) {
//             // ignore clear errors
//           }
//           scannerRef.current = null;
//         });
//       }
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isScannerOpen, showEditModal, editingProduct]); // re-run when scanner toggles or modal mode changes

//   const filteredProducts = products.filter(product =>
//     product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase()))
//   );

//   const handleExcelUpload = (e: ChangeEvent<HTMLInputElement>): void => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = async (event: ProgressEvent<FileReader>) => {
//       if (!event.target?.result) return;
//       const data = new Uint8Array(event.target.result as ArrayBuffer);
//       const workbook = XLSX.read(data, { type: "array" });
//       const sheetName = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[sheetName];
//       const rows: any[] = XLSX.utils.sheet_to_json(sheet);

//       const uploadedProducts = rows.map((row) => ({
//         sku: String(row["Product ID"] || ""),
//         name: String(row["Product Name"] || ""),
//         quantity: Number(row["Quantity"]) || 0,
//         buyingPrice: Number(row["Buying Price"]) || 0,
//         sellingPrice: Number(row["Selling Price"]) || 0,
//         gstRate: Number(row["GST Rate"]) || 0,
//       }));

//       try {
//         const response = await fetch('/api/products', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(uploadedProducts),
//         });
//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.message || 'Failed to upload products');
//         }
//         const allProducts: Product[] = await response.json();
//         setProducts(allProducts);
//         alert('Products uploaded successfully!');
//       } catch (error) {
//         console.error("Error uploading products:", error);
//         alert(`An error occurred during the upload: ${(error as Error).message}`);
//       }
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImageFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const resetImageState = () => {
//     setImageFile(null);
//     setImagePreview(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const openEditModal = (product: Product): void => {
//     setEditingProduct(product);
//     setImagePreview(product.image || null);
//     setShowEditModal(true);
//     setSwipedProductId(null);
//   };

//   const openAddModal = (): void => {
//     setNewProduct({ name: "", sku: "", quantity: 0, buyingPrice: 0, sellingPrice: 0, gstRate: 0, image: '' });
//     resetImageState();
//     setShowAddModal(true);
//   };

//   const handleSaveEdit = async (): Promise<void> => {
//     if (!editingProduct) return;
//     let imageUrl = editingProduct.image;

//     if (imageFile) {
//       const formData = new FormData();
//       formData.append('file', imageFile);

//       try {
//         const uploadResponse = await fetch('/api/upload', {
//           method: 'POST',
//           body: formData,
//         });
//         const uploadData = await uploadResponse.json();
//         if (uploadData.success) {
//           imageUrl = uploadData.path;
//         } else {
//           throw new Error('Image upload failed');
//         }
//       } catch (error) {
//         console.error("Error uploading image:", error);
//         alert('Failed to upload image. Please try again.');
//         return;
//       }
//     }

//     const updatedProduct = { ...editingProduct, image: imageUrl };

//     try {
//       await fetch(`/api/products/${editingProduct.id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(updatedProduct),
//       });
//       setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
//       closeModal();
//     } catch (error) {
//       console.error("Error updating product:", error);
//     }
//   };

//   const handleSaveNewProduct = async (): Promise<void> => {
//     let imageUrl = '';
//     if (imageFile) {
//       const formData = new FormData();
//       formData.append('file', imageFile);

//       try {
//         const uploadResponse = await fetch('/api/upload', {
//           method: 'POST',
//           body: formData,
//         });
//         const uploadData = await uploadResponse.json();
//         if (uploadData.success) {
//           imageUrl = uploadData.path;
//         } else {
//           throw new Error('Image upload failed');
//         }
//       } catch (error) {
//         console.error("Error uploading image:", error);
//         alert('Failed to upload image. Please try again.');
//         return;
//       }
//     }

//     const productToSave = { ...newProduct, image: imageUrl };

//     try {
//       const response = await fetch('/api/products', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(productToSave),
//       });
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to create product');
//       }
//       const allProducts: Product[] = await response.json();
//       setProducts(allProducts);
//       closeModal();
//     } catch (error) {
//       console.error("Error creating product:", error);
//       alert(`Failed to create product: ${(error as Error).message}`);
//     }
//   };

//   const handleDeleteProduct = async (id: string): Promise<void> => {
//     if (window.confirm('Are you sure you want to delete this product?')) {
//       try {
//         await fetch(`/api/products/${id}`, { method: 'DELETE' });
//         setProducts(products.filter((p) => p.id !== id));
//       } catch (error) {
//         console.error("Error deleting product:", error);
//       }
//     }
//     setSwipedProductId(null);
//   };

//   const handleScanBarcode = () => {
//     setIsScannerOpen(true);
//   };

//   const closeModal = () => {
//     setShowAddModal(false);
//     setShowEditModal(false);
//     setIsScannerOpen(false); // Make sure to close scanner when modal closes
//     resetImageState();
//   };

//   return (
//     <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
//       <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Inventory</h1>
//           <p className="hidden md:block text-sm text-gray-600">Search, upload, or manage products manually.</p>
//         </div>
//         <div className="relative w-full md:w-auto order-first md:order-none">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//           <input type="text" placeholder="Search by name or Product ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
//         </div>
//         <div className="hidden sm:flex items-center gap-3">
//           <label className="flex items-center cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm">
//             <Upload className="w-4 h-4 mr-2" /> Upload Excel
//             <input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} className="hidden" />
//           </label>
//           <button onClick={openAddModal} className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm">
//             <Plus className="w-4 h-4" /> Add Product
//           </button>
//         </div>
//       </div>

//       <div className="hidden md:block overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
//         <table className="min-w-full divide-y divide-gray-300">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Image</th>
//               <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Product Name</th>
//               <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Product ID</th>
//               <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Quantity</th>
//               <th className="px-3 py-3 text-left text-sm font-semibold text-gray-900">Selling Price</th>
//               <th className="px-3 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {filteredProducts.map((p) => {
//                const hasValidImage = p.image && p.image.startsWith('/');
//                return (
//                 <tr key={p.id}>
//                   <td className="px-3 py-2">
//                   {hasValidImage ? (
//                       <img
//                         src={p.image}
//                         alt={p.name}
//                         className="w-14 h-14 object-cover rounded-md"
//                       />
//                     ) : (
//                       <button
//                         onClick={() => openEditModal(p)}
//                         className="w-14 h-14 flex flex-col items-center justify-center bg-gray-50 rounded-md hover:bg-gray-100 transition-colors border"
//                       >
//                         <Upload className="w-5 h-5 text-gray-400" />
//                       </button>
//                     )}
//                   </td>
//                   <td className="px-3 py-2 text-sm font-medium text-gray-900">{p.name}</td>
//                   <td className="px-3 py-2 text-sm text-gray-500 truncate max-w-xs">{p.sku || 'N/A'}</td>
//                   <td className="px-3 py-2 text-sm text-gray-500">{p.quantity}</td>
//                   <td className="px-3 py-2 text-sm text-gray-500">{formatCurrency(p.sellingPrice)}</td>
//                   <td className="px-3 py-2 text-right">
//                     <div className="flex justify-end gap-4">
//                       <button onClick={() => openEditModal(p)} className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"><Edit2 className="w-4 h-4" /> Edit</button>
//                       <button onClick={() => handleDeleteProduct(p.id)} className="text-red-600 hover:text-red-900 flex items-center gap-1"><Trash2 className="w-4 h-4" /> Delete</button>
//                     </div>
//                   </td>
//                 </tr>
//                )
//             })}
//           </tbody>
//         </table>
//       </div>

//       <div className="md:hidden space-y-3 pb-20">
//         {filteredProducts.map((p) => (
//           <MobileProductCard key={p.id} product={p} isSwiped={swipedProductId === p.id} onSwipe={setSwipedProductId} onEdit={openEditModal} onDelete={handleDeleteProduct} />
//         ))}
//       </div>

//       <div className="sm:hidden fixed bottom-4 right-4 flex flex-col items-center gap-3 z-20">
//         <label className="w-14 h-14 flex items-center justify-center cursor-pointer bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg">
//           <Upload className="w-6 h-6" /><input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} className="hidden" />
//         </label>
//         <button onClick={openAddModal} className="w-14 h-14 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg">
//           <Plus className="w-6 h-6" />
//         </button>
//       </div>

//       {(showAddModal || (showEditModal && editingProduct)) && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ type: "spring", duration: 0.3 }}
//             className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
//           >
//             <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 flex justify-between items-center">
//               <div>
//                 <h2 className="text-xl font-bold text-white">{showEditModal ? 'Edit Product' : 'Add New Product'}</h2>
//                 <p className="text-indigo-100 text-sm mt-0.5">{showEditModal ? 'Update product information' : 'Fill in the details below'}</p>
//               </div>
//               <button onClick={closeModal} className="text-white hover:bg-white/20 rounded-full p-2 transition-colors">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
//              {isScannerOpen ? (
//                 <div className="space-y-4">
//                   {/* This div is where the scanner will be rendered */}
//                   <div id={readerId} className="w-full rounded-xl overflow-hidden border-2 border-gray-200" />
//                   <button 
//                     onClick={() => setIsScannerOpen(false)} 
//                     className="w-full px-4 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-medium transition-colors"
//                    >
//                      Cancel Scan
//                    </button>
//                 </div>
//               ) : (
//               <>
//                 <div className="space-y-2">
//                     <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                       <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
//                       Product Image
//                     </label>
//                     <div
//                         className="w-full h-40 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors"
//                         onClick={() => fileInputRef.current?.click()}
//                     >
//                         <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
//                         {imagePreview ? (
//                             <img src={imagePreview} alt="Product Preview" className="w-full h-full object-contain p-2" />
//                         ) : (
//                             <div className="text-center text-gray-500">
//                                 <ImageIcon className="w-10 h-10 mx-auto mb-2" />
//                                 <p>Click to upload an image</p>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                       <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
//                       Product Name
//                     </label>
//                     <input
//                       type="text"
//                       placeholder="Enter product name"
//                       className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
//                       value={showEditModal ? editingProduct?.name : newProduct.name}
//                       onChange={(e) => showEditModal ? setEditingProduct({ ...editingProduct!, name: e.target.value }) : setNewProduct({ ...newProduct, name: e.target.value })}
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                       <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
//                       Product ID
//                     </label>
//                     <div className="relative">
//                         <input
//                           type="text"
//                           placeholder="SKU, Barcode, or custom ID"
//                           className="w-full border-2 border-gray-200 px-4 py-3 pr-14 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none font-mono text-sm"
//                           value={showEditModal ? (editingProduct?.sku || '') : (newProduct.sku || '')}
//                           onChange={(e) => {
//                             if (showEditModal) {
//                               setEditingProduct({ ...editingProduct!, sku: e.target.value });
//                             } else {
//                               setNewProduct({ ...newProduct, sku: e.target.value });
//                             }
//                           }}
//                         />
//                         <button 
//                             type="button" 
//                             onClick={handleScanBarcode} 
//                             className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-500/20 transition-all active:scale-95"
//                             aria-label="Scan barcode"
//                         >
//                             <Camera className="w-5 h-5" />
//                         </button>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                         <span className="w-2 h-2 bg-green-500 rounded-full"></span>
//                         Quantity
//                       </label>
//                       <input
//                         type="number"
//                         placeholder="0"
//                         className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
//                         value={showEditModal ? (editingProduct?.quantity ?? '') : (newProduct.quantity ?? '')}
//                         onChange={(e) => showEditModal ? setEditingProduct({ ...editingProduct!, quantity: Number(e.target.value) || 0 }) : setNewProduct({ ...newProduct, quantity: Number(e.target.value) || 0 })}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                         <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
//                         Selling Price
//                       </label>
//                       <div className="relative">
//                         <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
//                         <input
//                           type="number"
//                           placeholder="0.00"
//                           className="w-full border-2 border-gray-200 pl-8 pr-4 py-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
//                           value={showEditModal ? (editingProduct?.sellingPrice ?? '') : (newProduct.sellingPrice ?? '')}
//                           onChange={(e) => showEditModal ? setEditingProduct({ ...editingProduct!, sellingPrice: Number(e.target.value) || 0 }) : setNewProduct({ ...newProduct, sellingPrice: Number(e.target.value) || 0 })}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                       <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
//                       GST Rate
//                     </label>
//                     <div className="relative">
//                       <input
//                         type="number"
//                         placeholder="0"
//                         className="w-full border-2 border-gray-200 px-4 py-3 pr-12 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none"
//                         value={showEditModal ? (editingProduct?.gstRate ?? '') : (newProduct.gstRate ?? '')}
//                         onChange={(e) => showEditModal ? setEditingProduct({ ...editingProduct!, gstRate: Number(e.target.value) || 0 }) : setNewProduct({ ...newProduct, gstRate: Number(e.target.value) || 0 })}
//                       />
//                       <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">%</span>
//                     </div>
//                   </div>
//               </>
//               )}
//             </div>

//             <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
//               <button onClick={closeModal} className="px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors">
//                 Cancel
//               </button>
//               <button
//                 onClick={showEditModal ? handleSaveEdit : handleSaveNewProduct}
//                 className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-medium shadow-lg shadow-indigo-500/30 transition-all"
//               >
//                 {showEditModal ? 'Save Changes' : 'Add Product'}
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Inventory;



'use client';

import React, { useState, useEffect, FC, ChangeEvent, useRef } from "react";
import * as XLSX from "xlsx";
import { Upload, Edit2, Plus, X, Trash2, Search, Image as ImageIcon, Camera, Package } from "lucide-react";
import { motion, useAnimationControls, PanInfo } from "framer-motion";
import { Html5Qrcode, Html5QrcodeCameraScanConfig } from "html5-qrcode";

// --- INTERFACES AND UTILITIES ---
export interface Product {
  id: string;
  name: string;
  quantity: number;
  buyingPrice: number;
  sellingPrice: number;
  gstRate: number;
  image?: string;
  sku?: string;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

// --- MobileProductCard Component ---
interface MobileProductCardProps {
  product: Product;
  isSwiped: boolean;
  onSwipe: (id: string | null) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const MobileProductCard: FC<MobileProductCardProps> = ({ product, isSwiped, onSwipe, onEdit, onDelete }) => {
  const controls = useAnimationControls();
  const ACTION_WIDTH = 160;

  useEffect(() => {
    if (!isSwiped) {
      controls.start({ x: 0 });
    }
  }, [isSwiped, controls]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
    if (info.offset.x < -ACTION_WIDTH / 2) {
      controls.start({ x: -ACTION_WIDTH });
      onSwipe(product.id);
    } else {
      controls.start({ x: 0 });
    }
  };

  const calculateTotal = (quantity: number, sellingPrice: number, gstRate: number): number => {
    return quantity * sellingPrice * (1 + gstRate / 100);
  };

  const hasValidImage = !!product.image && product.image.startsWith('/');

  return (
    <div className="relative w-full bg-gray-100 rounded-2xl overflow-hidden shadow-md">
      <div className="absolute inset-y-0 right-0 flex" style={{ width: ACTION_WIDTH }}>
        <button onClick={() => onEdit(product)} className="w-1/2 h-full flex flex-col items-center justify-center bg-[#5a4fcf] text-white transition-colors hover:bg-[#4a3fbf]">
          <Edit2 className="w-5 h-5" /><span className="text-xs mt-1 font-medium">Edit</span>
        </button>
        <button onClick={() => onDelete(product.id)} className="w-1/2 h-full flex flex-col items-center justify-center bg-red-500 text-white transition-colors hover:bg-red-600">
          <Trash2 className="w-5 h-5" /><span className="text-xs mt-1 font-medium">Delete</span>
        </button>
      </div>
      <motion.div
        className="relative bg-white p-4 flex items-center gap-4 w-full cursor-grab rounded-2xl"
        drag="x" dragConstraints={{ right: 0, left: -ACTION_WIDTH }} onDragEnd={handleDragEnd}
        animate={controls} transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={() => { if (isSwiped) { controls.start({ x: 0 }); onSwipe(null); } }}
      >
        {hasValidImage ? (
           <img
             src={product.image}
             alt={product.name}
             className="w-20 h-20 object-cover rounded-xl bg-gray-50 flex-shrink-0 border-2 border-gray-100"
           />
         ) : (
           <button
             onClick={() => onEdit(product)}
             className="w-20 h-20 flex-shrink-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all border-2 border-dashed border-gray-300"
           >
             <Upload className="w-6 h-6 text-gray-400" />
             <span className="text-xs mt-1 text-gray-500 font-medium">Add</span>
           </button>
         )}
        <div className="flex-1 overflow-hidden">
          <h3 className="font-bold text-gray-900 truncate text-lg">{product.name}</h3>
          <p className="text-sm text-gray-500 truncate font-medium">ID: {product.sku || 'N/A'}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs bg-[#5a4fcf]/10 text-[#5a4fcf] px-2 py-1 rounded-lg font-semibold">Qty: {product.quantity}</span>
            <span className="text-sm text-gray-900 font-bold">{formatCurrency(calculateTotal(product.quantity, product.sellingPrice, product.gstRate))}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- MAIN INVENTORY COMPONENT ---
const Inventory: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [swipedProductId, setSwipedProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const readerId = "qr-reader";

  type NewProduct = Omit<Product, 'id'> & { sku?: string };
  const [newProduct, setNewProduct] = useState<NewProduct>({ name: "", sku: "", quantity: 0, buyingPrice: 0, sellingPrice: 0, gstRate: 0, image: '' });

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (error) { console.error("Error fetching products:", error); }
    };
    fetchProducts();
  }, []);

  // Scanner logic
  useEffect(() => {
    let mounted = true;
    if (!isScannerOpen) return;

    const startScanner = async () => {
      try {
        const scanner = new Html5Qrcode(readerId, false);
        scannerRef.current = scanner;

        const config: Html5QrcodeCameraScanConfig = { fps: 10, qrbox: { width: 250, height: 250 } };

        const chooseCameraId = async (): Promise<string | { facingMode: "environment" } > => {
          try {
            const cameras = await Html5Qrcode.getCameras();
            if (Array.isArray(cameras) && cameras.length > 0) {
              const backCam = cameras.find(cam => /back|rear|environment/i.test(cam.label));
              return (backCam?.id) ?? cameras[cameras.length - 1].id;
            }
            return { facingMode: "environment" };
          } catch (err) {
            return { facingMode: "environment" };
          }
        };

        const cameraOrFacing = await chooseCameraId();

        const onScanSuccess = (decodedText: string) => {
          if (!mounted) return;
          if (showEditModal && editingProduct) {
            setEditingProduct(prev => prev ? { ...prev, sku: decodedText } : null);
          } else {
            setNewProduct(prev => ({ ...prev, sku: decodedText }));
          }
          setIsScannerOpen(false);
        };

        const onScanFailure = (_error: any) => {};

        try {
          if (typeof cameraOrFacing === "string") {
            await scanner.start(cameraOrFacing, config, onScanSuccess, onScanFailure);
          } else {
            await scanner.start(cameraOrFacing, config, onScanSuccess, onScanFailure);
          }
        } catch (startErr) {
          try {
            await scanner.start({ facingMode: "environment" }, config, onScanSuccess, onScanFailure);
          } catch (err) {
            console.error("Failed to start scanner:", startErr, err);
            alert("Unable to start camera scanner. Please check permissions.");
            setIsScannerOpen(false);
          }
        }
      } catch (err) {
        console.error("Scanner init error:", err);
        alert("Scanner initialization failed.");
        setIsScannerOpen(false);
      }
    };

    startScanner();

    return () => {
      mounted = false;
      const scanner = scannerRef.current;
      if (scanner) {
        scanner.stop().catch(() => {}).finally(() => {
          try {
            scanner.clear();
          } catch (e) {}
          scannerRef.current = null;
        });
      }
    };
  }, [isScannerOpen, showEditModal, editingProduct]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleExcelUpload = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event: ProgressEvent<FileReader>) => {
      if (!event.target?.result) return;
      const data = new Uint8Array(event.target.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows: any[] = XLSX.utils.sheet_to_json(sheet);

      const uploadedProducts = rows.map((row) => ({
        sku: String(row["Product ID"] || ""),
        name: String(row["Product Name"] || ""),
        quantity: Number(row["Quantity"]) || 0,
        buyingPrice: Number(row["Buying Price"]) || 0,
        sellingPrice: Number(row["Selling Price"]) || 0,
        gstRate: Number(row["GST Rate"]) || 0,
      }));

      try {
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(uploadedProducts),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to upload products');
        }
        const allProducts: Product[] = await response.json();
        setProducts(allProducts);
        alert('Products uploaded successfully!');
      } catch (error) {
        console.error("Error uploading products:", error);
        alert(`An error occurred during the upload: ${(error as Error).message}`);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetImageState = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openEditModal = (product: Product): void => {
    setEditingProduct(product);
    setImagePreview(product.image || null);
    setShowEditModal(true);
    setSwipedProductId(null);
  };

  const openAddModal = (): void => {
    setNewProduct({ name: "", sku: "", quantity: 0, buyingPrice: 0, sellingPrice: 0, gstRate: 0, image: '' });
    resetImageState();
    setShowAddModal(true);
  };

  const handleSaveEdit = async (): Promise<void> => {
    if (!editingProduct) return;
    let imageUrl = editingProduct.image;

    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);

      try {
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadResponse.json();
        if (uploadData.success) {
          imageUrl = uploadData.path;
        } else {
          throw new Error('Image upload failed');
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert('Failed to upload image. Please try again.');
        return;
      }
    }

    const updatedProduct = { ...editingProduct, image: imageUrl };

    try {
      await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });
      setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
      closeModal();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleSaveNewProduct = async (): Promise<void> => {
    let imageUrl = '';
    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);

      try {
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadResponse.json();
        if (uploadData.success) {
          imageUrl = uploadData.path;
        } else {
          throw new Error('Image upload failed');
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert('Failed to upload image. Please try again.');
        return;
      }
    }

    const productToSave = { ...newProduct, image: imageUrl };

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productToSave),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create product');
      }
      const allProducts: Product[] = await response.json();
      setProducts(allProducts);
      closeModal();
    } catch (error) {
      console.error("Error creating product:", error);
      alert(`Failed to create product: ${(error as Error).message}`);
    }
  };

  const handleDeleteProduct = async (id: string): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await fetch(`/api/products/${id}`, { method: 'DELETE' });
        setProducts(products.filter((p) => p.id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
    setSwipedProductId(null);
  };

  const handleScanBarcode = () => {
    setIsScannerOpen(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setIsScannerOpen(false);
    resetImageState();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#5a4fcf] to-[#7b6fd8] text-white px-4 py-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Package className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Inventory</h1>
            <p className="text-sm text-white/80">Manage your products</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-md"
          />
        </div>
      </div>

      {/* Products List */}
      <div className="px-4 py-6 space-y-4 pb-24">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">No products found</p>
            <p className="text-sm text-gray-400 mt-1">Add your first product to get started</p>
          </div>
        ) : (
          filteredProducts.map((p) => (
            <MobileProductCard 
              key={p.id} 
              product={p} 
              isSwiped={swipedProductId === p.id} 
              onSwipe={setSwipedProductId} 
              onEdit={openEditModal} 
              onDelete={handleDeleteProduct} 
            />
          ))
        )}
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-4 flex flex-col items-center gap-3 z-20">
        <label className="w-14 h-14 flex items-center justify-center cursor-pointer bg-white text-[#5a4fcf] rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95 border-2 border-[#5a4fcf]">
          <Upload className="w-6 h-6" />
          <input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} className="hidden" />
        </label>
        <button 
          onClick={openAddModal} 
          className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-[#5a4fcf] to-[#7b6fd8] text-white rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>

      {/* Modal */}
      {(showAddModal || (showEditModal && editingProduct)) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-end sm:items-center z-50 p-0 sm:p-4">
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#5a4fcf] to-[#7b6fd8] px-6 py-5 flex justify-between items-center flex-shrink-0">
              <div>
                <h2 className="text-xl font-bold text-white">{showEditModal ? 'Edit Product' : 'Add Product'}</h2>
                <p className="text-white/80 text-sm mt-0.5">{showEditModal ? 'Update details' : 'Fill information'}</p>
              </div>
              <button onClick={closeModal} className="text-white hover:bg-white/20 rounded-full p-2 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
             {isScannerOpen ? (
                <div className="space-y-4">
                  <div id={readerId} className="w-full rounded-2xl overflow-hidden border-2 border-gray-200" />
                  <button 
                    onClick={() => setIsScannerOpen(false)} 
                    className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 font-semibold transition-colors"
                   >
                     Cancel Scan
                   </button>
                </div>
              ) : (
              <>
                {/* Image Upload */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#5a4fcf] rounded-full"></span>
                      Product Image
                    </label>
                    <div
                        className="w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center cursor-pointer hover:border-[#5a4fcf] transition-colors bg-gradient-to-br from-gray-50 to-gray-100"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-contain p-2 rounded-2xl" />
                        ) : (
                            <div className="text-center text-gray-500">
                                <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                                <p className="font-medium">Tap to upload image</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Product Name */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#5a4fcf] rounded-full"></span>
                      Product Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter product name"
                      className="w-full border-2 border-gray-200 px-4 py-3 rounded-2xl focus:border-[#5a4fcf] focus:ring-2 focus:ring-[#5a4fcf]/20 transition-all outline-none font-medium"
                      value={showEditModal ? editingProduct?.name : newProduct.name}
                      onChange={(e) => showEditModal ? setEditingProduct({ ...editingProduct!, name: e.target.value }) : setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                  </div>

                  {/* Product ID with Scanner */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#7b6fd8] rounded-full"></span>
                      Product ID
                    </label>
                    <div className="relative">
                        <input
                          type="text"
                          placeholder="SKU or Barcode"
                          className="w-full border-2 border-gray-200 px-4 py-3 pr-14 rounded-2xl focus:border-[#7b6fd8] focus:ring-2 focus:ring-[#7b6fd8]/20 transition-all outline-none font-mono text-sm"
                          value={showEditModal ? (editingProduct?.sku || '') : (newProduct.sku || '')}
                          onChange={(e) => {
                            if (showEditModal) {
                              setEditingProduct({ ...editingProduct!, sku: e.target.value });
                            } else {
                              setNewProduct({ ...newProduct, sku: e.target.value });
                            }
                          }}
                        />
                        <button 
                            type="button" 
                            onClick={handleScanBarcode} 
                            className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 bg-gradient-to-r from-[#5a4fcf] to-[#7b6fd8] text-white rounded-xl hover:shadow-lg transition-all active:scale-95"
                        >
                            <Camera className="w-5 h-5" />
                        </button>
                    </div>
                  </div>

                  {/* Quantity & Price */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Quantity
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        className="w-full border-2 border-gray-200 px-4 py-3 rounded-2xl focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all outline-none font-semibold"
                        value={showEditModal ? (editingProduct?.quantity ?? '') : (newProduct.quantity ?? '')}
                        onChange={(e) => showEditModal ? setEditingProduct({ ...editingProduct!, quantity: Number(e.target.value) || 0 }) : setNewProduct({ ...newProduct, quantity: Number(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Price
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                        <input
                          type="number"
                          placeholder="0.00"
                          className="w-full border-2 border-gray-200 pl-8 pr-4 py-3 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none font-semibold"
                          value={showEditModal ? (editingProduct?.sellingPrice ?? '') : (newProduct.sellingPrice ?? '')}
                          onChange={(e) => showEditModal ? setEditingProduct({ ...editingProduct!, sellingPrice: Number(e.target.value) || 0 }) : setNewProduct({ ...newProduct, sellingPrice: Number(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* GST Rate */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                      GST Rate
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="0"
                        className="w-full border-2 border-gray-200 px-4 py-3 pr-12 rounded-2xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all outline-none font-semibold"
                        value={showEditModal ? (editingProduct?.gstRate ?? '') : (newProduct.gstRate ?? '')}
                        onChange={(e) => showEditModal ? setEditingProduct({ ...editingProduct!, gstRate: Number(e.target.value) || 0 }) : setNewProduct({ ...newProduct, gstRate: Number(e.target.value) || 0 })}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
                    </div>
                  </div>
              </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex gap-3 border-t flex-shrink-0">
              <button 
                onClick={closeModal} 
                className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={showEditModal ? handleSaveEdit : handleSaveNewProduct}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#5a4fcf] to-[#7b6fd8] text-white rounded-2xl hover:shadow-lg font-bold transition-all"
              >
                {showEditModal ? 'Save' : 'Add'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Inventory;