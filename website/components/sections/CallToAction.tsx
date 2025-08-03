'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CallToAction() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-900 via-purple-900 to-green-900">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-400 to-green-400 flex items-center justify-center"
          >
            <Sparkles size={32} className="text-white" />
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-glow">
            Ready to Revolutionize Your Invoices?
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
            Join thousands of businesses already using Mintorafi to secure and verify their invoices on the blockchain
          </p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 neon-glow text-lg px-8 py-4"
            >
              Start Minting Now <ArrowRight className="ml-2" size={20} />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
