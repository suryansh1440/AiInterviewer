import { useState } from "react";
import { THEMES } from "../theme";

const Setting = () => {
    const [theme,setTheme] = useState("light")
  return (
    <div className="min-h-screen container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-8">
        {/* Theme Selection */}
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Theme</h2>
          <p className="text-sm text-base-content/70">Choose a theme for your interface</p>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {THEMES.map((t) => (
            <div key={t} data-theme={t} className="w-full">
              <button
                className={`
                  group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
                  hover:bg-base-200/50 w-full
                `}
                onClick={() => setTheme(t)}
              >
                <div className="relative h-8 w-full rounded-md overflow-hidden">
                  <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                    <div className="rounded bg-primary"></div>
                    <div className="rounded bg-secondary"></div>
                    <div className="rounded bg-accent"></div>
                    <div className="rounded bg-neutral"></div>
                  </div>
                </div>
                <span className="text-[11px] font-medium truncate w-full text-center">
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Setting;