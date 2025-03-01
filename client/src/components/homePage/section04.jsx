import { motion } from "framer-motion";
import FeaturedTourList from "./FeaturedTourList";

export default function Section04() {
  return (
    <section className="py-2 sm:py-6 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with animation */}
        <div className="mb-8 sm:mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-amber-500 font-medium text-base sm:text-lg mb-1 sm:mb-2 tracking-wide">EXPLORE</p>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 relative inline-block px-4">
              Our Featured Tours
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 sm:w-24 h-1 bg-amber-500 rounded-full"></span>
            </h2>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="relative">
          {/* Decorative circles - hidden on small screens */}
          <div className="hidden sm:block absolute -top-10 -left-10 w-40 h-40 bg-amber-200 rounded-full opacity-20 blur-3xl z-0"></div>
          <div className="hidden sm:block absolute -bottom-20 -right-20 w-60 h-60 bg-blue-200 rounded-full opacity-20 blur-3xl z-0"></div>
          
          {/* Tour list with fade-in animation */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10"
          >
            <FeaturedTourList />
          </motion.div>
        </div>
      </div>
    </section>
  );
}