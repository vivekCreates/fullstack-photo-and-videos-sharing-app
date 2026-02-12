export function randomColor() {
   const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 40) + 60; // 60–100%
  const lightness = Math.floor(Math.random() * 15) + 10;  // 10–25% (very dark)

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export const convertDate = (date:Date) => {
const formattedDate = new Date(date).toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});
return formattedDate
}