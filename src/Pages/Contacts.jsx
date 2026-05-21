import { useEffect, useRef, useState } from "react";
import {
  Mail,
  Send,
  User,
  MessageSquare,
  ChevronDown,
  Leaf,
  Sprout,
  Headphones,
  Globe,
  CheckCircle2,
  ArrowRight,
  Instagram,
  Youtube,
  Twitter,
  Flower2,
  Droplets,
  Bot,
} from "lucide-react";
import Header from "../Components/Header/Header";
import Footer from "../Components/Header/Footer";

/* ─────────────────────────────────────────
   Typography tokens
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

function Reveal({ children, className = "", delay = 0, style = {} }) {
  const [ref, on] = useReveal();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: on ? 1 : 0,
        transform: on ? "translateY(0px)" : "translateY(28px)",
        transition: `opacity 0.8s cubic-bezier(.16,1,.3,1) ${delay}s,
                     transform 0.8s cubic-bezier(.16,1,.3,1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const contactCards = [
  {
    icon: Mail,
    title: "General Enquiries",
    detail: "hello@floraverse.com",
    sub: "We'll reply within 24 hours",
    accent: "#2d5a3d",
    bg: "#e8f0e8",
  },
  {
    icon: Headphones,
    title: "Customer Support",
    detail: "+1 (800) 555-FLORA",
    sub: "Mon–Fri, 9 am – 6 pm",
    accent: "#3a6b47",
    bg: "#eaf2ea",
  },
  {
    icon: Globe,
    title: "Online Orders",
    detail: "Tracked shipping available",
    sub: "For order updates and help",
    accent: "#4a7c5a",
    bg: "#ecf4ec",
  },
  {
    icon: Sprout,
    title: "Plant Care Help",
    detail: "Advice for every plant",
    sub: "From beginners to collectors",
    accent: "#5a8a6a",
    bg: "#eef5ee",
  },
];

const subjects = [
  "Order & Shipping",
  "Plant Care Advice",
  "Product Enquiry",
  "Press & Partnerships",
  "Wholesale",
  "Other",
];

const faqs = [
  {
    q: "How long does shipping take?",
    a: "Standard orders arrive within 3–5 business days. Express next-day shipping is available at checkout. All plants are carefully packed with moisture-retaining materials to ensure they arrive in good condition.",
  },
  {
    q: "How do I change the colour of my hydrangea?",
    a: "To encourage blue blooms, add garden sulfur or aluminium sulfate to acidify your soil below pH 6. For pink blooms, apply garden lime to raise pH above 7. Results typically appear over one to two growing seasons as the soil chemistry adjusts.",
  },
  {
    q: "Do you offer a plant guarantee?",
    a: "Yes — all plants come with a 30-day health guarantee. If your plant arrives damaged or deteriorates within the first month despite proper care, we'll send a free replacement or issue a full refund.",
  },
  {
    q: "Do you have a physical nursery or store?",
    a: "No — FloraVerse is an online-only store. We operate digitally and ship directly to customers, so there is no physical nursery or in-person visit available.",
  },
  {
    q: "Do you offer wholesale or bulk pricing?",
    a: "We work with interior designers, landscape architects, and boutique retailers. Please reach out via the contact form selecting 'Wholesale' as your subject and our trade team will be in touch within two business days.",
  },
];

const socialLinks = [
  { icon: Instagram, label: "Instagram", handle: "@floraverse", color: "#c13584" },
  { icon: Twitter, label: "Twitter / X", handle: "@floraverse_co", color: "#1da1f2" },
  { icon: Youtube, label: "YouTube", handle: "FloraVerse", color: "#ff0000" },
  { icon: Globe, label: "Pinterest", handle: "FloraVerse", color: "#e60023" },
];

/* ─────────────────────────────────────────
   FAQ Accordion Item
───────────────────────────────────────── */
function FaqItem({ q, a, isOpen, onToggle }) {
  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: isOpen ? "#fff" : "#faf8f4",
        border: `1px solid ${isOpen ? "#c8dfc8" : "#e0d8cc"}`,
        boxShadow: isOpen ? "0 4px 24px rgba(26,51,32,0.07)" : "none",
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-6 text-left"
      >
        <span
          className="font-normal"
          style={{ ...serif, fontSize: 18, color: "#1a3320" }}
        >
          {q}
        </span>
        <ChevronDown
          size={18}
          strokeWidth={1.5}
          style={{
            color: "#7a9e7e",
            flexShrink: 0,
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.35s cubic-bezier(.16,1,.3,1)",
          }}
        />
      </button>
      <div
        style={{
          maxHeight: isOpen ? 300 : 0,
          overflow: "hidden",
          transition: "max-height 0.4s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <p
          className="px-6 pb-6 leading-relaxed text-sm"
          style={{ ...sans, color: "#5a6a5a", lineHeight: 1.85 }}
        >
          {a}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE COMPONENT
───────────────────────────────────────── */
export default function Contacts() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [touched, setTouched] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (field) => (e) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleBlur = (field) => () =>
    setTouched((p) => ({ ...p, [field]: true }));

  const isValid =
    form.name.trim().length > 1 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.subject &&
    form.message.trim().length > 10;

  const handleSubmit = () => {
    setTouched({ name: true, email: true, subject: true, message: true });
    if (!isValid) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1800);
  };

  const err = {
    name: touched.name && form.name.trim().length < 2,
    email: touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email),
    subject: touched.subject && !form.subject,
    message: touched.message && form.message.trim().length < 11,
  };

  const inputCls = (hasErr) => ({
    width: "100%",
    padding: "14px 16px",
    borderRadius: 14,
    border: `1px solid ${hasErr ? "#d4826a" : "#ddd5c5"}`,
    background: hasErr ? "#fdf5f2" : "#fff",
    color: "#2a2a2a",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxShadow: hasErr ? "0 0 0 3px rgba(212,130,106,0.12)" : "none",
    ...sans,
    fontSize: 14,
  });

  return (
    <div
      style={{
        background: "#faf8f4",
        ...sans,
        color: "#2a2a2a",
        overflowX: "hidden",
      }}
    >
      <Header />

      {/* TOP BANNER */}
      <div className="bg-[#1a3320] px-6 lg:px-14 pt-10 pb-16" style={sans}>
        <p className="text-[11px] tracking-[0.2em] uppercase text-[#7a9e7e] mb-2">
          ✦ Customer Support
        </p>
        <h1
          className="font-light text-[#f7f4ee] m-0 leading-tight"
          style={{ ...serif, fontSize: "clamp(32px, 4vw, 48px)" }}
        >
          Contact Us
        </h1>
        <p className="mt-3 text-[#a8c5a0] text-sm max-w-md" style={sans}>
          Have questions or need assistance?
        </p>
      </div>

      {/* CONTACT CARDS */}
      <section
        className="px-5 md:px-10 lg:px-16 py-16"
        style={{ background: "#f0ebe1" }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {contactCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <Reveal key={card.title} delay={i * 0.07}>
                <div
                  className="rounded-2xl p-6 h-full group cursor-default"
                  style={{
                    background: "#fff",
                    border: "1px solid #e8e0d8",
                    boxShadow: "0 2px 20px rgba(26,51,32,0.05)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 36px rgba(26,51,32,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 20px rgba(26,51,32,0.05)";
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: card.bg }}
                  >
                    <Icon
                      size={20}
                      strokeWidth={1.5}
                      style={{ color: card.accent }}
                    />
                  </div>
                  <p
                    className="text-xs tracking-widest uppercase mb-1.5"
                    style={{ ...sans, color: "#7a9e7e" }}
                  >
                    {card.title}
                  </p>
                  <p
                    className="font-normal mb-1 leading-snug"
                    style={{ ...serif, fontSize: 17, color: "#1a3320" }}
                  >
                    {card.detail}
                  </p>
                  <p className="text-xs" style={{ ...sans, color: "#9aaa9a" }}>
                    {card.sub}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* MAIN: FORM + SIDEBAR */}
      <section className="px-5 md:px-10 lg:px-16 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20">
          {/* CONTACT FORM */}
          <div className="lg:col-span-7">
            <Reveal>
              <p
                className="text-xs tracking-[0.3em] uppercase mb-3"
                style={{ ...sans, color: "#7a9e7e" }}
              >
                ✦ Send a Message
              </p>
              <h2
                className="font-normal leading-tight mb-3"
                style={{
                  ...serif,
                  fontSize: "clamp(28px, 3.5vw, 44px)",
                  color: "#1a3320",
                }}
              >
                We'd Love to
                <br />
                <em style={{ color: "#5a8a6a" }}>Hear From You</em>
              </h2>
              <p
                className="text-sm leading-7 mb-10 max-w-md"
                style={{
                  ...sans,
                  color: "#7a8a7a",
                  lineHeight: 1.85,
                }}
              >
                Whether it's a plant care question, a bulk order, or simply
                wanting to say hello — our team is ready to help.
              </p>
            </Reveal>

            {sent ? (
              <Reveal>
                <div
                  className="rounded-3xl p-12 text-center"
                  style={{ background: "#f0f8f0", border: "1px solid #c4dfc4" }}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ background: "#e0f0e0" }}
                  >
                    <CheckCircle2
                      size={28}
                      strokeWidth={1.5}
                      style={{ color: "#2d5a3d" }}
                    />
                  </div>
                  <h3
                    className="font-normal mb-3"
                    style={{ ...serif, fontSize: 28, color: "#1a3320" }}
                  >
                    Message Sent!
                  </h3>
                  <p
                    className="text-sm leading-7 text-gray-500 max-w-xs mx-auto mb-8"
                    style={sans}
                  >
                    Thank you for reaching out. Our team will get back to you
                    within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSent(false);
                      setForm({
                        name: "",
                        email: "",
                        subject: "",
                        message: "",
                      });
                      setTouched({});
                    }}
                    className="px-7 py-3 rounded-full text-sm font-medium transition-all hover:-translate-y-0.5"
                    style={{ ...sans, background: "#1a3320", color: "white" }}
                  >
                    Send Another
                  </button>
                </div>
              </Reveal>
            ) : (
              <div className="space-y-5">
                <Reveal delay={0.05}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        className="flex items-center gap-2 text-xs tracking-widest uppercase mb-2"
                        style={{ ...sans, color: "#7a9e7e" }}
                      >
                        <User size={12} strokeWidth={2} />
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Jane Smith"
                        value={form.name}
                        onChange={handleChange("name")}
                        onBlur={handleBlur("name")}
                        style={inputCls(err.name)}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#7a9e7e";
                          e.target.style.boxShadow =
                            "0 0 0 3px rgba(122,158,126,0.15)";
                        }}
                      />
                      {err.name && (
                        <p
                          className="text-xs mt-1.5"
                          style={{ ...sans, color: "#c4604a" }}
                        >
                          Please enter your name.
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        className="flex items-center gap-2 text-xs tracking-widest uppercase mb-2"
                        style={{ ...sans, color: "#7a9e7e" }}
                      >
                        <Mail size={12} strokeWidth={2} />
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="jane@email.com"
                        value={form.email}
                        onChange={handleChange("email")}
                        onBlur={handleBlur("email")}
                        style={inputCls(err.email)}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#7a9e7e";
                          e.target.style.boxShadow =
                            "0 0 0 3px rgba(122,158,126,0.15)";
                        }}
                      />
                      {err.email && (
                        <p
                          className="text-xs mt-1.5"
                          style={{ ...sans, color: "#c4604a" }}
                        >
                          Please enter a valid email.
                        </p>
                      )}
                    </div>
                  </div>
                </Reveal>

                <Reveal delay={0.08}>
                  <label
                    className="flex items-center gap-2 text-xs tracking-widest uppercase mb-2"
                    style={{ ...sans, color: "#7a9e7e" }}
                  >
                    <MessageSquare size={12} strokeWidth={2} />
                    Subject
                  </label>
                  <div className="relative">
                    <select
                      value={form.subject}
                      onChange={handleChange("subject")}
                      onBlur={handleBlur("subject")}
                      style={{
                        ...inputCls(err.subject),
                        appearance: "none",
                        paddingRight: 44,
                        color: form.subject ? "#2a2a2a" : "#aaa",
                        cursor: "pointer",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#7a9e7e";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(122,158,126,0.15)";
                      }}
                    >
                      <option value="" disabled>
                        Select a topic…
                      </option>
                      {subjects.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      strokeWidth={1.5}
                      className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: "#7a9e7e" }}
                    />
                  </div>
                  {err.subject && (
                    <p
                      className="text-xs mt-1.5"
                      style={{ ...sans, color: "#c4604a" }}
                    >
                      Please choose a subject.
                    </p>
                  )}
                </Reveal>

                <Reveal delay={0.1}>
                  <label
                    className="flex items-center gap-2 text-xs tracking-widest uppercase mb-2"
                    style={{ ...sans, color: "#7a9e7e" }}
                  >
                    <MessageSquare size={12} strokeWidth={2} />
                    Your Message
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Tell us how we can help — the more detail, the better…"
                    value={form.message}
                    onChange={handleChange("message")}
                    onBlur={handleBlur("message")}
                    style={{
                      ...inputCls(err.message),
                      resize: "vertical",
                      minHeight: 140,
                      lineHeight: 1.75,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#7a9e7e";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(122,158,126,0.15)";
                    }}
                  />
                  <div className="flex items-center justify-between mt-1.5">
                    {err.message ? (
                      <p
                        className="text-xs"
                        style={{ ...sans, color: "#c4604a" }}
                      >
                        Message must be at least 10 characters.
                      </p>
                    ) : (
                      <span />
                    )}
                    <p className="text-xs text-gray-400" style={sans}>
                      {form.message.length} / 1000
                    </p>
                  </div>
                </Reveal>

                <Reveal delay={0.12}>
                  <button
                    onClick={handleSubmit}
                    disabled={sending}
                    className="flex items-center gap-3 px-9 py-4 rounded-full text-sm font-medium tracking-wide transition-all hover:-translate-y-1 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                    style={{ ...sans, background: "#1a3320", color: "white" }}
                  >
                    {sending ? (
                      <>
                        <Sprout
                          size={16}
                          strokeWidth={1.8}
                          style={{ animation: "spin 1.2s linear infinite" }}
                        />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send size={15} strokeWidth={1.8} />
                        Send Message
                      </>
                    )}
                  </button>
                </Reveal>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="lg:col-span-5 space-y-6">

            {/* Chatbot Banner */}
            <Reveal delay={0.03}>
            <div
                className="rounded-3xl p-6 overflow-hidden relative"
                style={{
                background:
                    "linear-gradient(135deg, #1a3320 0%, #2d5a3d 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 10px 30px rgba(26,51,32,0.15)",
                }}
            >
                {/* Glow */}
                <div
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full"
                style={{
                    background: "rgba(168,212,176,0.12)",
                    filter: "blur(10px)",
                }}
                />

                <div className="relative z-10">
                <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                    style={{
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(10px)",
                    }}
                >
                    <Bot
                    size={22}
                    strokeWidth={1.6}
                    style={{ color: "#d6f0db" }}
                    />
                </div>

                <p
                    className="text-xs tracking-[0.25em] uppercase mb-2"
                    style={{ ...sans, color: "#a8d4b0" }}
                >
                    ✦ Instant Help
                </p>

                <h3
                    className="font-light text-white leading-tight mb-3"
                    style={{ ...serif, fontSize: 26 }}
                >
                    Try our
                    <br />
                    <em style={{ color: "#bfe6c6" }}>AI Chatbot</em>
                </h3>

                <p
                    className="text-sm leading-7 mb-6"
                    style={{
                    ...sans,
                    color: "rgba(255,255,255,0.72)",
                    lineHeight: 1.8,
                    }}
                >
                    Get instant responses for order tracking, plant care,
                    delivery help, and customer support questions.
                </p>

                <button
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all hover:-translate-y-0.5"
                    style={{
                    ...sans,
                    background: "#f7f4ee",
                    color: "#1a3320",
                    }}
                >
                    Open Chatbot
                    <ArrowRight size={15} strokeWidth={1.8} />
                </button>
                </div>
            </div>
            </Reveal>


            {/* Online support card */}
            <Reveal delay={0.06}>
              <div
                className="rounded-3xl p-7"
                style={{
                  background: "#fff",
                  border: "1px solid #e8e0d8",
                  boxShadow: "0 2px 20px rgba(26,51,32,0.05)",
                }}
              >

                <h3
                  className="font-light leading-tight mb-3"
                  style={{ ...serif, fontSize: 24, color: "#1a3320" }}
                >
                  Support for every order,
                  <br />
                  <em style={{ color: "#5a8a6a" }}>entirely online</em>
                </h3>

                <p
                  className="text-sm leading-7"
                  style={{ ...sans, color: "#7a8a7a", lineHeight: 1.8 }}
                >
                  FloraVerse is built for convenient online shopping, tracked
                  shipping, and fast customer support.
                </p>
              </div>
            </Reveal>

            {/* Response time badge */}
            <Reveal delay={0.15}>
              <div
                className="rounded-2xl p-5 flex items-center gap-4"
                style={{ background: "#e8f0e8", border: "1px solid #c8dfc8" }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "#d0e8d0" }}
                >
                  <Leaf size={18} strokeWidth={1.5} style={{ color: "#2d5a3d" }} />
                </div>
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ ...sans, color: "#1a3320" }}
                  >
                    Average response time
                  </p>
                  <p className="text-xs text-gray-500" style={sans}>
                    We typically reply within{" "}
                    <strong style={{ color: "#2d5a3d" }}>under 4 hours</strong>{" "}
                    on weekdays.
                  </p>
                </div>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 px-5 md:px-10 lg:px-16" style={{ background: "#f0ebe1" }}>
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <p
                className="text-xs tracking-[0.3em] uppercase mb-3"
                style={{ ...sans, color: "#7a9e7e" }}
              >
                ✦ Common Questions
              </p>
              <h2
                className="font-normal leading-tight"
                style={{
                  ...serif,
                  fontSize: "clamp(26px, 3.5vw, 44px)",
                  color: "#1a3320",
                }}
              >
                Frequently Asked
                <br />
                <em>Questions</em>
              </h2>
            </div>
          </Reveal>

          <div className="space-y-3">
            {faqs.map((item, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <FaqItem
                  q={item.q}
                  a={item.a}
                  isOpen={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                />
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="text-center mt-10">
              <p className="text-sm text-gray-500 mb-4" style={sans}>
                Still have questions?
              </p>
              <button
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{ ...sans, background: "#1a3320", color: "white" }}
              >
                <Mail size={14} strokeWidth={1.8} />
                Email Us Directly
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SOCIAL / COMMUNITY SECTION */}
      <section className="py-20 px-5 md:px-10 lg:px-16" style={{ background: "#1a3320" }}>
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
              <div className="max-w-lg">
                <div className="flex items-center gap-2.5 mb-4">
                  <Leaf size={18} strokeWidth={1.5} style={{ color: "#7a9e7e" }} />
                  <p
                    className="text-xs tracking-[0.3em] uppercase"
                    style={{ ...sans, color: "#7a9e7e" }}
                  >
                    Join the Community
                  </p>
                </div>
                <h2
                  className="font-light text-white mb-4 leading-tight"
                  style={{ ...serif, fontSize: "clamp(24px, 3vw, 40px)" }}
                >
                  Grow With Us on
                  <br />
                  <em style={{ color: "#a8d4b0" }}>Social Media</em>
                </h2>
                <p
                  className="text-sm leading-7 text-white/55 max-w-sm"
                  style={sans}
                >
                  Behind-the-scenes plant content, care tips, and a community of
                  plant lovers. Come say hello.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                {socialLinks.map(({ icon: Icon, label, handle }) => (
                  <button
                    key={label}
                    className="flex flex-col items-center gap-3 p-5 rounded-2xl text-center transition-all hover:-translate-y-1"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      transition: "all 0.25s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                      e.currentTarget.style.transform = "translateY(-5px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <Icon
                      size={22}
                      strokeWidth={1.5}
                      style={{ color: "#a8d4b0" }}
                    />
                    <div>
                      <p className="text-xs text-white font-medium" style={sans}>
                        {label}
                      </p>
                      <p className="text-xs text-white/40 mt-0.5" style={sans}>
                        {handle}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* NEWSLETTER STRIP */}
      <section className="py-16 px-5 md:px-10 lg:px-16" style={{ background: "#f0ebe1" }}>
        <div className="max-w-2xl mx-auto text-center">
          <Reveal>
            <p
              className="text-xs tracking-[0.35em] uppercase mb-3"
              style={{ ...sans, color: "#7a9e7e" }}
            >
              ✦ Stay in Bloom
            </p>
            <h2
              className="font-normal mb-3"
              style={{
                ...serif,
                fontSize: "clamp(24px, 3.5vw, 38px)",
                color: "#1a3320",
              }}
            >
              The FloraVerse <em>Journal</em>
            </h2>
            <p
              className="text-sm text-gray-500 mb-7 max-w-sm mx-auto"
              style={{ ...sans, lineHeight: 1.85 }}
            >
              Monthly care guides, seasonal drops, and botanical stories — no
              noise, only nature.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-5 py-3.5 rounded-full text-sm outline-none"
                style={{
                  ...sans,
                  border: "1px solid #ddd5c5",
                  background: "#fff",
                  color: "#2a2a2a",
                }}
              />
              <button
                className="px-7 py-3.5 rounded-full text-sm font-medium whitespace-nowrap transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{ ...sans, background: "#1a3320", color: "white" }}
              >
                Subscribe →
              </button>
            </div>
          </Reveal>
        </div>
      </section>


      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <Footer />
    </div>
  );
}