'use client';

import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What is Mintorafi and how does it work?',
    answer: 'Mintorafi is a revolutionary platform that transforms traditional invoices into NFTs on the blockchain. You upload your invoice, we verify its authenticity, and mint it as a unique NFT with permanent IPFS storage.'
  },
  {
    question: 'Why should I mint my invoices as NFTs?',
    answer: 'NFT invoices provide immutable proof of transactions, prevent fraud, enable easy verification, and create a permanent record that cannot be altered or lost. This enhances trust and transparency in business relationships.'
  },
  {
    question: 'Which blockchains do you support?',
    answer: 'We currently support Ethereum, Polygon, and Arbitrum networks. We are continuously expanding to include more blockchain networks based on user demand and technical feasibility.'
  },
  {
    question: 'How secure is my data?',
    answer: 'Your data is protected with enterprise-grade encryption, stored on decentralized IPFS networks, and secured by blockchain technology. We never store sensitive data on centralized servers.'
  },
  {
    question: 'What are the costs involved?',
    answer: 'Pricing varies based on blockchain network fees and your usage volume. We offer competitive rates with bulk discounts for enterprise customers. Contact us for detailed pricing information.'
  },
  {
    question: 'Can I integrate Mintorafi with my existing systems?',
    answer: 'Yes! We provide robust APIs and webhooks that allow seamless integration with most accounting software, ERP systems, and custom business applications.'
  }
];

export default function FAQ() {
  return (
    <section id="faq" className="py-20 bg-slate-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-glow">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Everything you need to know about minting invoices on the blockchain
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="glass-card border-blue-500/20 rounded-lg px-6"
              >
                <AccordionTrigger className="text-left text-lg font-semibold text-blue-300 hover:text-blue-200">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 leading-relaxed pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}