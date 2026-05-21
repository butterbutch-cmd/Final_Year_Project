// // src/Components/Footer/Footer.jsx
// import { Link } from "react-router-dom";
// import { useState } from "react";
// import { Heart, Instagram, FaFacebook, Twitter, Youtube, ArrowRight, Leaf, Mail } from "lucide-react";

// const serif = { fontFamily: "'Cormorant Garamond', serif" };
// const sans  = { fontFamily: "'DM Sans', sans-serif" };

// const SHOP_LINKS = [
//   { label: "New Arrivals",     to: "/NewArrival" },
//   { label: "Indoor Plants",    to: "/Indoor" },
//   { label: "Outdoor Plants",   to: "/Outdoor" },
//   { label: "Sale",             to: "/Sales" },
//   { label: "Gift Cards",       to: "/gift-cards" },
// ];

// const INFO_LINKS = [
//   { label: "Our Story",        to: "/about" },
//   { label: "Blog",             to: "/blog" },
//   { label: "Plant Care Guide", to: "/care-guide" },
//   { label: "Sustainability",   to: "/sustainability" },
//   { label: "Contact Us",       to: "/contacts" },
// ];

// const LEGAL_LINKS = [
//   { label: "Privacy Policy",   to: "/privacy" },
//   { label: "Terms of Service", to: "/terms" },
//   { label: "Shipping Policy",  to: "/shipping" },
//   { label: "Return Policy",    to: "/returns" },
// ];

// const SOCIALS = [
//   { icon: Instagram, href: "#", label: "Instagram" },
//   { icon: Facebook,  href: "#", label: "Facebook"  },
//   { icon: Twitter,   href: "#", label: "Twitter"   },
//   { icon: Youtube,   href: "#", label: "YouTube"   },
// ];

// export default function Footer() {
//   const [email, setEmail] = useState("");
//   const [subscribed, setSubscribed] = useState(false);

//   const handleSubscribe = (e) => {
//     e.preventDefault();
//     if (!email.trim()) return;
//     setSubscribed(true);
//     setEmail("");
//   };

//   return (
//     <footer style={sans} className="bg-[#1a3320] text-[#f7f4ee]/80 mt-auto">


//       {/* ── Main footer grid ── */}
//       <div className="max-w-6xl mx-auto px-12 max-lg:px-6 max-md:px-4 py-14">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12">

//           {/* Brand column */}
//           <div>
//             <div className="flex items-center gap-2 mb-5">
//               <span className="text-[#7a9e7e] text-xs animate-spin" style={{ animationDuration: "9s" }}>✦</span>
//               <h2 className="text-[22px] font-semibold tracking-[0.18em] text-[#f7f4ee] m-0 leading-none" style={serif}>
//                 MENDHO
//               </h2>
//             </div>
//             <p className="text-[13px] leading-relaxed text-[#f7f4ee]/55 max-w-[230px] mb-7 mt-0">
//               Bringing nature's calm into your space. Thoughtfully curated plants for every corner of your life.
//             </p>

//             {/* Socials */}
//             <div className="flex items-center gap-2">
//               {SOCIALS.map(({ icon: Icon, href, label }) => (
//                 <a
//                   key={label}
//                   href={href}
//                   aria-label={label}
//                   className="flex items-center justify-center w-8 h-8 rounded-full border border-[#f7f4ee]/15 text-[#f7f4ee]/50 hover:border-[#7a9e7e]/60 hover:text-[#7a9e7e] hover:bg-[#7a9e7e]/10 transition-all duration-200 no-underline"
//                 >
//                   <Icon size={14} />
//                 </a>
//               ))}
//             </div>

//             {/* Trust badges */}
//             <div className="flex flex-col gap-2 mt-8">
//               {[
//                 "🌱  Sustainably sourced plants",
//                 "📦  Free shipping over Rs. 2,500",
//                 "🔄  14-day return policy",
//               ].map((t) => (
//                 <span key={t} className="text-[11px] text-[#f7f4ee]/40 tracking-wide">{t}</span>
//               ))}
//             </div>
//           </div>

//           {/* Shop column */}
//           <FooterCol title="Shop" links={SHOP_LINKS} />

//           {/* Info column */}
//           <FooterCol title="Company" links={INFO_LINKS} />

//           {/* Legal + Contact column */}
//           <div>
//             <FooterCol title="Legal" links={LEGAL_LINKS} />
//             <div className="mt-8">
//               <p className="text-[10px] tracking-[0.15em] uppercase text-[#f7f4ee]/35 mb-3">
//                 Reach us
//               </p>
//               <a
//                 href="mailto:hello@mendho.com"
//                 className="text-[12px] text-[#7a9e7e] no-underline hover:text-[#8fb393] transition-colors block mb-1"
//               >
//                 hello@mendho.com
//               </a>
//               <p className="text-[12px] text-[#f7f4ee]/40 m-0">
//                 Mon – Sat, 10am – 6pm
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── Bottom bar ── */}
//       <div className="border-t border-[#f7f4ee]/8">
//         <div className="max-w-6xl mx-auto px-12 max-lg:px-6 max-md:px-4 h-12 flex flex-col sm:flex-row items-center justify-between gap-2">
//           <p className="text-[11px] text-[#f7f4ee]/30 m-0 tracking-wide">
//             © {new Date().getFullYear()} Mendho. All rights reserved.
//           </p>
//           <p className="text-[11px] text-[#f7f4ee]/25 m-0 flex items-center gap-1.5">
//             Made with <Heart size={10} className="text-[#c4704a]" fill="#c4704a" /> for plant lovers
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// }

// // ── Reusable link column ──
// function FooterCol({ title, links }) {
//   return (
//     <div>
//       <p
//         className="text-[10px] tracking-[0.18em] uppercase text-[#f7f4ee]/35 mb-4 mt-0"
//         style={sans}
//       >
//         {title}
//       </p>
//       <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
//         {links.map(({ label, to }) => (
//           <li key={label}>
//             <Link
//               to={to}
//               className="text-[13px] text-[#f7f4ee]/60 no-underline hover:text-[#f7f4ee] transition-colors duration-150 relative group"
//               style={sans}
//             >
//               <span className="inline-block transition-transform duration-150 group-hover:translate-x-0.5">
//                 {label}
//               </span>
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// src/Components/Footer/Footer.jsx
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaYoutube,
  FaHeart,
  FaLeaf,
  FaArrowRight,
  FaEnvelope,
} from "react-icons/fa";

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'DM Sans', sans-serif" };

const SHOP_LINKS = [
  { label: "New Arrivals",     to: "/NewArrival" },
  { label: "Indoor Plants",    to: "/Indoor" },
  { label: "Outdoor Plants",   to: "/Outdoor" },
  { label: "Sale",             to: "/Sales" },
  { label: "Gift Cards",       to: "/gift-cards" },
];

const INFO_LINKS = [
  { label: "Our Story",        to: "/about" },
  { label: "Blog",             to: "/blog" },
  { label: "Plant Care Guide", to: "/care-guide" },
  { label: "Sustainability",   to: "/sustainability" },
  { label: "Contact Us",       to: "/contacts" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy",   to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
  { label: "Shipping Policy",  to: "/shipping" },
  { label: "Return Policy",    to: "/returns" },
];

const SOCIALS = [
  { icon: FaInstagram, href: "#", label: "Instagram" },
  { icon: FaFacebook,  href: "#", label: "Facebook" },
  { icon: FaTwitter,   href: "#", label: "Twitter" },
  { icon: FaYoutube,   href: "#", label: "YouTube" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer style={sans} className="bg-[#1a3320] text-[#f7f4ee]/80 mt-auto">
      {/* ── Main footer grid ── */}
      <div className="max-w-6xl mx-auto px-12 max-lg:px-6 max-md:px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <span
                className="text-[#7a9e7e] text-xs animate-spin"
                style={{ animationDuration: "9s" }}
              >
                ✦
              </span>
              <h2
                className="text-[22px] font-semibold tracking-[0.18em] text-[#f7f4ee] m-0 leading-none"
                style={serif}
              >
                MENDHO
              </h2>
            </div>
            <p className="text-[13px] leading-relaxed text-[#f7f4ee]/55 max-w-[230px] mb-7 mt-0">
              Bringing nature's calm into your space. Thoughtfully curated plants for every corner of your life.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex items-center justify-center w-8 h-8 rounded-full border border-[#f7f4ee]/15 text-[#f7f4ee]/50 hover:border-[#7a9e7e]/60 hover:text-[#7a9e7e] hover:bg-[#7a9e7e]/10 transition-all duration-200 no-underline"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>

            {/* Trust badges */}
            <div className="flex flex-col gap-2 mt-8">
              {[
                "🌱  Sustainably sourced plants",
                "📦  Free shipping over Rs. 2,500",
                "🔄  14-day return policy",
              ].map((t) => (
                <span key={t} className="text-[11px] text-[#f7f4ee]/40 tracking-wide">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Shop column */}
          <FooterCol title="Shop" links={SHOP_LINKS} />

          {/* Info column */}
          <FooterCol title="Company" links={INFO_LINKS} />

          {/* Legal + Contact column */}
          <div>
            <FooterCol title="Legal" links={LEGAL_LINKS} />
            <div className="mt-8">
              <p className="text-[10px] tracking-[0.15em] uppercase text-[#f7f4ee]/35 mb-3">
                Reach us
              </p>
              <a
                href="mailto:hello@mendho.com"
                className="text-[12px] text-[#7a9e7e] no-underline hover:text-[#8fb393] transition-colors block mb-1"
              >
                hello@mendho.com
              </a>
              <p className="text-[12px] text-[#f7f4ee]/40 m-0">
                Mon – Sat, 10am – 6pm
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-[#f7f4ee]/8">
        <div className="max-w-6xl mx-auto px-12 max-lg:px-6 max-md:px-4 h-12 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-[#f7f4ee]/30 m-0 tracking-wide">
            © {new Date().getFullYear()} Mendho. All rights reserved.
          </p>
          <p className="text-[11px] text-[#f7f4ee]/25 m-0 flex items-center gap-1.5">
            Made with <FaHeart size={10} color="#c4704a" /> for plant lovers
          </p>
        </div>
      </div>
    </footer>
  );
}

// ── Reusable link column ──
function FooterCol({ title, links }) {
  return (
    <div>
      <p
        className="text-[10px] tracking-[0.18em] uppercase text-[#f7f4ee]/35 mb-4 mt-0"
        style={sans}
      >
        {title}
      </p>
      <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
        {links.map(({ label, to }) => (
          <li key={label}>
            <Link
              to={to}
              className="text-[13px] text-[#f7f4ee]/60 no-underline hover:text-[#f7f4ee] transition-colors duration-150 relative group"
              style={sans}
            >
              <span className="inline-block transition-transform duration-150 group-hover:translate-x-0.5">
                {label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}