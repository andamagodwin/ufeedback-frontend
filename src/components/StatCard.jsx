import { useState } from "react";

// Utility to join class names (since you're not using TypeScript, define cn here)
function cn(...args) {
  return args.filter(Boolean).join(" ");
}

export const StatCard = ({ title, value, icon, className }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "bg-white p-6 rounded-2xl flex items-center space-x-4 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "text-3xl text-brand-blue bg-blue-50 p-3 rounded-xl transition-transform duration-300 ease-in-out",
          isHovered && "rotate-12"
        )}
      >
        {icon}
      </div>
      <div>
        <h2 className="text-sm font-medium text-gray-500 mb-1">{title}</h2>
        <p className="text-2xl font-bold text-brand-blue">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;