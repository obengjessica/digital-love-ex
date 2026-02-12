import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="py-24 px-4">
      <motion.div
        className="max-w-4xl mx-auto text-center bg-gradient-to-br from-rose-500 via-pink-500 to-red-500 rounded-3xl p-12 md:p-16 shadow-2xl shadow-rose-500/40 relative overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, delay: 2 }}
          />
        </div>

        <div className="relative z-10">
          <Heart className="mx-auto mb-6 text-white" size={48} fill="white" />
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Create Magic?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Your perfect Valentine's experience is just minutes away. No sign-up
            required.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-rose-600 hover:bg-rose-50 px-6 sm:px-10 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold w-full sm:w-auto whitespace-normal text-center"
          >
            <Link to="/created" className="block">
              Create Your Love Experience
            </Link>
          </Button>
        </div>
      </motion.div>

      <div className="text-center mt-16 text-gray-500 text-sm">
        Made with{" "}
        <Heart className="inline w-4 h-4 text-rose-500 fill-rose-500 mx-1" />{" "}
        for Valentine's Day · Made by Jezzerr Labs
      </div>
    </section>
  );
};

export default CTA;
