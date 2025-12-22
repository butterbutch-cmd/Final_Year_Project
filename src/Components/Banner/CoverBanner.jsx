import "./CoverBanner.css";
import coverImage from "../../assets/image/scullent.jpg";

export default function CoverBanner({
  title,
  subtitle,
  height = "70vh",
  overlay = true,
  textColor = "#fff",
}) {
  return (
    <div
      className="cover-banner"
      style={{
        backgroundImage: `url(${coverImage})`,
        height,
        color: textColor,
      }}
    >
      {overlay && <div className="cover-overlay"></div>}

      <div className="cover-content">
        {title && <h1>{title}</h1>}
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}
