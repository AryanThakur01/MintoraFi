'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Database, Zap, Lock, Globe, Award } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'On-Chain Verification',
    description: 'Every invoice is cryptographically verified and immutably stored on the blockchain for maximum security and trust.'
  },
  {
    icon: Database,
    title: 'IPFS Storage',
    description: 'Decentralized storage ensures your documents are always accessible and never lost, with redundant backup systems.'
  },
  {
    icon: Zap,
    title: 'Instant Minting',
    description: 'Transform invoices into NFTs in seconds with our optimized smart contract infrastructure.'
  },
  {
    icon: Lock,
    title: 'Enterprise Security',
    description: 'Bank-grade encryption and security protocols protect your sensitive business documents.'
  },
  {
    icon: Globe,
    title: 'Global Accessibility',
    description: 'Access your invoice NFTs from anywhere in the world with full cross-platform compatibility.'
  },
  {
    icon: Award,
    title: 'Compliance Ready',
    description: 'Built with regulatory compliance in mind, supporting various international business standards.'
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-slate-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-glow">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to revolutionize your invoice management with blockchain technology
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className="glass-card border-green-500/20 h-full group hover:border-green-500/40 transition-all duration-300">
                <CardHeader>
                  <motion.div
                    className="w-12 h-12 mb-4 rounded-lg bg-green-600 flex items-center justify-center group-hover:bg-green-500 transition-colors"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <feature.icon size={24} className="text-white" />
                  </motion.div>
                  <CardTitle className="text-xl text-green-300 group-hover:text-green-200 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}