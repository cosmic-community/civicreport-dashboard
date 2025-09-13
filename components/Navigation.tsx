'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Building2, Users, Settings } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/departments', label: 'Departments', icon: Building2 },
  { href: '/staff', label: 'Staff', icon: Users },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="font-semibold text-lg text-gray-900">CivicReport</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <button className="p-2 rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}