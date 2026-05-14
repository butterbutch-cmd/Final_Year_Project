// import "./CoverBanner.css";
// import coverImage from "../../assets/image/scullent.jpg";

// export default function CoverBanner({
//   title,
//   subtitle,
//   height = "70vh",
//   overlay = true,
//   textColor = "#fff",
// }) {
//   return (
//     <div
//       className="cover-banner"
//       style={{
//         backgroundImage: `url(${coverImage})`,
//         height,
//         color: textColor,
//       }}
//     >
//       {overlay && <div className="cover-overlay"></div>}

//       <div className="cover-content">
//         {title && <h1>{title}</h1>}
//         {subtitle && <p>{subtitle}</p>}
//       </div>
//     </div>
//   );
// }
// 
import coverImage from "../../assets/image/scullent.jpg";
import { useNavigate } from "react-router-dom";

const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'DM Sans', sans-serif" };

export default function CoverBanner({
  title    = "Bring Nature Home",
  subtitle = "Minimal · Fresh · Green",
  height   = "90vh",
}) {
  const navigate = useNavigate();

  return (
    <div
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${coverImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height,
      }}
    >
      {/* Rich gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a3320]/75 via-[#1a3320]/40 to-[#2d4a2d]/60 z-[1]" />

      {/* Vertical side label */}
      <div className="absolute left-14 top-1/2 -translate-y-1/2 -rotate-90 flex items-center gap-3 z-[3] opacity-60 max-lg:hidden">
        <span className="block w-10 h-px bg-[#f7f4ee]/60" />
        <span className="text-[10px] tracking-[0.22em] uppercase text-[#f7f4ee]/80 whitespace-nowrap" style={sans}>
          EST. 2026
        </span>
        <span className="block w-10 h-px bg-[#f7f4ee]/60" />
      </div>

      {/* Content */}
      <div className="relative z-[3] text-center max-w-[700px] px-6 flex flex-col items-center">
        {/* Eyebrow */}
        <p
          className="text-[11px] tracking-[0.24em] uppercase text-[#f7f4ee]/70 m-0 mb-4 animate-[fadeUp_0.9s_0.1s_ease_both]"
          style={sans}
        >
          ✦ Plant Boutique
        </p>

        {/* Title */}
        <h1
          className="font-light leading-none text-[#f7f4ee] m-0 mb-5 animate-[fadeUp_0.9s_0.2s_ease_both]"
          style={{ ...serif, fontSize: "clamp(52px, 8vw, 96px)", letterSpacing: "-0.01em" }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p
          className="text-[13px] tracking-[0.28em] uppercase text-[#f7f4ee]/60 m-0 mb-12 font-light animate-[fadeUp_0.9s_0.3s_ease_both]"
          style={sans}
        >
          {subtitle}
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-4 flex-wrap justify-center animate-[fadeUp_0.9s_0.45s_ease_both]">
          <button
            onClick={() => navigate("/pots")}
            className="px-9 py-3.5 bg-[#f7f4ee] text-[#1a3320] border border-[#f7f4ee] text-[11px] font-medium tracking-[0.14em] uppercase cursor-pointer rounded-sm hover:bg-transparent hover:text-[#f7f4ee] transition-all duration-250"
            style={sans}
          >
            Shop Collection
          </button>
          <button
            onClick={() => navigate("/blog")}
            className="px-9 py-3.5 bg-transparent text-[#f7f4ee] border border-[#f7f4ee]/40 text-[11px] font-medium tracking-[0.14em] uppercase cursor-pointer rounded-sm hover:border-[#f7f4ee] hover:bg-[#f7f4ee]/8 transition-all duration-250"
            style={sans}
          >
            Explore Journal
          </button>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-9 left-1/2 -translate-x-1/2 z-[3] flex flex-col items-center gap-2 opacity-50 animate-[fadeUp_0.9s_0.7s_ease_both]">
        <span className="text-[10px] tracking-[0.22em] uppercase text-[#f7f4ee]" style={sans}>
          Scroll
        </span>
        <span className="block w-px h-9 bg-[#f7f4ee]/60 animate-pulse" />
      </div>

      {/* Keyframes — injected once via a style tag */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}