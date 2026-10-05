import { create } from "zustand";

const NAV_COLLAPSED_KEY = "gtr-nav-collapsed";

function loadNavCollapsed() {
  try {
    return localStorage.getItem(NAV_COLLAPSED_KEY) === "1";
  } catch {
    return false;
  }
}

function persistNavCollapsed(collapsed: boolean) {
  try {
    localStorage.setItem(NAV_COLLAPSED_KEY, collapsed ? "1" : "0");
  } catch {
    return;
  }
}

type Store = {
  navCollapsed: boolean;
  toggleNavCollapsed: () => void;
  passwordRequired: boolean;
  setPasswordRequired: (required: boolean) => void;
};

const useStore = create<Store>((set, get) => ({
  navCollapsed: loadNavCollapsed(),
  toggleNavCollapsed: () => {
    const next = !get().navCollapsed;
    persistNavCollapsed(next);
    set({ navCollapsed: next });
  },
  passwordRequired: false,
  setPasswordRequired: (required) => set({ passwordRequired: required }),
}));

export default useStore;
