"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const BackgroundBeamsWithCollisionDemo = () => {
  return (
    <div className="min-h-screen w-full overflow-hidden">
      <main>
        <section className="min-h-screen flex flex-col justify-center items-center relative">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-6xl md:text-8xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
          >
            AI Image Generation on Solana
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-xl md:text-2xl text-center mb-12 text-black/80 dark:text-white/80 max-w-2xl"
          >
            Create stunning AI-generated images instantly for just 0.01 SOL.
            Fast, secure, and powered by Solana blockchain.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <Link href={"/generate"}>
              <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition duration-300">
                Generate Image • 0.01 SOL
              </Button>
            </Link>
          </motion.div>
        </section>

        <section className="py-12 lg:py-24">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Why Choose Our Platform?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="p-6 rounded-lg backdrop-blur-sm bg-white/10">
                <h3 className="text-xl font-bold mb-4">Lightning Fast</h3>
                <p className="text-black/80 dark:text-white/80">
                  Generate images in seconds with Solana&apos;s rapid
                  transaction speed
                </p>
              </div>
              <div className="p-6 rounded-lg backdrop-blur-sm bg-white/10">
                <h3 className="text-xl font-bold mb-4">Cost Effective</h3>
                <p className="text-black/80 dark:text-white/80">
                  Only 0.01 SOL per generation, making creativity accessible
                </p>
              </div>
              <div className="p-6 rounded-lg backdrop-blur-sm bg-white/10">
                <h3 className="text-xl font-bold mb-4">Secure & Reliable</h3>
                <p className="text-black/80 dark:text-white/80">
                  Built on Solana blockchain for maximum security and
                  reliability
                </p>
              </div>
            </div>
            <Link href={"/gallery"}>
              <Button className="bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition duration-300">
                View Gallery
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BackgroundBeamsWithCollisionDemo;
