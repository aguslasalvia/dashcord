// All the colors, corner radii and fonts used across the app live here, so
// changing the look of the whole app means editing this one file.
export const colors = {
  bg: "#0c0c10",
  bgElev: "#16161d",
  bgElev2: "#1f1f28",
  bgElev3: "#2a2a35",
  border: "#232330",
  borderStrong: "#32323f",

  text: "#f4f4f6",
  textMuted: "#9a9aa8",
  textFaint: "#56565f",

  accent: "#f43f5e",
  accentHover: "#fb7185",
  accentSoft: "rgba(244, 63, 94, 0.14)",
  accentInk: "#fff5f7",

  success: "#34d399",
  danger: "#f43f5e",
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 22,
  full: 999,
};

// Space Grotesk carries brand/display moments (wordmark, screen titles, now-playing
// track name, big numbers). Everything else uses the OS system font on purpose —
// that's what makes it read as a native app instead of a ported web page.
export const fonts = {
  medium: "SpaceGrotesk_500Medium",
  semibold: "SpaceGrotesk_600SemiBold",
  bold: "SpaceGrotesk_700Bold",
};
