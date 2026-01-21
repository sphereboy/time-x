const TIME_COLORS = [
  { time: 0, color: "#16053a" },
  { time: 1, color: "#040B1D" },
  { time: 2, color: "#030c1b" },
  { time: 3, color: "#040F21" },
  { time: 4, color: "#081930" },
  { time: 5, color: "#1b475b" },
  { time: 6, color: "#477a88" },
  { time: 7, color: "#69aab1" },
  { time: 8, color: "#93c6bc" },
  { time: 9, color: "#c1dabe" },
  { time: 10, color: "#e9ebb5" },
  { time: 11, color: "#F5EB9F" },
  { time: 12, color: "#f9e886" },
  { time: 13, color: "#FEE56D" },
  { time: 14, color: "#fbcf63" },
  { time: 15, color: "#F7B45B" },
  { time: 16, color: "#f29b55" },
  { time: 17, color: "#d37d5c" },
  { time: 18, color: "#9a626a" },
  { time: 19, color: "#6a4277" },
  { time: 20, color: "#4D2971" },
  { time: 21, color: "#2d1852" },
  { time: 22, color: "#301755" },
  { time: 23, color: "#0C052C" },
  { time: 24, color: "#16053a" },
];

const getColorComponent = (
  start: number,
  end: number,
  ratio: number
): number => {
  return Math.round(start + (end - start) * ratio);
};

const interpolateColor = (
  color1: string,
  color2: string,
  ratio: number
): string => {
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);
  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);

  const r = getColorComponent(r1, r2, ratio);
  const g = getColorComponent(g1, g2, ratio);
  const b = getColorComponent(b1, b2, ratio);

  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

export const getBackgroundColor = (hour: number): string => {
  for (let i = 0; i < TIME_COLORS.length - 1; i++) {
    if (hour >= TIME_COLORS[i].time && hour <= TIME_COLORS[i + 1].time) {
      const ratio =
        (hour - TIME_COLORS[i].time) /
        (TIME_COLORS[i + 1].time - TIME_COLORS[i].time);
      return interpolateColor(
        TIME_COLORS[i].color,
        TIME_COLORS[i + 1].color,
        ratio
      );
    }
  }
  return "#000000";
};

export const isLightColor = (color: string): boolean => {
  const hex = color.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155;
};
