export function getUniqueItems(arr, count) {
  const result = new Set();
  while (result.size < count) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    result.add(arr[randomIndex]);
  }
  return Array.from(result);
}
