import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { buildApiUrl } from "@/lib/api";

const LovePage = () => {
  const { slug } = useParams();
  const [status, setStatus] = useState("loading");
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchLovePage = async () => {
      try {
        const response = await fetch(buildApiUrl(`/api/love/${slug}`));
        if (!response.ok) {
          throw new Error("Love page not found.");
        }
        const result = await response.json();
        setData(result);
        setStatus("ready");
      } catch (error) {
        setStatus("error");
      }
    };

    fetchLovePage();
  }, [slug]);

  const parsed = useMemo(() => {
    if (!data) {
      return null;
    }

    const detail = data.data || {};
    return {
      senderName: data.senderName || detail.senderName || "Someone",
      partnerName: data.partnerName || detail.partnerName || "My Love",
      relationship: detail.relationship || "Our Love",
      relationshipDuration: detail.relationshipDuration || "Every day",
      firstEncounter: detail.firstEncounter || "",
      loveMessage: detail.loveMessage || "",
      surpriseTime: detail.surpriseTime || "",
      loveStoryNotes: detail.loveStoryNotes || "",
      pageColor: detail.pageColor || "#be185d",
      packageId: data.packageId || "basic",
      images: data.images || [],
      videos: data.videos || [],
      music: data.music || "",
    };
  }, [data]);

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-rose-50 flex items-center justify-center px-6">
        <p className="text-lg text-rose-600 font-semibold">
          Loading love page...
        </p>
      </main>
    );
  }

  if (status === "error" || !parsed) {
    return (
      <main className="min-h-screen bg-rose-50 flex items-center justify-center px-6">
        <p className="text-lg text-rose-600 font-semibold">
          This love page could not be found.
        </p>
      </main>
    );
  }

  const showPhotos = parsed.packageId !== "basic" && parsed.images.length > 0;
  const showVideos =
    parsed.packageId === "ultimate" && parsed.videos.length > 0;
  const showMusic = parsed.packageId === "ultimate" && Boolean(parsed.music);
  const accentStyle = { color: parsed.pageColor };
  const accentBg = { backgroundColor: parsed.pageColor };

  return (
    <main className="min-h-screen bg-rose-50">
      <section className="relative overflow-hidden">
        {parsed.images[0] && (
          <img
            src={parsed.images[0]}
            alt="Love cover"
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-950/90 via-rose-900/60 to-rose-900/30" />
        <div className="relative z-10 mx-auto max-w-5xl px-6 py-20 text-center">
          <motion.span
            className="inline-flex items-center rounded-full bg-white/15 px-4 py-1 text-sm uppercase tracking-[0.3em] text-rose-100"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            For {parsed.partnerName}
          </motion.span>
          <motion.h1
            className="mt-4 text-3xl md:text-5xl font-bold text-white"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {parsed.senderName}'s Love Story
          </motion.h1>
          <motion.p
            className="mt-3 text-lg text-rose-100"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {parsed.relationship} · {parsed.relationshipDuration}
          </motion.p>
        </div>
      </section>

      <section className="mx-auto -mt-10 max-w-4xl px-6 pb-16">
        <motion.div
          className="rounded-3xl bg-white p-8 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-lg font-semibold" style={accentStyle}>
                First encounter
              </h2>
              <p className="mt-2 text-gray-600 leading-relaxed">
                {parsed.firstEncounter}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold" style={accentStyle}>
                Surprise moment
              </h2>
              <p className="mt-2 text-gray-600 leading-relaxed">
                {parsed.surpriseTime}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold" style={accentStyle}>
              Love note
            </h2>
            <p className="mt-2 text-gray-700 italic leading-relaxed">
              {parsed.loveMessage}
            </p>
          </div>

          {showMusic && (
            <audio
              className="mt-6 w-full"
              controls
              autoPlay
              loop
              src={parsed.music}
            />
          )}
        </motion.div>

        {(parsed.loveStoryNotes || parsed.packageId !== "basic") && (
          <motion.div
            className="mt-10 rounded-3xl bg-white p-8 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-lg font-semibold" style={accentStyle}>
              Our love story
            </h2>
            <p className="mt-3 text-gray-700 italic leading-relaxed">
              {parsed.loveStoryNotes ||
                `From the first hello to every moment since, ${parsed.partnerName} remains the heart of ${parsed.senderName}'s story.`}
            </p>
          </motion.div>
        )}

        {showPhotos && (
          <motion.div
            className="mt-10 rounded-3xl bg-white p-8 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-lg font-semibold" style={accentStyle}>
              Memories
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {parsed.images.map((src) => (
                <div
                  key={src}
                  className="overflow-hidden rounded-2xl shadow-md"
                >
                  <img
                    src={src}
                    alt="Love memory"
                    className="h-56 w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {showVideos && (
          <motion.div
            className="mt-10 rounded-3xl bg-white p-8 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-lg font-semibold" style={accentStyle}>
              Love clips
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {parsed.videos.map((src) => (
                <video
                  key={src}
                  src={src}
                  controls
                  className="w-full rounded-2xl"
                />
              ))}
            </div>
          </motion.div>
        )}

        <div className="mt-12 text-center text-sm text-rose-400">
          Made with love · Powered by Jezzerr Labs
          <div
            className="mx-auto mt-3 h-1 w-24 rounded-full"
            style={accentBg}
          />
        </div>
      </section>
    </main>
  );
};

export default LovePage;
