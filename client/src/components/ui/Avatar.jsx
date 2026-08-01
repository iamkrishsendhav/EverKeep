import { cn } from "../../lib/cn";

const sizes = {
  sm: "h-8 w-8 text-xs rounded-xl",
  md: "h-10 w-10 text-sm rounded-2xl",
  lg: "h-12 w-12 text-base rounded-2xl",
};

const Avatar = ({ name = "EverKeep User", src, size = "md", className = "" }) => {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return src ? (
    <img src={src} alt={name} className={cn("object-cover", sizes[size], className)} />
  ) : (
    <span className={cn("grid shrink-0 place-items-center bg-slate-950 font-bold text-white", sizes[size], className)}>
      {initials || "EU"}
    </span>
  );
};

export default Avatar;
