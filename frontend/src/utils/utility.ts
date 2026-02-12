export function randomColor() {
   const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 40) + 60; // 60–100%
  const lightness = Math.floor(Math.random() * 15) + 10;  // 10–25% (very dark)

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}