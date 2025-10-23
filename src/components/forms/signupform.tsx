// 'use client';

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';

// // This is a named export for a reusable component
// export function SignUpForm() {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const router = useRouter();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors: { [key: string]: string } = {};
//     if (!formData.name.trim()) newErrors.name = 'Name is required';
//     if (!formData.email) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Email is invalid';
//     }
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }
//     if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validateForm()) {
//       return;
//     }
//     console.log('Form data submitted:', formData);

//     // *** THIS IS THE CORRECTED LINE ***
//     // Redirect to the /login page after successful signup
//     router.push('/login');
//   };

//   return (
//     <form className="space-y-6" onSubmit={handleSubmit} noValidate>
//       {/* Name Field */}
//       <div>
//         <label htmlFor="name" className="block text-sm font-medium text-gray-700 text-left mb-1">
//           Full Name
//         </label>
//         <input
//           id="name"
//           name="name"
//           type="text"
//           autoComplete="name"
//           required
//           value={formData.name}
//           onChange={handleChange}
//           className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
//             errors.name ? 'border-red-500' : 'border-gray-300'
//           }`}
//           placeholder="Enter your full name"
//         />
//         {errors.name && <p className="mt-1 text-sm text-red-600 text-left">{errors.name}</p>}
//       </div>

//       {/* Email Field */}
//       <div>
//         <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left mb-1">
//           Email Address
//         </label>
//         <input
//           id="email"
//           name="email"
//           type="email"
//           autoComplete="email"
//           required
//           value={formData.email}
//           onChange={handleChange}
//           className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
//             errors.email ? 'border-red-500' : 'border-gray-300'
//           }`}
//           placeholder="Enter your email"
//         />
//         {errors.email && <p className="mt-1 text-sm text-red-600 text-left">{errors.email}</p>}
//       </div>

//       {/* Password Fields */}
//       <div>
//         <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-left mb-1">
//           Password
//         </label>
//         <input
//           id="password"
//           name="password"
//           type="password"
//           autoComplete="new-password"
//           required
//           value={formData.password}
//           onChange={handleChange}
//           className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
//             errors.password ? 'border-red-500' : 'border-gray-300'
//           }`}
//           placeholder="Create a password"
//         />
//         {errors.password && <p className="mt-1 text-sm text-red-600 text-left">{errors.password}</p>}
//       </div>
//       <div>
//         <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 text-left mb-1">
//           Confirm Password
//         </label>
//         <input
//           id="confirmPassword"
//           name="confirmPassword"
//           type="password"
//           autoComplete="new-password"
//           required
//           value={formData.confirmPassword}
//           onChange={handleChange}
//           className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
//             errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
//           }`}
//           placeholder="Confirm your password"
//         />
//         {errors.confirmPassword && <p className="mt-1 text-sm text-red-600 text-left">{errors.confirmPassword}</p>}
//       </div>
      
//       {/* Submit Button */}
//       <button
//         type="submit"
//         className="w-full px-4 py-3 text-white font-semibold bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//       >
//         Create Account
//       </button>
//     </form>
//   );
// }