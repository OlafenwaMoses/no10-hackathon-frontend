export default function columnLetter(index: number) {
  let result = "";
  let remaining = index + 1;
  while (remaining > 0) {
    const offset = (remaining - 1) % 26;
    result = String.fromCharCode(65 + offset) + result;
    remaining = Math.floor((remaining - 1) / 26);
  }
  return result;
}
