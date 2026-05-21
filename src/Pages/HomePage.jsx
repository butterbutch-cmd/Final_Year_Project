import Header from "../Components/Header/Header";
import Footer from "../Components/Header/Footer";
import CoverBanner from "../Components/Banner/CoverBanner";
import ProductSection from "../Components/ProductSection";
import { useNavigate } from "react-router-dom";
import { Leaf, Truck, Droplets, Sprout,   MessageCircle,Bot,Headphones,ArrowRight, } from "lucide-react";
import patternBg from "../assets/image/pattern.jpg";
import patternBg2 from "../assets/image/pattern2.jpg";

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'DM Sans', sans-serif" };

const FEATURES = [
  { icon: Leaf,     label: "100% Natural",   sub: "Ethically sourced plants" },
  { icon: Truck,    label: "Free Delivery",  sub: "On orders over Rs. 2,500" },
  { icon: Droplets, label: "Care Guide",     sub: "Included with every plant" },
  { icon: Sprout,   label: "Expert Support", sub: "Green thumb advice" },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#fdfcf8]">
      <Header />

      <CoverBanner
        title="Bring Nature Home"
        subtitle="Minimal · Fresh · Green"
        height="90vh"
      />

      {/* ── Feature strip ── */}
      <div className="grid grid-cols-4 bg-[#f7f4ee] border-b border-[#2d4a2d]/10 max-lg:grid-cols-2 max-sm:grid-cols-1">
        {FEATURES.map(({ icon: Icon, label, sub }, i) => (
          <div
            key={label}
            className={`group flex items-center gap-4 px-9 py-7 hover:bg-[#2d4a2d]/5 transition-colors duration-200
              ${i < 3 ? "border-r border-[#2d4a2d]/10" : ""}
              max-lg:${i === 1 ? "border-r-0" : ""}
              max-sm:border-r-0 max-sm:border-b border-[#2d4a2d]/10 last:border-b-0`}
          >
            <span className="flex-shrink-0 text-[#2d4a2d]">
              <Icon
                size={26}
                strokeWidth={1.5}
                className="transition-transform duration-200 group-hover:scale-110"
              />
            </span>

            <div>
              <p
                className="text-[13px] font-medium text-[#1a3320] m-0 mb-0.5"
                style={sans}
              >
                {label}
              </p>
              <p
                className="text-[11.5px] font-light text-[#8c8880] m-0"
                style={sans}
              >
                {sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Product sections ── */}
      <ProductSection title="For You" type="recommendation" />
      <ProductSection title="Indoor Plants" filterKey="indoor" />
      {/* ── Footer CTA banner ── */}
      <div
        className="text-center py-20 px-6 bg-cover bg-center bg-no-repeat relative overflow-hidden"
        style={{
          backgroundImage: `url(${patternBg})`,
        }}
      >
        {/* Optional dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Content */}
        <div className="relative z-10">
          <p
            className="text-[11px] tracking-[0.22em] uppercase text-[#c8e6c9] m-0 mb-4"
            style={sans}
          >
            ✦ Community
          </p>

          <h2
            className="font-light text-[#f7f4ee] m-0 mb-3"
            style={{
              ...serif,
              fontSize: "clamp(36px, 5vw, 56px)",
              letterSpacing: "-0.01em",
            }}
          >
            Share your green space
          </h2>

          <p
            className="text-[15px] font-light text-[#f7f4ee]/80 m-0 mb-9"
            style={sans}
          >
            Join hundreds of plant lovers on our forum
          </p>

          <button
            onClick={() => navigate("/forum")}
            className="inline-block px-10 py-3.5 bg-[#f7f4ee] text-[#1a3320] text-[11px] font-medium tracking-[0.14em] uppercase border-none cursor-pointer rounded-sm hover:bg-[#7a9e7e] hover:text-white transition-all duration-200"
            style={sans}
          >
            Join the Forum →
          </button>
        </div>
      </div>
      <ProductSection title="On Sale" filterKey="onSale" />
      <ProductSection title="Outdoor Plants" filterKey="outdoor" />
      {/*Service Banner */}
      <div
        className="text-center py-16 px-5 bg-cover bg-center bg-no-repeat relative overflow-hidden"
        style={{
          backgroundImage: `url(${patternBg2})`,
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto">
          
          {/* Small Label */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageCircle className="w-4 h-4 text-[#c8e6c9]" />

            <p
              className="text-[10px] tracking-[0.22em] uppercase text-[#c8e6c9] m-0"
              style={sans}
            >
              Support Center
            </p>
          </div>

          {/* Heading */}
          <h2
            className="font-light text-[#f7f4ee] m-0 mb-3"
            style={{
              ...serif,
              fontSize: "clamp(30px, 4vw, 46px)",
              letterSpacing: "-0.02em",
            }}
          >
            Need help with your plants?
          </h2>

          {/* Description */}
          <p
            className="text-[14px] font-light text-[#f7f4ee]/80 m-0 mb-8 max-w-xl mx-auto leading-6"
            style={sans}
          >
            Get help through our forum, chatbot, or customer care support.
          </p>

          {/* Support Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Forum */}
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:bg-white/15 transition-all duration-300">
              <MessageCircle className="w-8 h-8 text-[#d9f99d] mx-auto mb-4" />

              <h3
                className="text-[#f7f4ee] text-base mb-2"
                style={serif}
              >
                Community Forum
              </h3>

              <p
                className="text-[#f7f4ee]/70 text-[13px] leading-5 mb-4"
                style={sans}
              >
                Ask questions and learn from plant lovers.
              </p>

              <button
                onClick={() => navigate("/forum")}
                className="inline-flex items-center gap-1 text-[#d9f99d] hover:text-white transition-colors text-sm"
                style={sans}
              >
                Visit
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Chatbot */}
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:bg-white/15 transition-all duration-300">
              <Bot className="w-8 h-8 text-[#d9f99d] mx-auto mb-4" />

              <h3
                className="text-[#f7f4ee] text-base mb-2"
                style={serif}
              >
                Smart Chatbot
              </h3>

              <p
                className="text-[#f7f4ee]/70 text-[13px] leading-5 mb-4"
                style={sans}
              >
                Get quick plant care and product help instantly.
              </p>

              <button
                className="inline-flex items-center gap-1 text-[#d9f99d] hover:text-white transition-colors text-sm"
                style={sans}
              >
                Try Now
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Customer Care */}
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:bg-white/15 transition-all duration-300">
              <Headphones className="w-8 h-8 text-[#d9f99d] mx-auto mb-4" />

              <h3
                className="text-[#f7f4ee] text-base mb-2"
                style={serif}
              >
                Customer Care
              </h3>

              <p
                className="text-[#f7f4ee]/70 text-[13px] leading-5 mb-4"
                style={sans}
              >
                Contact our support team for personalized help.
              </p>

              <button
                onClick={() => navigate("/contacts")}
                className="inline-flex items-center gap-1 text-[#d9f99d] hover:text-white transition-colors text-sm"
                style={sans}
              >
                Contact
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </div>
      <ProductSection title="Top Picks" filterKey="topPick" />
      <ProductSection title="Trending Plants" filterKey="trending" />
      <Footer />
    </div>
  );
}