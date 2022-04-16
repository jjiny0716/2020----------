export function setColorThemeByOSTheme() {
  const root = document.documentElement;
  if (window.matchMedia && window.matchMedia("prefers-color-scheme: dark").matches) {
    root.setAttribute("color-theme", "dark");
  } else root.setAttribute("color-theme", "light");
}
