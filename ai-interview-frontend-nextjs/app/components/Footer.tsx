"use client"
import { motion } from "framer-motion";

const Footer = () => {
  return (
          <footer className="mt-32 border-t border-gray-800 py-10 text-center text-gray-500">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          © {new Date().getFullYear()} Voxy AI. All rights reserved.
        </motion.p>
      </footer>
  )
}

export default Footer