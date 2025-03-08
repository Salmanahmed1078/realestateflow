
import React, { useState } from 'react';
import { Building, Heart, User, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Favorites">
              <Heart className="h-5 w-5" />
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors">
              <User className="h-5 w-5" />
              <span>Sign In</span>
            </button>
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
            <hr className="my-2 border-gray-200 dark:border-gray-700" />
            <div className="flex items-center justify-between">
              <button className="flex items-center space-x-2 py-2 px-3">
                <Heart className="h-5 w-5" />
                <span>Favorites</span>
              </button>
              <button className="flex items-center space-x-2 py-2 px-4 rounded-md bg-primary text-white">
                <User className="h-5 w-5" />
                <span>Sign In</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
