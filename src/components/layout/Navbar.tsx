
import React, { useState, useEffect } from 'react';
import { Building, Heart, User, Menu, X, Search, LogOut, Settings, UserCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useUserStore } from '../../stores/userStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const { user, isLoggedIn, isTemporaryLogin, sessionExpiryTime, logout } = useUserStore();
  const [remainingTime, setRemainingTime] = useState<string>('');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
  };

  // Update remaining time for temporary login
  useEffect(() => {
    if (isTemporaryLogin && sessionExpiryTime) {
      const updateRemainingTime = () => {
        const now = Date.now();
        const remaining = sessionExpiryTime - now;
        
        if (remaining <= 0) {
          setRemainingTime('Expired');
          return;
        }
        
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        setRemainingTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      };
      
      updateRemainingTime();
      const interval = setInterval(updateRemainingTime, 1000);
      return () => clearInterval(interval);
    }
  }, [isTemporaryLogin, sessionExpiryTime]);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Building className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-heading font-bold">RealEstateFlow</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors">
              Buy
            </a>
            <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors">
              Rent
            </a>
            <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors">
              Sell
            </a>
            <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors">
              Agent Finder
            </a>
            <div className="relative group">
              <button className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors">
                Resources
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 hidden group-hover:block">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Market Trends</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Mortgage Calculator</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Buying Guide</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Selling Guide</a>
              </div>
            </div>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Favorites">
              <Heart className="h-5 w-5" />
            </button>
            
            {isLoggedIn && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="h-8 w-8 rounded-full object-cover border border-gray-200 dark:border-gray-700" 
                      />
                    ) : (
                      <UserCircle className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                      {isTemporaryLogin && (
                        <div className="flex items-center mt-1 text-xs text-amber-500">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Session: {remainingTime}</span>
                        </div>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Favorites</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/signin" className="flex items-center space-x-2 px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors">
                <User className="h-5 w-5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button onClick={toggleMenu} className="p-2">
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg animate-slide-down">
          <div className="container mx-auto px-4 py-3 space-y-1">
            <a href="#" className="block py-2 px-3 text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors">
              Buy
            </a>
            <a href="#" className="block py-2 px-3 text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors">
              Rent
            </a>
            <a href="#" className="block py-2 px-3 text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors">
              Sell
            </a>
            <a href="#" className="block py-2 px-3 text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors">
              Agent Finder
            </a>
            <div className="py-2 px-3">
              <button className="flex items-center justify-between w-full text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors" onClick={() => setIsResourcesOpen(!isResourcesOpen)}>
                <span>Resources</span>
                <svg className={`w-4 h-4 transition-transform ${isResourcesOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isResourcesOpen && (
                <div className="mt-2 pl-4 space-y-2">
                  <a href="#" className="block text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors">Market Trends</a>
                  <a href="#" className="block text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors">Mortgage Calculator</a>
                  <a href="#" className="block text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors">Buying Guide</a>
                  <a href="#" className="block text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors">Selling Guide</a>
                </div>
              )}
            </div>
            <hr className="my-2 border-gray-200 dark:border-gray-700" />
            <div className="flex items-center justify-between">
              <button className="flex items-center space-x-2 py-2 px-3">
                <Heart className="h-5 w-5" />
                <span>Favorites</span>
              </button>
              
              {isLoggedIn && user ? (
                <div className="flex items-center space-x-2 py-2 px-3">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="h-8 w-8 rounded-full object-cover border border-gray-200 dark:border-gray-700" 
                    />
                  ) : (
                    <UserCircle className="h-8 w-8" />
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.name}</span>
                    <button 
                      onClick={handleLogout}
                      className="text-xs text-primary hover:text-primary/90 text-left"
                    >
                      Log out
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/signin" className="flex items-center space-x-2 py-2 px-4 rounded-md bg-primary text-white">
                  <User className="h-5 w-5" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
