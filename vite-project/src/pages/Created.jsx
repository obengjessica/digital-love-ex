import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { buildApiUrl } from "@/lib/api";
import heroImage from "@/assets/w1.jpg";
import galleryOne from "@/assets/w2.jpg";
import galleryTwo from "@/assets/d1.jpg";
import galleryThree from "@/assets/d2.jpg";
import galleryFour from "@/assets/d3.jpg";
import galleryFive from "@/assets/l2.jpg";

const PAYSTACK_PUBLIC_KEY = "pk_test_82e1bad2bde76775cd84cee6bab846d72433b0a3";

const backgroundPlaylist = [
  "/music/love.mp3",
  "/music/bh.mp3",
  "/music/perfect.mp3",
  "/music/syl.mp3",
  "/music/wml.mp3",
];

const packages = [
  {
    id: "basic",
    name: "Letter + Memories",
    price: 30,
    description: "A heartfelt letter and memories page without pictures.",
    includesPhotos: false,
    includesVideos: false,
    includesColor: false,
    includesLoveStory: false,
    includesMusic: false,
  },
  {
    id: "premium",
    name: "Premium Memories",
    price: 50,
    description: "Photos included with a richer premium layout.",
    includesPhotos: true,
    includesVideos: false,
    includesColor: true,
    includesLoveStory: true,
    includesMusic: false,
  },
  {
    id: "ultimate",
    name: "Ultimate Love Story",
    price: 80,
    description: "Videos, pictures, love stories, premium extras, and music.",
    includesPhotos: true,
    includesVideos: true,
    includesColor: true,
    includesLoveStory: true,
    includesMusic: true,
  },
];

const initialFormState = {
  senderName: "",
  partnerName: "",
  relationship: "",
  relationshipDuration: "",
  firstEncounter: "",
  loveMessage: "",
  whatsapp: "",
  surpriseTime: "",
  email: "",
  pageColor: "#f43f5e",
  loveStoryNotes: "",
};

const Created = () => {
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [formData, setFormData] = useState(initialFormState);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [musicFile, setMusicFile] = useState(null);
  const [isPaystackReady, setIsPaystackReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [whatsappLink, setWhatsappLink] = useState("");
  const audioRef = useRef(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [exampleIndex, setExampleIndex] = useState(0);

  const galleryImages = [
    { src: galleryOne, alt: "Sweet memory" },
    { src: galleryTwo, alt: "Beautiful moment" },
    { src: galleryThree, alt: "Love in focus" },
    { src: galleryFour, alt: "Valentine vibes" },
    { src: galleryFive, alt: "Forever together" },
  ];

  const selectedPackage = useMemo(
    () => packages.find((item) => item.id === selectedPackageId) || null,
    [selectedPackageId],
  );

  const canPay = Boolean(
    selectedPackage &&
    formData.email.trim() &&
    isPaystackReady &&
    !isSubmitting,
  );

  useEffect(() => {
    if (document.querySelector("script[data-paystack]")) {
      setIsPaystackReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.dataset.paystack = "true";
    script.onload = () => setIsPaystackReady(true);
    script.onerror = () => setIsPaystackReady(false);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (backgroundPlaylist.length > 0) {
      setCurrentTrackIndex(
        Math.floor(Math.random() * backgroundPlaylist.length),
      );
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setExampleIndex((prev) => (prev + 1) % galleryImages.length);
    }, 3500);

    return () => clearInterval(intervalId);
  }, [galleryImages.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || backgroundPlaylist.length === 0) {
      return;
    }

    audio.volume = 0.3;
    audio.src = backgroundPlaylist[currentTrackIndex];
    audio.play().catch(() => undefined);
  }, [currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const tryPlayOnInteraction = () => {
      if (audio.paused) {
        audio.play().catch(() => undefined);
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
    if (backgroundPlaylist.length <= 1) {
      return prevIndex;
    }

    let nextIndex = prevIndex;
    while (nextIndex === prevIndex) {
      nextIndex = Math.floor(Math.random() * backgroundPlaylist.length);
    }

    return nextIndex;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePackageChange = (event) => {
    setSelectedPackageId(event.target.value);
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);
    setImages(files);
  };

  const handleVideoChange = (event) => {
    const files = Array.from(event.target.files || []);
    setVideos(files);
  };

  const handleMusicChange = (event) => {
    const file = event.target.files?.[0] || null;
    setMusicFile(file);
  };

  const submitToBackend = async (reference) => {
    if (!selectedPackage) {
      return;
    }

    const payload = new FormData();
    payload.append("packageId", selectedPackage.id);
    payload.append("packageName", selectedPackage.name);
    payload.append("packagePrice", String(selectedPackage.price));
    payload.append("paymentReference", reference);
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });

    images.forEach((file) => payload.append("images", file));
    videos.forEach((file) => payload.append("videos", file));
    if (musicFile) {
      payload.append("music", musicFile);
    }

    const response = await fetch(buildApiUrl("/api/create-love-page"), {
      method: "POST",
      body: payload,
    });

    if (!response.ok) {
      throw new Error("Failed to submit the love page details.");
    }

    const data = await response.json();
    return data;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");
    setWhatsappLink("");

    if (!selectedPackage) {
      setSubmitError("Please choose a package to continue.");
      return;
    }

    if (!isPaystackReady || !window.PaystackPop) {
      setSubmitError("Paystack is not ready. Please try again in a moment.");
      return;
    }

    if (!formData.email.trim()) {
      setSubmitError("Please provide your email for the payment receipt.");
      return;
    }

    setIsSubmitting(true);

    try {
      const handlePaymentSuccess = async (response) => {
        try {
          const result = await submitToBackend(response.reference);
          const link = result?.link || "";
          const digits = formData.whatsapp.replace(/[^0-9]/g, "");
          const sender = formData.senderName || "Someone";
          const partner = formData.partnerName || "my love";
          const message =
            `Hi ${partner} 💖, ${sender} sent a romantic message for you as a first ` +
            `Val's gift to show how deeply and special you're. ` +
            `Check it out here: ${link} 💌 and have a nice and memorable Val's. 🌹`;
          const waLink = digits
            ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
            : "";

          if (waLink) {
            setWhatsappLink(waLink);
            window.open(waLink, "_blank");
          }

          setSubmitSuccess(
            link
              ? `Payment successful. Your love page is being created. Link: ${link}`
              : "Payment successful. Your love page is being created.",
          );
        } catch (error) {
          setSubmitError(error.message || "Submission failed.");
        } finally {
          setIsSubmitting(false);
        }
      };

      const reference = `love_${Date.now()}`;
      const handler = window.PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: formData.email,
        amount: selectedPackage.price * 100,
        currency: "GHS",
        ref: reference,
        metadata: {
          custom_fields: [
            {
              display_name: "Sender Name",
              variable_name: "sender_name",
              value: formData.senderName,
            },
            {
              display_name: "Partner Name",
              variable_name: "partner_name",
              value: formData.partnerName,
            },
            {
              display_name: "Package",
              variable_name: "package",
              value: selectedPackage.name,
            },
          ],
        },
        callback: (response) => {
          handlePaymentSuccess(response);
        },
        onClose: () => {
          setIsSubmitting(false);
          setSubmitError("Payment window closed before completion.");
        },
      });

      if (!handler || typeof handler.openIframe !== "function") {
        throw new Error("Paystack failed to initialize.");
      }

      handler.openIframe();
    } catch (error) {
      setIsSubmitting(false);
      setSubmitError(error.message || "Unable to open Paystack.");
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <audio
        ref={audioRef}
        preload="auto"
        playsInline
        onEnded={() => setCurrentTrackIndex((prev) => getNextTrackIndex(prev))}
      >
        Your browser does not support the audio element.
      </audio>
      <section className="relative overflow-hidden bg-red-950">
        <img
          src={heroImage}
          alt="Love memories"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/90 via-red-900/70 to-red-900/40" />
        <div className="absolute inset-0">
          {[
            { x: "10%", y: "20%", size: 18, delay: 0.1 },
            { x: "80%", y: "15%", size: 22, delay: 0.4 },
            { x: "15%", y: "75%", size: 16, delay: 0.2 },
            { x: "85%", y: "70%", size: 20, delay: 0.6 },
          ].map((heart, index) => (
            <motion.div
              key={`hero-heart-${index}`}
              className="absolute text-rose-200/60"
              style={{ left: heart.x, top: heart.y }}
              animate={{ y: [0, -12, 0], opacity: [0.3, 0.9, 0.3] }}
              transition={{ duration: 6, repeat: Infinity, delay: heart.delay }}
            >
              <span style={{ fontSize: heart.size }}>💖</span>
            </motion.div>
          ))}
        </div>
        <div className="relative z-10 mx-auto max-w-5xl px-6 py-20 text-center">
          <motion.p
            className="text-sm uppercase tracking-[0.35em] text-red-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Create a digital love gift
          </motion.p>
          <motion.h1
            className="mt-4 text-3xl md:text-5xl font-bold text-white"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Build a love page your partner will never forget
          </motion.h1>
          <motion.p
            className="mt-4 text-lg text-red-100"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Select a plan, share your story, and we will craft a one-page
            surprise to deliver via WhatsApp.
          </motion.p>
          <motion.div
            className="mx-auto mt-8 h-1 w-32 rounded-full bg-gradient-to-r from-rose-200/30 via-white/80 to-rose-200/30"
            animate={{ opacity: [0.4, 1, 0.4], scaleX: [0.9, 1, 0.9] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-lg text-gray-700 mb-10">
          Start by selecting the plan that matches your surprise. The selected
          plan will stay highlighted so you always know what you picked.
        </p>

        <section className="border border-red-100 rounded-2xl p-8 bg-red-50/40">
          <h2 className="text-2xl font-semibold text-red-600 mb-6">
            Start Creating
          </h2>

          <div className="grid gap-4 md:grid-cols-3 mb-4">
            {packages.map((pkg) => (
              <label
                key={pkg.id}
                className={`cursor-pointer rounded-2xl border p-5 shadow-sm transition hover:border-red-300 hover:shadow-md ${
                  selectedPackageId === pkg.id
                    ? "border-red-400 bg-white ring-2 ring-red-200"
                    : "border-red-100 bg-white/70"
                }`}
              >
                <input
                  type="radio"
                  name="package"
                  value={pkg.id}
                  checked={selectedPackageId === pkg.id}
                  onChange={handlePackageChange}
                  className="sr-only"
                />
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {pkg.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>
                <p className="text-xl font-bold text-red-600">
                  GHS {pkg.price}
                </p>
                {selectedPackageId === pkg.id && (
                  <span className="mt-3 inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                    Selected plan
                  </span>
                )}
              </label>
            ))}
          </div>

          <p className="text-sm text-red-600 font-semibold mb-6">
            {selectedPackage
              ? `Selected plan: ${selectedPackage.name}`
              : "Please select a plan to unlock the right fields below."}
          </p>

          <form className="grid gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Your name
              </label>
              <input
                type="text"
                name="senderName"
                value={formData.senderName}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full rounded-xl border border-red-100 bg-white px-4 py-3 text-gray-800 shadow-sm focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-100"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Partner name
              </label>
              <input
                type="text"
                name="partnerName"
                value={formData.partnerName}
                onChange={handleChange}
                placeholder="Enter their full name"
                className="w-full rounded-xl border border-red-100 bg-white px-4 py-3 text-gray-800 shadow-sm focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-100"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Relationship with this person
              </label>
              <input
                type="text"
                name="relationship"
                value={formData.relationship}
                onChange={handleChange}
                placeholder="Girlfriend, boyfriend, fiance, husband, wife"
                className="w-full rounded-xl border border-red-100 bg-white px-4 py-3 text-gray-800 shadow-sm focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-100"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-gray-700">
                How long has the relationship lasted?
              </label>
              <input
                type="text"
                name="relationshipDuration"
                value={formData.relationshipDuration}
                onChange={handleChange}
                placeholder="e.g., 2 years, 6 months"
                className="w-full rounded-xl border border-red-100 bg-white px-4 py-3 text-gray-800 shadow-sm focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-100"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Your first encounter
              </label>
              <textarea
                name="firstEncounter"
                rows={4}
                value={formData.firstEncounter}
                onChange={handleChange}
                placeholder="Describe the first time you met"
                className="w-full rounded-xl border border-red-100 bg-white px-4 py-3 text-gray-800 shadow-sm focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-100"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-gray-700">
                What do you want to share with your love?
              </label>
              <textarea
                name="loveMessage"
                rows={5}
                value={formData.loveMessage}
                onChange={handleChange}
                placeholder="Share your message, memories, or wishes"
                className="w-full rounded-xl border border-red-100 bg-white px-4 py-3 text-gray-800 shadow-sm focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-100"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-gray-700">
                When should your partner meet you for the gift?
              </label>
              <input
                type="text"
                name="surpriseTime"
                value={formData.surpriseTime}
                onChange={handleChange}
                placeholder="Date, time, and place (or surprise note)"
                className="w-full rounded-xl border border-red-100 bg-white px-4 py-3 text-gray-800 shadow-sm focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-100"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-gray-700">
                WhatsApp contact to receive the link
              </label>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="e.g., +233 24 000 0000"
                className="w-full rounded-xl border border-red-100 bg-white px-4 py-3 text-gray-800 shadow-sm focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-100"
              />
              <p className="text-xs text-gray-500">
                We will send the love page link to this number.
              </p>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Email for payment receipt
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-red-100 bg-white px-4 py-3 text-gray-800 shadow-sm focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-100"
              />
            </div>

            {selectedPackage?.includesPhotos && (
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Upload your pictures
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full rounded-xl border border-dashed border-red-200 bg-white px-4 py-3 text-gray-800"
                />
              </div>
            )}

            {selectedPackage?.includesVideos && (
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Upload your videos
                </label>
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={handleVideoChange}
                  className="w-full rounded-xl border border-dashed border-red-200 bg-white px-4 py-3 text-gray-800"
                />
              </div>
            )}

            {selectedPackage?.includesMusic && (
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Upload one love song (MP3)
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleMusicChange}
                  className="w-full rounded-xl border border-dashed border-red-200 bg-white px-4 py-3 text-gray-800"
                />
                <p className="text-xs text-gray-500">
                  This song will play on the love page.
                </p>
              </div>
            )}

            {selectedPackage?.includesColor && (
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Choose your page color
                </label>
                <input
                  type="color"
                  name="pageColor"
                  value={formData.pageColor}
                  onChange={handleChange}
                  className="h-12 w-32 rounded-xl border border-red-100 bg-white"
                />
              </div>
            )}

            {selectedPackage?.includesLoveStory && (
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Love story highlights
                </label>
                <textarea
                  name="loveStoryNotes"
                  rows={4}
                  value={formData.loveStoryNotes}
                  onChange={handleChange}
                  placeholder="Share key moments to inspire the love story"
                  className="w-full rounded-xl border border-red-100 bg-white px-4 py-3 text-gray-800 shadow-sm focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-100"
                />
              </div>
            )}

            {submitError && (
              <p className="text-sm text-red-600 font-semibold">
                {submitError}
              </p>
            )}
            {submitSuccess && (
              <p className="text-sm text-green-600 font-semibold">
                {submitSuccess}
              </p>
            )}
            {whatsappLink && (
              <a
                className="text-sm font-semibold text-rose-600 underline"
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
              >
                Click here to open WhatsApp and send the link
              </a>
            )}

            <button
              type="submit"
              disabled={!canPay}
              className="w-full rounded-full bg-gradient-to-r from-red-600 to-pink-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-red-500/30 transition hover:from-red-700 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Processing Payment..." : "Pay with Paystack"}
            </button>
            {!isPaystackReady && (
              <p className="text-xs text-gray-500 text-center">
                Loading Paystack... please wait a moment.
              </p>
            )}
          </form>
        </section>

        <section id="example" className="mt-16">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">
            Love Page Example
          </h2>
          <p className="text-gray-700 mb-6">
            See how a generated page can look for Kenn & Caprina.
          </p>
          <div className="rounded-3xl border border-rose-100 bg-white shadow-xl overflow-hidden">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative">
                <img
                  src={galleryTwo}
                  alt="Kenn and Caprina"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-sm uppercase tracking-[0.3em] text-rose-200">
                    Kenn & Caprina
                  </p>
                  <h3 className="text-3xl font-bold mt-2">Married 4 years</h3>
                  <p className="text-base text-rose-100 mt-1">
                    Two kids, countless memories, one forever story.
                  </p>
                </div>
              </div>
              <div className="p-8 flex flex-col justify-between">
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">
                    A love note from Kenn
                  </h4>
                  <p className="text-gray-600 mt-3 leading-relaxed">
                    “From our first hello to every laugh we share with our
                    children, you are still my favorite story. Happy Valentine’s
                    Day, my forever Caprina.”
                  </p>
                </div>
                <div className="mt-8">
                  <p className="text-sm font-semibold text-rose-500 mb-3">
                    Moments in circles
                  </p>
                  <div className="relative h-28 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={galleryImages[exampleIndex].src}
                        className="absolute inset-0 flex items-center gap-4"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.6 }}
                      >
                        {[
                          galleryImages[exampleIndex],
                          galleryImages[
                            (exampleIndex + 1) % galleryImages.length
                          ],
                          galleryImages[
                            (exampleIndex + 2) % galleryImages.length
                          ],
                        ].map((image) => (
                          <div
                            key={image.src}
                            className="h-20 w-20 rounded-full border-4 border-white shadow-md overflow-hidden"
                          >
                            <img
                              src={image.src}
                              alt={image.alt}
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
          </div>
        </section>

        <div className="text-center mt-16 text-gray-500 text-sm">
          Made by Jezzerr Labs
        </div>
      </div>
    </main>
  );
};

export default Created;
