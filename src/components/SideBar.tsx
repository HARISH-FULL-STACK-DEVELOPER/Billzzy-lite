// 'use client';

// declare const window: any;

// import Link from 'next/link';
// import { Home, Package, Settings, X, CreditCard, Menu, LogOut } from 'lucide-react';
// import { usePathname, useRouter } from 'next/navigation';
// import { useEffect } from 'react';

// type SidebarProps = {
//   isMobileOpen: boolean;
//   setIsMobileOpen: (isOpen: boolean) => void;
// };

// type MobileHeaderProps = {
//   onMenuClick: () => void;
//   isMobileOpen: boolean;
// };

// function NavLink({
//   href,
//   children,
//   onClick,
// }: {
//   href: string;
//   children: React.ReactNode;
//   onClick?: () => void;
// }) {
//   const pathname = usePathname();
//   const isActive = pathname === href;

//   return (
//     <Link
//       href={href}
//       className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 ${
//         isActive
//           ? 'bg-[#5a4fcf] text-white shadow-lg'
//           : 'text-gray-700 hover:bg-gray-50'
//       }`}
//       onClick={onClick}
//     >
//       {children}
//     </Link>
//   );
// }

// // Logo component now uses your Billzzy Lite logo from public folder
// function Logo() {
//   return (
//     <div className="flex items-center justify-center">
//       <img src="/images/billzzy-lite.png" alt="Billzzy Lite" className="h-12 w-auto lg:h-12" />
//     </div>
//   );
// }

// export function Sidebar({ isMobileOpen, setIsMobileOpen }: SidebarProps) {
//   const router = useRouter();

//   const handleLinkClick = () => {
//     if (typeof window !== 'undefined' && window.innerWidth < 1024) {
//       setIsMobileOpen(false);
//     }
//   };

//   const handleLogout = () => {
//     if (typeof window !== 'undefined') {
//       window.localStorage.clear();
//     }
//     router.push('/');
//   };

//   useEffect(() => {
//     if (typeof window === 'undefined') return;

//     const handleResize = () => {
//       if (window.innerWidth >= 1024) {
//         setIsMobileOpen(false);
//       }
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, [setIsMobileOpen]);

//   return (
//     <>
//       {/* Mobile overlay */}
//       <div
//         className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 lg:hidden ${
//           isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
//         }`}
//         onClick={() => setIsMobileOpen(false)}
//         aria-hidden="true"
//       />

//       {/* Sidebar */}
//       <aside
//         id="sidebar"
//         className={`fixed top-0 left-0 w-80 h-full bg-white z-50 
//                     flex flex-col transform transition-transform duration-300 ease-in-out
//                     lg:relative lg:translate-x-0
//                     ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
//       >
//         {/* Header with Logo */}
//         <div className="flex justify-between items-center px-6 py-8">
//           <Logo />
//           <button
//             onClick={() => setIsMobileOpen(false)}
//             className="lg:hidden w-11 h-11 flex items-center justify-center hover:bg-gray-100 rounded-xl transition-colors"
//             aria-label="Close menu"
//           >
//             <X className="w-6 h-6 text-gray-600" />
//           </button>
//         </div>

//         {/* Main navigation */}
//         <nav className="flex flex-col gap-3 flex-grow px-5 py-4">
//           <NavLink href="/dashboard" onClick={handleLinkClick}>
//             <Home className="w-6 h-6" />
//             <span className="text-base font-semibold">Dashboard</span>
//           </NavLink>

//           <NavLink href="/inventory" onClick={handleLinkClick}>
//             <Package className="w-6 h-6" />
//             <span className="text-base font-semibold">Inventory</span>
//           </NavLink>

//           <NavLink href="/billing" onClick={handleLinkClick}>
//             <CreditCard className="w-6 h-6" />
//             <span className="text-base font-semibold">Billing</span>
//           </NavLink>

//           <NavLink href="/settings" onClick={handleLinkClick}>
//             <Settings className="w-6 h-6" />
//             <span className="text-base font-semibold">Settings</span>
//           </NavLink>          
//         </nav>

//         {/* Logout section */}
//         <div className="px-5 py-6">
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all duration-200"
//           >
//             <LogOut className="w-6 h-6" />
//             <span className="text-base font-semibold">Logout</span>
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// }

// export function MobileHeader({ onMenuClick, isMobileOpen }: MobileHeaderProps) {
//   return (
//     <header className="lg:hidden fixed top-0 left-0 right-0 bg-white z-30 h-20 flex items-center justify-between px-5 shadow-sm">
//       <Logo />
//       <button
//         onClick={onMenuClick}
//         className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 rounded-xl transition-colors"
//         aria-label="Open menu"
//         aria-controls="sidebar"
//         aria-expanded={isMobileOpen}
//       >
//         <Menu className="w-6 h-6 text-gray-700" />
//       </button>
//     </header>
//   );
// }

'use client';

declare const window: any;

import Link from 'next/link';
import { Home, Package, Settings, X, CreditCard, Menu, LogOut, CheckCircle } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const PRIMARY_COLOR = '#5a4fcf';

type SidebarProps = {
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
};

type MobileHeaderProps = {
  onMenuClick: () => void;
  isMobileOpen: boolean;
};

// --- NavLink Component ---
function NavLink({
  href,
  icon: Icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-4 px-5 py-3 transition-all duration-200 rounded-xl ${
        isActive
          ? `bg-[${PRIMARY_COLOR}] text-white shadow-lg shadow-[${PRIMARY_COLOR}]/30`
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      <div
        className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors duration-200 ${
          isActive
            ? `bg-white text-[${PRIMARY_COLOR}]`
            : 'bg-gray-100 group-hover:bg-gray-200 text-gray-500'
        }`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <span className={`text-base font-semibold transition-colors duration-200 ${isActive ? 'text-white' : 'text-gray-700'}`}>
        {label}
      </span>
    </Link>
  );
}

// --- Logo Component ---
function Logo() {
  return (
    <div className="flex items-center justify-center">
      <img src="/images/lite logo.png" alt="Billzzy Lite" className="h-10 w-auto lg:h-12" />
    </div>
  );
}

// --- Sidebar Component ---
export function Sidebar({ isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const router = useRouter();

  const handleLinkClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) setIsMobileOpen(false);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') window.localStorage.clear();
    router.push('/');
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobileOpen]);

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 lg:hidden ${
          isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`fixed top-0 left-0 w-80 h-full bg-white z-50 flex flex-col transform transition-transform duration-300 ease-in-out
        lg:relative lg:w-72 lg:rounded-3xl lg:shadow-xl lg:translate-x-0 lg:my-4 lg:ml-4
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-8">
          <Logo />
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden w-11 h-11 flex items-center justify-center hover:bg-gray-100 rounded-xl transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 flex-grow px-5 py-4">
          <NavLink href="/dashboard" icon={Home} label="Dashboard" onClick={handleLinkClick} />
          <NavLink href="/inventory" icon={Package} label="Inventory" onClick={handleLinkClick} />
          <NavLink href="/billing" icon={CreditCard} label="Billing" onClick={handleLinkClick} />
          <NavLink href="/reports" icon={CheckCircle} label="Reports" onClick={handleLinkClick} />
          <NavLink href="/settings" icon={Settings} label="Settings" onClick={handleLinkClick} />
        </nav>

        {/* Logout */}
        <div className="px-5 py-6 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full p-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200"
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-100 text-red-500">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="text-base font-semibold text-gray-700">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

// --- MobileHeader Component ---
export function MobileHeader({ onMenuClick, isMobileOpen }: MobileHeaderProps) {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 bg-white z-30 h-16 flex items-center justify-between px-5 border-b border-gray-100">
      <Logo />
      <button
        onClick={onMenuClick}
        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Open menu"
        aria-controls="sidebar"
        aria-expanded={isMobileOpen}
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </button>
    </header>
  );
}

// --- Mobile Bottom Navigation ---
export function MobileBottomNav() {
  const pathname = usePathname();

  const NavItem = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) => {
    const isActive = pathname === href;
    return (
      <Link href={href} className="flex flex-col items-center justify-center p-2">
        <div
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
            isActive
              ? `bg-[${PRIMARY_COLOR}] text-white shadow-md shadow-[${PRIMARY_COLOR}]/40`
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <span
          className={`text-xs mt-1 font-medium transition-colors ${
            isActive ? `text-[${PRIMARY_COLOR}]` : 'text-gray-500'
          }`}
        >
          {label}
        </span>
      </Link>
    );
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 h-20 flex justify-around items-center pt-2 pb-safe-bottom shadow-2xl rounded-t-2xl">
      <NavItem href="/dashboard" icon={Home} label="Home" />
      <NavItem href="/inventory" icon={Package} label="Inventory" />
      <NavItem href="/billing" icon={CreditCard} label="Billing" />
      <NavItem href="/settings" icon={Settings} label="Settings" />
    </nav>
  );
}
