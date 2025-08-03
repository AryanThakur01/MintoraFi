'use client';

import { motion } from 'framer-motion';
import { Button, buttonVariants } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 w-full z-50 glass-card border-b border-blue-500/20"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold text-glow cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Mintorafi
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="hover:text-blue-400 transition-colors">
              How It Works
            </a>
            <a href="#features" className="hover:text-blue-400 transition-colors">
              Features
            </a>
            <a href="#faq" className="hover:text-blue-400 transition-colors">
              FAQ
            </a>
            <Link href='https://mintorafi.aryanthakur.dev' target='_blank'  className={cn(buttonVariants({variant: 'outline'}),"bg-blue-600 hover:bg-blue-700 neon-glow")}>
              Get Started
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4 space-y-4"
          >
            <a href="#how-it-works" className="block hover:text-blue-400 transition-colors">
              How It Works
            </a>
            <a href="#features" className="block hover:text-blue-400 transition-colors">
              Features
            </a>
            <a href="#faq" className="block hover:text-blue-400 transition-colors">
              FAQ
            </a>
            <div className="space-y-2 pt-4">
              <Link href='https://mintorafi.aryanthakur.dev' target='_blank'  className={cn(buttonVariants({variant: 'default'}),"w-full bg-blue-600 hover:bg-blue-700 neon-glow")}>
                Get Started
              </Link>
            </div>
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
}
