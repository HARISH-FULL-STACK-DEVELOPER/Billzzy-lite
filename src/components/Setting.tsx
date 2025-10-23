'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  UserCircleIcon,
  BuildingStorefrontIcon,
  ExclamationTriangleIcon,
  CreditCardIcon,
  QrCodeIcon,
} from '@heroicons/react/24/outline';

// Type for the form data
type FormData = {
  name: string;
  phoneNumber: string;
  address: string;
  shopName: string;
  shopAddress: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branch: string;
  merchantUpiId: string;
};

// Type for the SettingsField component's props
type SettingsFieldProps = {
  label: string;
  value: string;
  isEditing: boolean;
  name: keyof FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
};

// A reusable component for our form fields
const SettingsField = ({ label, value, isEditing, name, onChange, type = 'text' }: SettingsFieldProps) => (
  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
    <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
      {label}
    </label>
    <div className="mt-2 sm:col-span-2 sm:mt-0">
      {isEditing ? (
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      ) : (
        <p className="text-sm leading-6 text-gray-700">{name === 'accountNumber' ? `••••${value.slice(-4)}` : value || '-'}</p>
      )}
    </div>
  </div>
);

export default function Settings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phoneNumber: '',
    address: '',
    shopName: '',
    shopAddress: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    branch: '',
    merchantUpiId: '',
  });

  // ✅ 1. LOAD DATA from localStorage or set defaults
  const loadFormData = () => {
    if (session?.user?.email) {
      // Use user's email as a unique key to store their settings
      const savedData = localStorage.getItem(`userSettings-${session.user.email}`);
      
      if (savedData) {
        setFormData(JSON.parse(savedData));
      } else {
        // If no saved data, set initial mock data
        setFormData({
          name: session.user.name || '',
          phoneNumber: '(555) 123-4567',
          address: '456 User Lane, Profile City, 12345',
          shopName: 'Billzzy Lite Store',
          shopAddress: '123 Innovation Dr, Tech City',
          bankName: 'Global Trust Bank',
          accountNumber: '1234567890',
          ifscCode: 'GTB0123456',
          branch: 'Tech City Main Branch',
          merchantUpiId: '', // Keep this empty initially
        });
      }
    }
  };
  
  // Load data when the session is available
  useEffect(() => {
    if (status === 'authenticated') {
      loadFormData();
    }
  }, [session, status]);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/');
  }, [status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ 2. SAVE DATA to localStorage on submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (session?.user?.email) {
      // Save the current form data to localStorage
      localStorage.setItem(`userSettings-${session.user.email}`, JSON.stringify(formData));
      console.log('Saving data:', formData);
      setIsEditing(false);
      alert('Settings saved successfully!'); // Optional feedback for the user
    } else {
      alert('Could not save settings. User not found.');
    }
  };
  
  // ✅ 3. On cancel, reload the last saved data
  const handleCancel = () => {
    loadFormData(); // Reloads from localStorage, discarding changes
    setIsEditing(false);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (status === 'authenticated' && session.user) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
            <p className="mt-2 text-sm text-gray-600">Manage your account and shop details.</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8">
            <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-2 lg:gap-x-8">
              {/* User Profile Section */}
              <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
                <div className="flex items-center gap-x-4">
                  <UserCircleIcon className="h-7 w-7 text-gray-500" />
                  <h3 className="text-xl font-semibold leading-7 text-gray-900">User Profile</h3>
                </div>
                <div className="mt-6 flex items-center gap-x-6">
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900">{session.user.name}</p>
                    <p className="text-gray-600">{session.user.email}</p>
                  </div>
                </div>
                <div className="mt-6 divide-y divide-gray-100">
                  <SettingsField label="Full Name" name="name" value={formData.name} isEditing={isEditing} onChange={handleChange} />
                  <SettingsField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} isEditing={isEditing} onChange={handleChange} />
                  <SettingsField label="Address" name="address" value={formData.address} isEditing={isEditing} onChange={handleChange} />
                </div>
              </div>

              {/* Shop Details Section */}
              <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
                <div className="flex items-center gap-x-4">
                  <BuildingStorefrontIcon className="h-7 w-7 text-gray-500" />
                  <h3 className="text-xl font-semibold leading-7 text-gray-900">Shop Details</h3>
                </div>
                <div className="mt-6 divide-y divide-gray-100">
                  <SettingsField label="Shop Name" name="shopName" value={formData.shopName} isEditing={isEditing} onChange={handleChange} />
                  <SettingsField label="Shop Address" name="shopAddress" value={formData.shopAddress} isEditing={isEditing} onChange={handleChange} />
                </div>
              </div>

              {/* Bank Details Section */}
              <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
                <div className="flex items-center gap-x-4">
                  <CreditCardIcon className="h-7 w-7 text-gray-500" />
                  <h3 className="text-xl font-semibold leading-7 text-gray-900">Bank Details</h3>
                </div>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 divide-y sm:divide-y-0 divide-gray-100">
                  <SettingsField label="Bank Name" name="bankName" value={formData.bankName} isEditing={isEditing} onChange={handleChange} />
                  <SettingsField label="Account Number" name="accountNumber" value={formData.accountNumber} isEditing={isEditing} onChange={handleChange} />
                  <SettingsField label="IFSC Code" name="ifscCode" value={formData.ifscCode} isEditing={isEditing} onChange={handleChange} />
                  <SettingsField label="Branch" name="branch" value={formData.branch} isEditing={isEditing} onChange={handleChange} />
                </div>
              </div>

              {/* Merchant UPI Details Section */}
              <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
                <div className="flex items-center gap-x-4">
                  <QrCodeIcon className="h-7 w-7 text-gray-500" />
                  <h3 className="text-xl font-semibold leading-7 text-gray-900">Merchant UPI Details</h3>
                </div>
                <div className="mt-6 divide-y divide-gray-100">
                  <SettingsField 
                    label="Merchant UPI ID" 
                    name="merchantUpiId" 
                    value={formData.merchantUpiId} 
                    isEditing={isEditing} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end gap-x-3">
              {isEditing ? (
                <>
                  <button type="button" onClick={handleCancel} className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    Cancel
                  </button>
                  <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Save Changes
                  </button>
                </>
              ) : (
                <button type="button" onClick={() => setIsEditing(true)} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  Edit Profile and Shop
                </button>
              )}
            </div>
          </form>

          {/* Danger Zone */}
          <div className="mt-12 bg-white p-6 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
            <div className="flex items-center gap-x-4">
              <ExclamationTriangleIcon className="h-7 w-7 text-red-500" />
              <h3 className="text-xl font-semibold leading-7 text-gray-900">Danger Zone</h3>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">Once you log out, you will need to sign in again.</p>
              <button onClick={() => signOut({ callbackUrl: '/' })} type="button" className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}