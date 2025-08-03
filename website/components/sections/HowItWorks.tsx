'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Shield, Coins, Download } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Upload Invoice',
    description: 'Simply upload your invoice document to our secure platform'
  },
  {
    icon: Shield,
    title: 'Verify & Validate',
    description: 'Our system automatically verifies and validates your document'
  },
  {
    icon: Coins,
    title: 'Mint as NFT',
    description: 'Transform your verified invoice into a unique NFT on the blockchain'
  },
  {
    icon: Download,
    title: 'Store & Share',
    description: 'Access your minted invoice NFT anytime with IPFS permanent storage'
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-slate-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-glow">
            How It Works
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Four simple steps to transform your traditional invoices into secure, blockchain-verified NFTs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <Card className="glass-card border-blue-500/20 h-full">
                <CardContent className="p-6 text-center">
                  <motion.div
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-600 flex items-center justify-center neon-glow"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <step.icon size={32} className="text-white" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3 text-blue-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                  <div className="mt-4 text-sm text-blue-400 font-semibold">
                    Step {index + 1}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}