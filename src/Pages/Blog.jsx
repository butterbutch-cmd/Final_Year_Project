import { useEffect, useRef, useState } from "react";
import {Droplets,Sun,Thermometer,Flower2,Sparkles,} from "lucide-react";
import Header from "../Components/Header/Header";
import Footer from "../Components/Header/Footer";
import blog1 from "../assets/image/blog1.jpg";
import user1 from "../assets/image/user1.gif"; 
import blueHydrangea from "../assets/image/blue.jpg";
import pinkHydrangea from "../assets/image/pink.jpg";

/* ─────────────────────────────────────────
   Typography tokens  (match existing site)
───────────────────────────────────────── */
const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans = { fontFamily: "'DM Sans', sans-serif" };

/* ─────────────────────────────────────────
   Scroll-reveal hook
───────────────────────────────────────── */
function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, on];
}

/* ─────────────────────────────────────────
   Reusable animated wrapper
───────────────────────────────────────── */
function Reveal({ children, className = "", delay = 0, style = {} }) {
  const [ref, on] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: on ? 1 : 0,
        transform: on ? "translateY(0px)" : "translateY(30px)",
        transition: `opacity 0.85s cubic-bezier(.16,1,.3,1) ${delay}s,
                     transform 0.85s cubic-bezier(.16,1,.3,1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────
   pH Colour Gradient Bar
───────────────────────────────────────── */
function PHBar() {
  return (
    <div
      className="rounded-3xl p-8 my-10"
      style={{ background: "#f7f4ee", border: "1px solid #e0d8cc" }}
    >
      <p
        className="text-center text-xs tracking-[0.25em] uppercase mb-6"
        style={{ ...sans, color: "#7a9e7e" }}
      >
        ✦ Soil pH &amp; Hydrangea Colour Guide
      </p>
      <div
        className="h-12 rounded-2xl overflow-hidden flex shadow-inner mb-3"
        style={{ background: "linear-gradient(90deg,#3b6fa0,#5b7fc4,#7b6fa0,#b87a9a,#d4638a)" }}
      >
        {[["pH 4–5", "Blue"], ["pH 5.5", "Violet"], ["pH 6–6.5", "Lavender"], ["pH 7+", "Pink"]].map(([ph, col]) => (
          <div key={ph} className="flex-1 flex flex-col items-center justify-center">
            <span className="text-white text-xs font-semibold leading-none" style={sans}>{col}</span>
            <span className="text-white/60 text-[9px] mt-0.5" style={sans}>{ph}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs mt-1" style={{ ...sans, color: "#9a8a7a" }}>
        <span>← Acidic</span>
        <span>Neutral</span>
        <span>Alkaline →</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE COMPONENT – only hydrangea content remains
───────────────────────────────────────── */
export default function Blog() {
  const [heroReady, setHeroReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ background: "#faf8f4", ...sans, color: "#2a2a2a", overflowX: "hidden" }}>
      <Header />

      {/* ── TOP TITLE BANNER ── */}
      <div
        className="relative px-6 lg:px-14 pt-10 pb-16 overflow-hidden"
        style={{ ...sans }}
      >
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage: `url(${blog1})`,
            transform: "scale(1.03)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, rgba(10,20,14,0.78) 0%, rgba(10,20,14,0.45) 55%, rgba(10,20,14,0.30) 100%)",
          }}
        />

        <div className="relative z-10">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#d7e6d0] mb-2">
            ✦ Collection
          </p>
          <h1
            className="font-light text-[#f7f4ee] m-0 leading-tight"
            style={{ ...serif, fontSize: "clamp(32px, 4vw, 48px)" }}
          >
            Blogs
          </h1>
          <p className="mt-3 text-[#e3f0dc] text-sm max-w-md" style={sans}>
            Stories, care guides, and inspiration for the modern plant collector.
          </p>
        </div>
      </div>

      {/* ─────────────────────────────────────
           HERO SECTION (featured story) – now with white overlay
      ───────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: "92vh", minHeight: 560 }}>
        {/* hero background image */}
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1597070037697-e3f22d8e3b66?w=1600&auto=format&fit=crop')`,
            transform: "scale(1.04)",
            transition: "transform 10s ease-out",
          }}
        />

        {/* ✅ NEW WHITE OVERLAYS (matching #faf8f4) */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(250,248,244,0.88) 0%, rgba(250,248,244,0.75) 45%, rgba(250,248,244,0.55) 100%)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(250,248,244,0.75) 0%, transparent 55%)" }}
        />

        {/* decorative rings – now subtle dark instead of green */}
        <div className="absolute top-16 right-16 w-80 h-80 rounded-full border hidden lg:block pointer-events-none" style={{ borderColor: "rgba(26,51,32,0.10)" }} />
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full border hidden lg:block pointer-events-none" style={{ borderColor: "rgba(26,51,32,0.08)" }} />
        <div className="absolute top-24 right-24 w-48 h-48 rounded-full border hidden lg:block pointer-events-none" style={{ borderColor: "rgba(26,51,32,0.06)" }} />

        <div
          className="relative z-10 h-full flex flex-col justify-end px-8 md:px-16 lg:px-24 pb-20"
          style={{ opacity: heroReady ? 1 : 0, transition: "opacity 1.4s ease 0.15s" }}
        >
          <div className="max-w-3xl">
            {/* ✅ updated text colours for white background */}
            <p
              className="text-[11px] tracking-[0.35em] uppercase mb-5"
              style={{ ...sans, color: "#5a6a5a" }}
            >
              ✦ Featured Story &nbsp;·&nbsp; May 2025
            </p>

            <h1
              className="font-normal leading-none mb-6"
              style={{ ...serif, fontSize: "clamp(36px, 5.8vw, 74px)", lineHeight: 1.04, color: "#1a3320" }}
            >
              The Magic of Hydrangeas:<br />
              <em style={{ color: "#4a7c59", fontStyle: "italic" }}>
                Nature's Colour‑Changing Flower
              </em>
            </h1>

            <p
              className="leading-relaxed mb-10 max-w-xl"
              style={{ ...sans, fontSize: "clamp(14px, 1.3vw, 17px)", lineHeight: 1.85, color: "#4a5568" }}
            >
              Few plants captivate the gardener's heart quite like hydrangeas — blooms that silently read the earth beneath them and paint themselves in colours dictated entirely by soil acidity. Discover the science, the folklore, and the breathtaking beauty of nature's most responsive flower.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                className="px-8 py-3.5 text-sm font-medium tracking-wide rounded-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                style={{ ...sans, background: "#7a9e7e", color: "white" }}
              >
                Read Article ↓
              </button>
              <button
                className="px-8 py-3.5 text-sm font-medium tracking-wide rounded-full transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
                style={{
                  ...sans,
                  background: "transparent",
                  color: "#1a3320",
                  border: "1px solid #1a3320",
                }}
              >
                Explore Plants
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* rest of the page remains untouched */}
      <section className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <article className="lg:col-span-8">
            <Reveal>
              <div className="flex items-center gap-3 mb-9 text-xs tracking-widest uppercase" style={{ ...sans, color: "#7a9e7e" }}>
                <span>Plant Science</span>
                <span className="inline-block w-8 h-px bg-current" />
                <span>12 min read</span>
                <span className="inline-block w-8 h-px bg-current" />
                <span>Karun</span>   {/* author name already present, unchanged */}
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <h2 className="font-normal leading-tight mb-6" style={{ ...serif, fontSize: "clamp(26px, 3.5vw, 44px)", color: "#1a3320" }}>
                What Are Hydrangeas?
              </h2>
              <p className="mb-6" style={{ ...sans, color: "#4a5568", lineHeight: 1.95, fontSize: 15 }}>
                Hydrangeas (<em>Hydrangea macrophylla</em>) are flowering shrubs native to East Asia and the Americas. Their name is drawn from the Greek words for water (<em>hydra</em>) and vessel (<em>angos</em>), a poetic nod to their cup-shaped flower clusters and legendary thirst for moisture. Cultivated in Japan for centuries before sweeping through European cottage gardens in the 18th century, they carry both scientific fascination and romantic heritage.
              </p>
              <p style={{ ...sans, color: "#4a5568", lineHeight: 1.95, fontSize: 15 }}>
                What makes hydrangeas truly extraordinary — and unlike nearly any other flowering plant — is their ability to change colour in direct response to the chemistry of the soil beneath them. Plant one in your garden, and it will tell you something true about your earth.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="my-12">
              <div className="relative rounded-3xl overflow-hidden" style={{ height: 430 }}>
                <img
                  src={blueHydrangea}
                  alt="Blue hydrangeas in acidic soil"
                  className="w-full h-full object-cover"
                  style={{ transition: "transform 8s ease", transform: "scale(1.02)" }}
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,28,18,0.65) 0%, transparent 55%)" }} />
                <div className="absolute bottom-7 left-8 right-8 flex items-end justify-between">
                  <p className="text-white/60 text-xs tracking-widest uppercase" style={sans}>
                    Blue Hydrangeas in Acidic Soil · pH 4–5
                  </p>
                  <span className="text-xs px-3 py-1.5 rounded-full text-white" style={{ ...sans, background: "rgba(122,158,126,0.6)", backdropFilter: "blur(6px)" }}>
                    Acidic
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <h2 className="font-normal leading-tight mb-6" style={{ ...serif, fontSize: "clamp(24px, 3vw, 40px)", color: "#1a3320" }}>
                Why Hydrangeas Change Colour
              </h2>
              <p className="mb-5" style={{ ...sans, color: "#4a5568", lineHeight: 1.95, fontSize: 15 }}>
                The colour of a hydrangea bloom isn't fixed in its DNA the way we might assume. At the centre of this transformation is a pigment called <strong style={{ color: "#2d5a3d" }}>delphinidin</strong> — an anthocyanin that naturally produces a warm reddish-pink hue. But when <strong style={{ color: "#2d5a3d" }}>aluminium ions</strong> from the soil enter the plant and bind to this pigment, the entire chemical structure shifts and the flower turns blue.
              </p>
              <p style={{ ...sans, color: "#4a5568", lineHeight: 1.95, fontSize: 15 }}>
                The availability of aluminium is controlled entirely by soil acidity. In <em>acidic soil</em> (pH below 6), aluminium becomes soluble — freely absorbed by the roots, carried up into the petals, and bound with delphinidin to produce those iconic cerulean blues. In <em>alkaline soil</em> (pH above 7), aluminium is chemically locked into insoluble compounds. Without aluminium reaching the petals, the delphinidin remains unbound and expresses its natural pink.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <PHBar />
            </Reveal>

            <Reveal delay={0.05}>
              <blockquote className="my-12 pl-8 py-2" style={{ borderLeft: "3px solid #7a9e7e" }}>
                <p className="italic font-normal leading-snug mb-3" style={{ ...serif, fontSize: "clamp(20px, 2.4vw, 28px)", color: "#2d5a3d" }}>
                  "The hydrangea does not choose its colour. It listens to the earth, and the earth tells it who to be."
                </p>
                <cite className="text-xs tracking-widest uppercase not-italic" style={{ ...sans, color: "#7a9e7e" }}>
                  — Botanical Folklore
                </cite>
              </blockquote>
            </Reveal>

            <Reveal>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="rounded-2xl overflow-hidden" style={{ height: 290 }}>
                  <img
                    src={pinkHydrangea}
                    alt="Pink hydrangeas"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-xs tracking-widest uppercase mb-2" style={{ ...sans, color: "#7a9e7e" }}>Pink Hydrangeas</p>
                  <h3 className="font-normal mb-4 leading-tight" style={{ ...serif, fontSize: 26, color: "#1a3320" }}>
                    Alkaline Soil,<br />Warm Blooms
                  </h3>
                  <p className="text-sm leading-7" style={{ ...sans, color: "#5a6a5a", lineHeight: 1.85 }}>
                    When soil pH rises to 7 and beyond, aluminium becomes insoluble and unavailable to the plant. The delphinidin pigment expresses itself in rich pinks and deep roses — the hydrangea's truest, most natural state, uncomplicated by soil chemistry.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="rounded-2xl p-7 mb-12 flex gap-5 items-start" style={{ background: "#f0ebe1", border: "1px solid #ddd5c5" }}>
                <div
                className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center"
                style={{ background: "#1a3320" }}
                >
                <Flower2 size={18} color="white" />
                </div>
                <div>
                  <h4 className="font-normal mb-2" style={{ ...serif, fontSize: 21, color: "#1a3320" }}>
                    The Purple / Lavender In‑Between
                  </h4>
                  <p className="text-sm leading-7" style={{ ...sans, color: "#5a6a5a", lineHeight: 1.85 }}>
                    In soils near neutral pH (5.5–6.5), hydrangeas bloom in lilac, violet, and smoky mauve — some delphinidin molecules binding with aluminium, others remaining free. Neither fully blue nor fully pink, this transition state produces arguably the most exquisite tones in the entire spectrum, appearing almost hand-watercoloured by nature itself.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <h2 className="font-normal mb-8 leading-tight" style={{ ...serif, fontSize: "clamp(24px, 3vw, 40px)", color: "#1a3320" }}>
                Hydrangea Care Guide
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
                {[
                    {
                        icon: <Droplets size={26} strokeWidth={1.8} />,
                        title: "Watering",
                        tip: "Deep water 2–3× per week. Hydrangeas are thirsty — keep soil consistently moist but never waterlogged. Morning watering prevents fungal growth.",
                    },
                    {
                        icon: <Sun size={26} strokeWidth={1.8} />,
                        title: "Sunlight",
                        tip: "Morning sun, afternoon shade. Direct afternoon sun in summer can scorch petals. Aim for 4–6 hours of bright indirect light daily.",
                    },
                    {
                        icon: <Thermometer size={26} strokeWidth={1.8} />,
                        title: "Climate",
                        tip: "Temperate climates with warm summers and cool winters. USDA zones 3–9 suit most varieties. Mulch well before winter frost.",
                    },
                    ].map(({ icon, title, tip }) => (
                  <div
                    key={title}
                    className="rounded-2xl p-6"
                    style={{ background: "#fff", border: "1px solid #e8e0d8", boxShadow: "0 2px 18px rgba(26,51,32,0.05)" }}
                  >
                    <div className="mb-4 text-[#7a9e7e]">{icon}</div>
                    <h4 className="font-normal mb-2" style={{ ...serif, fontSize: 18, color: "#1a3320" }}>{title}</h4>
                    <p className="text-xs leading-6" style={{ ...sans, color: "#6a7a6a", lineHeight: 1.8 }}>{tip}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="rounded-3xl overflow-hidden mb-12" style={{ background: "#1a3320" }}>
                <div className="p-8 md:p-12">
                  <p className="text-xs tracking-widest uppercase mb-5" style={{ ...sans, color: "#7a9e7e" }}>
                    ✦ Did You Know
                  </p>
                  <h3 className="font-light text-white mb-8" style={{ ...serif, fontSize: 28 }}>
                    Fascinating Hydrangea Facts
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      "In Japan, hydrangeas (called Ajisai) symbolise heartfelt emotion — traditionally given as apologies or tokens of deep gratitude.",
                      "You can intentionally shift a hydrangea's colour by adding garden sulfur to acidify soil (→ blue) or garden lime to alkalinize it (→ pink).",
                      "White hydrangeas contain no delphinidin pigment at all, making them immune to the colour-change effect — they stay white regardless of soil.",
                      "Each large 'mophead' cluster is actually composed of dozens of individual tiny flowers, each one a miniature bloom in its own right.",
                    ].map((fact, i) => (
                      <div key={i} className="flex gap-4">
                        <span className="text-xs mt-1 flex-shrink-0" style={{ color: "#7a9e7e" }}>✦</span>
                        <p className="text-sm leading-7 text-white/65" style={{ ...sans, lineHeight: 1.85 }}>{fact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div className="relative rounded-3xl overflow-hidden" style={{ height: 380 }}>
                <img
                  src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&auto=format&fit=crop"
                  alt="Garden hydrangeas"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,28,18,0.78) 0%, transparent 52%)" }} />
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-white/90 italic leading-relaxed" style={{ ...serif, fontSize: "clamp(18px, 2vw, 23px)" }}>
                    "To grow a hydrangea is to enter into conversation with your soil — a quiet, seasonal dialogue where the earth speaks in colour."
                  </p>
                </div>
              </div>
            </Reveal>
          </article>

          {/* ── SIDEBAR ── */}
          <aside className="lg:col-span-4 space-y-7">
            <Reveal>
              <div className="rounded-2xl p-6" style={{ background: "#fff", border: "1px solid #e8e0d8" }}>
                <div
                  className="w-14 h-14 rounded-full overflow-hidden mb-4"
                  style={{ border: "2px solid #e0ede4" }}
                >
                  {/* ✅ author image replaced */}
                  <img
                    src={user1}
                    alt="Author Karun"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs tracking-widest uppercase mb-1" style={{ ...sans, color: "#7a9e7e" }}>Written by</p>
                {/* ✅ author name changed */}
                <h4 className="font-normal mb-2" style={{ ...serif, fontSize: 20, color: "#1a3320" }}>Karun</h4>
                <p className="text-xs leading-6 text-gray-400" style={sans}>
                  Botanist &amp; Lifestyle Editor at FloraVerse. Passionate about the intersection of plant science and everyday beauty.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="rounded-2xl p-6" style={{ background: "#f7f4ee", border: "1px solid #e0d8cc" }}>
                <p className="text-xs tracking-widest uppercase mb-5" style={{ ...sans, color: "#7a9e7e" }}>
                  In This Article
                </p>
                {[
                  "What Are Hydrangeas?",
                  "Why Colours Change",
                  "pH & Colour Guide",
                  "Lavender In‑Between",
                  "Care Guide",
                  "Fascinating Facts",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 py-2.5 border-b last:border-0 cursor-pointer group"
                    style={{ borderColor: "#e0d8cc" }}
                  >
                    <span className="text-xs" style={{ color: "#c4a882" }}>0{i + 1}</span>
                    <span className="text-sm group-hover:text-green-700 transition-colors" style={{ ...sans, color: "#4a5568" }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="rounded-2xl p-6" style={{ background: "#1a3320" }}>
                <p className="text-xs tracking-widest uppercase mb-3" style={{ ...sans, color: "#7a9e7e" }}>
                  Quick Tip
                </p>
                <h4 className="font-light text-white mb-3" style={{ ...serif, fontSize: 20 }}>
                  Test Your Soil pH at Home
                </h4>
                <p className="text-xs text-white/55 mb-5 leading-6" style={sans}>
                  A simple pH test kit from any garden centre will reveal whether to add sulfur for bluer blooms — or garden lime for warmer pinks.
                </p>
                <button
                  className="w-full py-2.5 rounded-xl text-xs font-medium tracking-wide transition-all hover:opacity-85"
                  style={{ ...sans, background: "#7a9e7e", color: "white" }}
                >
                  Shop pH Test Kits →
                </button>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div>
                <p className="text-xs tracking-widest uppercase mb-4" style={{ ...sans, color: "#7a9e7e" }}>Tags</p>
                <div className="flex flex-wrap gap-2">
                  {["Hydrangeas", "Soil pH", "Garden Science", "Flowering Plants", "Plant Care", "Colour Theory", "Garden Design"].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-full text-xs cursor-pointer hover:bg-green-800 hover:text-white transition-all"
                      style={{ ...sans, background: "#e8e0d8", color: "#5a6a5a" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>
    <Footer />
    </div>
  );
}