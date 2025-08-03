'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'CFO at TechFlow',
    content: 'Mintorafi has revolutionized how we handle invoice verification. The blockchain transparency gives us and our clients complete confidence.',
    rating: 5
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Founder of BlockVentures',
    content: 'Finally, a solution that bridges traditional business processes with Web3 innovation. The NFT invoices are game-changing.',
    rating: 5
  },
  {
    name: 'Emily Watson',
    role: 'Accountant at GreenTech',
    content: 'The security and immutability of blockchain-based invoices have streamlined our audit processes significantly.',
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-slate-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-glow">
            Trusted by Innovators
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            See what industry leaders are saying about Mintorafi
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className="glass-card border-purple-500/20 h-full hover:border-purple-500/40 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} className="text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-purple-300">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {testimonial.role}
                    </div>
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