"use client";

import Link from "next/link";
import { easeOut, motion } from "framer-motion";

export default function NotFound() {
  return (
    <section className="relative min-h-screen flex flex-col bg-voxy-bg text-voxy-text overflow-hidden">
      {/* === Background Animation (GIF or Video) === */}
      <div className="flex-1 flex items-center justify-center w-full overflow-hidden relative">
         {/* === Text Section (at the bottom) === */}
    
        <img
          src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
          alt="404 animation"
          className="w-full h-full object-contain md:object-cover object-center"
        />

        {/* Optional gradient overlay for cinematic feel */}
        <div className="absolute inset-0 from-transparent via-transparent to-voxy-bg " >
              <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easeOut }}
        className="z-10 text-center pb-16 px-6"
      >
        <h1 className="text-[80px] md:text-[120px] font-extrabold text-voxy-primary leading-none mb-2">
          404
        </h1>

        <h2 className="text-2xl md:text-3xl font-semibold text-voxy-bg mb-2">
          Looks like you’re lost
        </h2>

        <p className="text-voxy-muted mb-4">
          The page you’re looking for isn’t available or may have been removed.
        </p>

        <Link
          href="/"
          className="inline-block  cursor-pointer px-6 py-3 bg-gradient-to-r from-voxy-primary to-voxy-secondary text-white rounded-lg shadow-lg hover:opacity-90 transition"
        >
          Go Back Home
        </Link>
      </motion.div>
        </div>
      </div>

     
    </section>
  );
}
