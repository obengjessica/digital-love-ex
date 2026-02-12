import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Image,
  Music,
  Share2,
  Quote,
  Sparkles,
  HeartHandshake,
  Volume2,
  VolumeX,
} from "lucide-react";
import loveOne from "@/assets/w1.jpg";
import loveTwo from "@/assets/w2.jpg";
import loveThree from "@/assets/w3.jpg";
import loveFour from "@/assets/w4.jpg";
import loveFive from "@/assets/d1.jpg";
import loveSix from "@/assets/d2.jpg";
import loveSeven from "@/assets/d3.jpg";
import loveEight from "@/assets/l.jpg";
import loveNine from "@/assets/l2.jpg";
import loveTen from "@/assets/ll (2).jpg";

const features = [
  {
    icon: Heart,
    title: "Personal Messages",
    description: "Write heartfelt notes that appear throughout the experience",
  },
  {
    icon: Image,
    title: "Photo Memories",
    description: "Add your favorite photos together to relive special moments",
  },
  {
    icon: Music,
    title: "Your Love Song",
    description: "Set the mood with a song that means something to both of you",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description: "Get a unique link to share your romantic creation instantly",
  },
];

const loveQuotes = [
  {
    quote:
      "Love is not about how many days, months, or years you have been together. It's about how much you love each other every single day.",
    author: "Unknown",
  },
  {
    quote:
      "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.",
    author: "Maya Angelou",
  },
  {
    quote: "The best thing to hold onto in life is each other.",
    author: "Audrey Hepburn",
  },
  {
    quote:
      "You don't love someone for their looks, or their clothes, or their fancy car, but because they sing a song only you can hear.",
    author: "Oscar Wilde",
  },
];

const relationshipAdvice = [
  {
    icon: HeartHandshake,
    title: "Communication is Key",
    message:
      "Talk openly, listen deeply, and never let the sun go down on your anger. A simple conversation can heal a thousand wounds.",
  },
  {
    icon: Sparkles,
    title: "Keep the Spark Alive",
    message:
      "Surprise each other with little gestures. Love grows in the small moments of thoughtfulness and care.",
  },
  {
    icon: Heart,
    title: "Love Takes Effort",
    message:
      "Choose to love every single day. Real love isn't just a feeling—it's a commitment to show up, even on the hard days.",
  },
];

const healingMessages = [
  {
    title: "You Are Worthy of Love",
    message:
      "Your heart may be broken now, but remember: you are whole on your own. The right love will find you when you're ready.",
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Healing Takes Time",
    message:
      "It's okay to grieve. It's okay to cry. It's okay to take all the time you need. Your healing journey is valid, and brighter days are coming.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "This Pain is Temporary",
    message:
      "What feels impossible today will become a distant memory tomorrow. You're stronger than you know, and love will find you again.",
    color: "from-rose-500 to-orange-500",
  },
];

const playlist = [
  {
    title: "Love",
    src: "/music/love.mp3",
  },
  {
    title: "Bh",
    src: "/music/bh.mp3",
  },
  {
    title: "Perfect",
    src: "/music/perfect.mp3",
  },
  {
    title: "Syl",
    src: "/music/syl.mp3",
  },
  {
    title: "Wml",
    src: "/music/wml.mp3",
  },
];

const loveMomentImages = [
  { src: loveOne, alt: "Romantic glance" },
  { src: loveTwo, alt: "Golden hour memory" },
  { src: loveThree, alt: "Soft smile" },
  { src: loveFour, alt: "Forever moment" },
];

const loveGalleryImages = [
  { src: loveFive, alt: "Sweet embrace" },
  { src: loveSix, alt: "Shared laughter" },
  { src: loveSeven, alt: "First dance" },
  { src: loveEight, alt: "Warm hugs" },
  { src: loveNine, alt: "Sunset promise" },
  { src: loveTen, alt: "Forever together" },
];

const floatingHearts = [
  { x: "10%", y: "15%", size: 18, delay: 0.2 },
  { x: "85%", y: "12%", size: 22, delay: 0.6 },
  { x: "20%", y: "70%", size: 14, delay: 0.4 },
  { x: "78%", y: "75%", size: 16, delay: 0.1 },
];

const floatingEmojis = [
  { x: "6%", y: "35%", delay: 0.1, size: "text-xl" },
  { x: "90%", y: "30%", delay: 0.4, size: "text-2xl" },
  { x: "14%", y: "88%", delay: 0.2, size: "text-lg" },
  { x: "84%", y: "88%", delay: 0.6, size: "text-xl" },
];

const Features = () => {
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  useEffect(() => {
    // Start from a random track so repeat visits vary.
    if (playlist.length > 0) {
      const startIndex = Math.floor(Math.random() * playlist.length);
      setCurrentTrackIndex(startIndex);
    }

    // Rotate quotes every 8 seconds
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % loveQuotes.length);
    }, 8000);

    return () => clearInterval(quoteInterval);
  }, []);

  useEffect(() => {
    // Auto-play background music for the current track
    const audio = audioRef.current;
    if (audio && playlist.length > 0) {
      audio.volume = 0.3; // Set to 30% volume
      audio.src = playlist[currentTrackIndex].src;
      audio.play().catch((error) => {
        console.log("Auto-play prevented by browser:", error);
      });
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const tryPlayOnInteraction = () => {
      if (audio.paused) {
        audio.play().catch((error) => {
          console.log("Interaction play blocked:", error);
        });
      }
    };

    const events = ["pointerdown", "touchstart", "keydown", "scroll"];
    events.forEach((eventName) => {
      window.addEventListener(eventName, tryPlayOnInteraction, {
        passive: true,
      });
    });

    return () => {
      events.forEach((eventName) => {
        window.removeEventListener(eventName, tryPlayOnInteraction);
      });
    };
  }, []);

  const getNextTrackIndex = (prevIndex) => {
    if (playlist.length <= 1) {
      return prevIndex;
    }

    let nextIndex = prevIndex;
    while (nextIndex === prevIndex) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    }

    return nextIndex;
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) {
      return;
    }

    audio.currentTime = audio.duration * 0.5;
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const nextMuted = !isMuted;
    audio.muted = nextMuted;
    setIsMuted(nextMuted);

    if (!nextMuted) {
      audio.play().catch((error) => {
        console.log("Audio play blocked:", error);
      });
    }
  };

  return (
    <>
      {/* Background Music */}
      <audio
        ref={audioRef}
        preload="auto"
        playsInline
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setCurrentTrackIndex((prev) => getNextTrackIndex(prev))}
      >
        Your browser does not support the audio element.
      </audio>

      {/* Music Control Button */}
      <motion.button
        onClick={toggleMute}
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-br from-rose-500 to-pink-600 text-white p-4 rounded-full shadow-2xl hover:shadow-rose-500/50 transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </motion.button>

      <section className="py-24 px-4 bg-gradient-to-b from-white via-rose-50/30 to-white">
        <div className="max-w-6xl mx-auto relative">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-16 left-8 h-40 w-40 rounded-full bg-rose-200/30 blur-3xl" />
            <div className="absolute top-20 right-10 h-32 w-32 rounded-full bg-pink-200/40 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-red-200/20 blur-3xl" />
          </div>

          {floatingHearts.map((heart, index) => (
            <motion.div
              key={index}
              className="absolute text-rose-300/60"
              style={{ left: heart.x, top: heart.y }}
              animate={{ y: [0, -12, 0], opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 6, repeat: Infinity, delay: heart.delay }}
            >
              <Heart size={heart.size} fill="currentColor" />
            </motion.div>
          ))}

          {floatingEmojis.map((emoji, index) => (
            <motion.div
              key={`emoji-${index}`}
              className={`absolute ${emoji.size} select-none`}
              style={{ left: emoji.x, top: emoji.y }}
              animate={{ y: [0, -10, 0], opacity: [0.3, 0.9, 0.3] }}
              transition={{ duration: 7, repeat: Infinity, delay: emoji.delay }}
            >
              💖
            </motion.div>
          ))}
          {/* Rotating Love Quote Section */}
          <motion.div
            className="mb-20 relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="max-w-4xl mx-auto text-center relative">
              <Quote
                className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-rose-200"
                size={60}
              />
              <motion.div
                key={currentQuoteIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}
                className="pt-12"
              >
                <p className="text-2xl md:text-3xl font-serif italic text-gray-700 mb-4 leading-relaxed">
                  "{loveQuotes[currentQuoteIndex].quote}"
                </p>
                <p className="text-rose-600 font-semibold">
                  — {loveQuotes[currentQuoteIndex].author}
                </p>
              </motion.div>
              <div className="flex justify-center gap-2 mt-6">
                {loveQuotes.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentQuoteIndex
                        ? "w-8 bg-rose-500"
                        : "w-2 bg-rose-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Everything You Need to Express Your Love
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Simple, beautiful tools to create something truly special
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-rose-100"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-rose-500/30">
                  <feature.icon size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-rose-500 font-semibold">
                Love Moments
              </p>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mt-4 mb-4">
                Turn memories into a cinematic love story
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                We blend your words, dates, and surprises into a polished page
                that feels personal, romantic, and unforgettable.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  "Personalized pages",
                  "Premium visuals",
                  "Instant sharing",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {loveMomentImages.map((image, index) => (
                <motion.div
                  key={image.src}
                  className={`overflow-hidden rounded-2xl shadow-lg ${
                    index === 1 ? "mt-6" : ""
                  } ${index === 2 ? "-mt-6" : ""}`}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-48 w-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="mb-24"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="text-center mb-10">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-800">
                Love Gallery
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto mt-3">
                A sneak peek of the dreamy visuals your partner will see.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {loveGalleryImages.map((image, index) => (
                <motion.div
                  key={image.src}
                  className={`overflow-hidden rounded-2xl shadow-lg ${
                    index === 1 ? "md:row-span-2" : ""
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className={`w-full object-cover ${
                      index === 1 ? "h-full" : "h-56"
                    }`}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Relationship Advice Section */}
          <motion.div
            className="mb-24"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Words of Wisdom for Lasting Love
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Timeless advice to nurture and strengthen your relationship
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {relationshipAdvice.map((advice, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-white to-rose-50 rounded-xl p-8 shadow-md border border-rose-100"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center">
                      <advice.icon size={32} className="text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                    {advice.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {advice.message}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Heartbreak Healing Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12">
              <Heart className="mx-auto mb-4 text-rose-500" size={48} />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                For Hearts That Need Healing
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                If you're going through a difficult time, know that you're not
                alone. These words are for you.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {healingMessages.map((message, index) => (
                <motion.div
                  key={index}
                  className={`bg-gradient-to-br ${message.color} rounded-2xl p-8 text-white shadow-xl`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <h3 className="text-2xl font-bold mb-4">{message.title}</h3>
                  <p className="text-white/95 leading-relaxed text-lg">
                    {message.message}
                  </p>
                  <div className="mt-6 flex justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Heart size={32} fill="white" className="opacity-50" />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Additional Comfort Message */}
            <motion.div
              className="mt-12 max-w-3xl mx-auto text-center bg-white rounded-xl p-8 shadow-lg border-2 border-rose-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Sparkles className="mx-auto mb-4 text-rose-500" size={40} />
              <p className="text-xl text-gray-700 leading-relaxed italic">
                "Remember: Every ending is a new beginning. Your story isn't
                over—it's just turning the page to a beautiful new chapter. You
                deserve love, joy, and happiness. And it's coming for you."
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Features;
