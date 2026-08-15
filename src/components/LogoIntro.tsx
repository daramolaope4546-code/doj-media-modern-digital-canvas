import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { DojLogo } from "./DojLogo";

export function LogoIntro() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        sessionStorage.setItem("doj_intro_played", "1");
      } catch {
        // Storage unavailable (e.g. private mode) — the intro simply replays next visit.
      }
      setVisible(false);
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b0a0d]"
        >
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
            >
              <DojLogo size={96} />
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-6 text-center"
            >
              <h1 className="font-display text-3xl font-bold tracking-tight text-white">
                DOJ <span style={{ color: "#f2c6cd" }}>MEDIA</span>
              </h1>
              <p className="mt-2 text-xs uppercase tracking-[0.35em] text-white/60">
                Create. Connect. Impact.
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
