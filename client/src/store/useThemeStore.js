import { create } from "zustand";

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("web-theme") || "coffee",
    setTheme: (theme) => {
        localStorage.setItem("web-theme",theme);
        set({theme})
    }
}))