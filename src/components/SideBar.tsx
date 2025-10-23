'use client';

import React, { Dispatch, SetStateAction } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Package, Settings, CreditCard, LogOut, Menu, X } from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: Dispatch<SetStateAction<boolean>>;
}

interface MobileHeaderProps {
  onMenuClick: () => void;
}

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

function NavLink({ href, icon, label }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 ${
        isActive
          ? 'bg-indigo-50 text-indigo-700 font-semibold border-r-2 border-indigo-600'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <div
        className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors duration-200 ${
          isActive ? 'bg-white text-[#5a4fcf]' : 'bg-gray-100 group-hover:bg-gray-200 text-gray-500'
        }`}
      >
        {icon}
      </div>
      <span
        className={`text-base font-semibold transition-colors duration-200 ${
          isActive ? 'text-indigo-700' : 'text-gray-700'
        }`}
      >
        {label}
      </span>
    </Link>
  );
}

export function Sidebar({ isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== 'undefined') window.localStorage.clear();
    router.push('/');
  };

  const handleLinkClick = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity ${
          isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileOpen(false)}
      />

      <aside
        id="sidebar"
        className={`fixed top-0 left-0 h-full w-64 flex-col border-r bg-white z-40 lg:relative lg:flex transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h1 className="text-xl font-bold text-indigo-600">BillzzyLite</h1>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        <nav onClick={handleLinkClick} className="flex flex-1 flex-col space-y-1 p-4">
          <NavLink href="/dashboard" icon={<Home className="h-5 w-5" />} label="Dashboard" />
          <NavLink href="/inventory" icon={<Package className="h-5 w-5" />} label="Inventory" />
          <NavLink href="/billing" icon={<CreditCard className="h-5 w-5" />} label="Billing" />
          <NavLink href="/settings" icon={<Settings className="h-5 w-5" />} label="Settings" />
        </nav>

        <div className="border-t p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center rounded-lg px-4 py-3 text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="fixed left-0 right-0 top-0 z-20 flex h-14 items-center justify-between border-b bg-white px-4 shadow-sm lg:hidden">
      <h1 className="text-lg font-semibold text-gray-900">BillzzyLite</h1>
      <button onClick={onMenuClick} className="text-gray-600 hover:text-gray-900">
        <Menu size={24} />
      </button>
    </header>
  );
}
