export function genRand(max: number, min: number) {
  return Math.floor(Math.random() * (max - 1 + min) + min);
}

export function getRand<T>(arr: T[]) {
  const random = Math.floor(Math.random() * arr.length);
  return arr[random];
}
