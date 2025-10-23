'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

// --- Configuration: Image Paths ---
// NOTE: These files MUST exist in your project's 'public' folder.
const BILLZZY_LOGO_URL = '/lite-logo.png'; 
const LOGIN_HEADER_BACKGROUND_IMAGE_URL = '/big-image-login.png'; // The image with the mascot/store
// --- End Configuration ---

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    // Main container: full height, centered content, light gray background
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Card Container - White background, rounded corners, shadow */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative pb-6"> {/* Added bottom padding */}
          
          {/* Header Image Section with Curved Bottom */}
          <div className="relative h-64 overflow-hidden rounded-t-3xl" 
               style={{ 
                 clipPath: 'ellipse(120% 100% at 50% 0%)' // This creates the curve for the image container itself
               }}>
            <Image
              src={LOGIN_HEADER_BACKGROUND_IMAGE_URL}
              alt="Billzzy Login Background"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              className="z-0"
            />
          </div>

        
          {/* Billzzy Lite Logo - positioned ABOVE the text, NOT overlapping the image */}
          <div className="relative z-10 flex flex-col items-center mt-[20px] mb-8"> {/* Adjusted margin-top to pull it up slightly */}
              <Image 
                  src={BILLZZY_LOGO_URL} 
                  alt="Billzzy Lite Logo" 
                  width={160} 
                  height={40}
                  className="h-auto w-auto " // Added white background and shadow for distinction
                  priority
              />
          </div>


          {/* Main Content Section */}
          <div className="px-6 pb-8"> {/* Adjusted padding */}
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome to Billzzy Lite
              </h2>
              <p className="text-gray-600 text-sm">
                Sign in to continue to your dashboard.
              </p>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3.5 border-2 border-gray-300 rounded-xl shadow-sm text-base font-bold text-gray-700 bg-white hover:bg-gray-50 hover:shadow-md hover:border-gray-400 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.582-3.443-11.113-8.06l-6.571,4.819C9.656,39.663,16.318,44,24,44z" />
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C39.988,35.617,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
              </svg>
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-3 border-gray-700 border-t-transparent mr-2"></div>
                  Loading...
                </div>
              ) : (
                'Continue with Google'
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          © 2024 Billzzy Lite. All rights reserved.
        </p>
      </div>
    </div>
  );
}