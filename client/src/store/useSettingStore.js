import { create } from "zustand";

export const useSettingStore = create((set, get) => ({
    theme: localStorage.getItem("web-theme") || "forest",
    voice: localStorage.getItem("web-voice") || "sarah",
    setTheme: (theme) => {
        localStorage.setItem("web-theme", theme);
        set({ theme });
    },
    setVoice: (voice) => {
        localStorage.setItem("web-voice", voice);
        set({ voice });
    },
    getCurrentVoice: () => {
        const state = get();
        return state.voice;
    }
}));