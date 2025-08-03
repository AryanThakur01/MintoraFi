'use client';

import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { Github, Twitter, FileText, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12"
        >
          <div className="col-span-1 md:col-span-2">
            <motion.h3
              className="text-2xl font-bold mb-4 text-glow"
              whileHover={{ scale: 1.02 }}
            >
              Mintorafi
            </motion.h3>
            <p className="text-gray-300 leading-relaxed max-w-md">
              Transforming traditional business documents into secure, verifiable NFTs 
              on the blockchain. The future of invoice management is here.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-300">Product</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#features" className="hover:text-blue-400 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">API Docs</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Integrations</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-300">Company</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-green-400 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Terms</a></li>
            </ul>
          </div>
        </motion.div>

        <Separator className="mb-8 bg-gray-700" />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between"
        >
          <p className="text-gray-400 mb-4 md:mb-0">
            © 2025 Mintorafi. All rights reserved.
          </p>

          <div className="flex space-x-6">
            <motion.a
              href="#"
              className="text-gray-400 hover:text-blue-400 transition-colors"
              whileHover={{ scale: 1.2, y: -2 }}
            >
              <Github size={24} />
            </motion.a>
            <motion.a
              href="#"
              className="text-gray-400 hover:text-blue-400 transition-colors"
              whileHover={{ scale: 1.2, y: -2 }}
            >
              <Twitter size={24} />
            </motion.a>
            <motion.a
              href="#"
              className="text-gray-400 hover:text-green-400 transition-colors"
              whileHover={{ scale: 1.2, y: -2 }}
            >
              <FileText size={24} />
            </motion.a>
            <motion.a
              href="#"
              className="text-gray-400 hover:text-purple-400 transition-colors"
              whileHover={{ scale: 1.2, y: -2 }}
            >
              <Mail size={24} />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}