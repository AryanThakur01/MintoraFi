'use client';

import { motion } from 'framer-motion';
import { Button, buttonVariants } from '@/components/ui/button';
import { ArrowRight, Zap, Shield, FileText } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="container mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 text-glow"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Mint Invoices.{' '}
            <span className="text-blue-400">On-Chain.</span>{' '}
            <span className="text-green-400">Instantly.</span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Transform your invoices into secure, verifiable NFTs on the blockchain. 
            Experience the future of transparent business documentation.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link href='https://mintorafi.aryanthakur.dev' target='_blank'  className={cn(buttonVariants({variant: 'default', size: 'lg'}),"bg-blue-600 hover:bg-blue-700 neon-glow text-lg px-8 py-4")}>
              Get Started <ArrowRight className="ml-2" size={20} />
            </Link>
          </motion.div>

          {/* Floating Icons */}
          <motion.div
            className="relative max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-0 left-4 p-4 glass-card rounded-full"
            >
              <Zap className="text-yellow-400" size={32} />
            </motion.div>
            
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute top-12 right-8 p-4 glass-card rounded-full"
            >
              <Shield className="text-green-400" size={28} />
            </motion.div>
            
            <motion.div
              animate={{ 
                y: [0, -25, 0],
                rotate: [0, 3, 0]
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 p-4 glass-card rounded-full"
            >
              <FileText className="text-blue-400" size={30} />
            </motion.div>

            <div className="h-64 md:h-80 flex items-center justify-center">
              <motion.div
                className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-r from-blue-500 to-green-400 opacity-20"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
