import { useState } from "react";
import { getProfileImageUrl, getInitialsAvatar } from "../../lib/uploadStore";
import { cn } from "../../lib/utils";

export default function Avatar({ 
  src, 
  name, 
  size = "md", 
  className = "", 
  onClick,
  showFallback = true,
  fallbackText
}) {
  const [imgError, setImgError] = useState(false);
  
  const sizes = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
    "2xl": "w-20 h-20 text-2xl",
    "3xl": "w-24 h-24 text-3xl",
    "4xl": "w-32 h-32 text-4xl",
  };

  const getImageSrc = () => {
    if (src && !imgError) {
      const imageUrl = getProfileImageUrl(src);
      return imageUrl || src;
    }
    return null;
  };

  const initials = fallbackText || (name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U");

  // If we have a valid image, render it
  const imageSrc = getImageSrc();
  if (imageSrc && !imgError) {
    return (
      <div 
        className={cn(
          "rounded-full overflow-hidden flex-shrink-0 bg-gray-100",
          sizes[size],
          className
        )}
        onClick={onClick}
        style={{ cursor: onClick ? "pointer" : "default" }}
      >
        <img
          src={imageSrc}
          alt={name || "Avatar"}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // Fallback to initials avatar
  if (showFallback) {
    const fallbackSrc = getInitialsAvatar(name || "User");
    return (
      <div 
        className={cn(
          "rounded-full overflow-hidden flex-shrink-0 bg-secondary-soft",
          sizes[size],
          className
        )}
        onClick={onClick}
        style={{ cursor: onClick ? "pointer" : "default" }}
      >
        {fallbackSrc ? (
          <img
            src={fallbackSrc}
            alt={name || "Avatar"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-secondary font-semibold">
            {initials}
          </div>
        )}
      </div>
    );
  }

  // Last resort - show initials
  return (
    <div 
      className={cn(
        "rounded-full flex items-center justify-center bg-secondary-soft text-secondary font-semibold flex-shrink-0",
        sizes[size],
        className
      )}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      {initials}
    </div>
  );
}