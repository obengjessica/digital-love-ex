import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroOne from "@/assets/w1.jpg";
import heroTwo from "@/assets/w2.jpg";
import heroThree from "@/assets/w3.jpg";
import previewMain from "@/assets/w4.jpg";
import previewOne from "@/assets/d1.jpg";
import previewTwo from "@/assets/d2.jpg";
import previewThree from "@/assets/d3.jpg";
import previewFour from "@/assets/l2.jpg";

const Hero = () => {
  const images = useMemo(() => [heroOne, heroTwo, heroThree], []);
  const previewImages = useMemo(
    () => [previewOne, previewTwo, previewThree, previewFour],
    [],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExampleOpen, setIsExampleOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [images.length]);

  useEffect(() => {
    if (!isExampleOpen) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      setPreviewIndex((current) => (current + 1) % previewImages.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [isExampleOpen, previewImages.length]);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-white">
      {/* Background Images with Enhanced Overlay */}
      <div className="absolute inset-0">
        {images.map((src, index) => (
          <motion.div
            key={src}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{
              opacity: index === activeIndex ? 1 : 0,
            }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <img
              src={src}
              alt="Love story preview"
              className="h-full w-full object-cover"
            />
          </motion.div>
        ))}

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto text-center relative z-10 py-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/95 backdrop-blur-xl rounded-full mb-8 border border-red-200/50 shadow-xl shadow-red-500/10"
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Heart size={18} className="text-red-500 fill-red-500" />
            </motion.div>
            <span className="text-sm font-semibold text-red-700 tracking-wide">
              Valentine's Day
            </span>
          </motion.div>
        </motion.div>

        {/* Main Headline with Stagger Effect */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <motion.span
              className="block text-white drop-shadow-2xl"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Every Love Story
            </motion.span>
            <motion.span
              className="block bg-gradient-to-r from-red-300 via-pink-200 to-rose-300 bg-clip-text text-transparent drop-shadow-2xl"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Deserves Its Own Page
            </motion.span>
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          className="text-xl md:text-2xl lg:text-3xl text-white/95 mb-6 max-w-4xl mx-auto leading-relaxed font-light drop-shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          Turn your memories, your journey, and your unspoken feelings into a{" "}
          <span className="font-semibold text-pink-200">
            beautiful digital experience
          </span>{" "}
          made just for them.
        </motion.p>

        {/* Emotional tagline */}
        <motion.p
          className="text-base md:text-lg text-red-200 font-medium mb-8 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          Because some feelings are too precious for ordinary words.
        </motion.p>

        {/* Pricing Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <div className="inline-block bg-white/95 backdrop-blur-xl px-6 py-3 rounded-full mb-10 shadow-2xl shadow-red-500/20 border border-red-100">
            <p className="text-lg md:text-xl font-bold text-transparent bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text">
              Personalized Love Pages from GHS 30
            </p>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-10 py-7 text-lg rounded-full shadow-2xl shadow-red-500/40 hover:shadow-red-500/60 transition-all duration-300 group border-2 border-white/20"
            >
              <Link to="/created" className="flex items-center gap-2">
                <span className="font-semibold">Create Your Love Page</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Heart
                    className="group-hover:scale-110 transition-transform"
                    size={22}
                    fill="currentColor"
                  />
                </motion.div>
              </Link>
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white/90 bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 hover:border-white px-10 py-7 text-lg rounded-full shadow-xl group font-semibold"
              onClick={() => setIsExampleOpen(true)}
            >
              <span className="flex items-center gap-2">
                <span>See an Example</span>
                <ArrowRight
                  className="group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Features list */}
        <motion.div
          className="flex flex-wrap justify-center items-center gap-6 text-sm text-white/90 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          {[
            { icon: "✨", text: "No account needed" },
            { icon: "⚡", text: "Ready in minutes" },
            { icon: "🔗", text: "Share with a link" },
            { icon: "💝", text: "Made with love" },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + index * 0.1 }}
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.15)",
              }}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2"
          >
            <motion.div
              className="w-1.5 h-2 bg-white/70 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isExampleOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExampleOpen(false)}
          >
            <motion.div
              className="relative w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-3xl bg-white shadow-2xl"
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="absolute right-3 top-3 z-20 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-gray-700 shadow-lg sm:right-4 sm:top-4"
                onClick={() => setIsExampleOpen(false)}
              >
                Close
              </button>
              <div className="grid lg:grid-cols-[1.1fr_0.9fr] max-h-[85vh] overflow-y-auto pt-10 sm:pt-0">
                <div className="relative min-h-[220px]">
                  <img
                    src={previewMain}
                    alt="Kenn and Caprina"
                    className="h-64 w-full object-cover sm:h-72 lg:h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-xs uppercase tracking-[0.35em] text-rose-200">
                      Kenn & Caprina
                    </p>
                    <h3 className="text-2xl sm:text-3xl font-bold mt-2">
                      Married 4 years
                    </h3>
                    <p className="text-base text-rose-100 mt-1">
                      Two kids, countless memories, one forever story.
                    </p>
                  </div>
                </div>
                <div className="p-6 sm:p-8">
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-800">
                    A love note for Caprina
                  </h4>
                  <p className="text-gray-600 mt-3 leading-relaxed">
                    “From our first hello to every laugh we share with our
                    children, you are still my favorite story. Happy Valentine’s
                    Day, my forever Caprina.”
                  </p>
                  <div className="mt-6">
                    <p className="text-sm font-semibold text-rose-500 mb-3">
                      Circles of memories
                    </p>
                    <div className="relative h-24 overflow-hidden">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={previewImages[previewIndex]}
                          className="absolute inset-0 flex items-center gap-4"
                          initial={{ opacity: 0, x: 40 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -40 }}
                          transition={{ duration: 0.5 }}
                        >
                          {[
                            previewImages[previewIndex],
                            previewImages[
                              (previewIndex + 1) % previewImages.length
                            ],
                            previewImages[
                              (previewIndex + 2) % previewImages.length
                            ],
                          ].map((src) => (
                            <div
                              key={src}
                              className="h-16 w-16 sm:h-20 sm:w-20 rounded-full border-4 border-white shadow-md overflow-hidden"
                            >
                              <img
                                src={src}
                                alt="Love memory"
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ))}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;
