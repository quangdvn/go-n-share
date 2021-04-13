export function getShift(shift: number[], duration: number) {
  for (let i = 0; i < shift.length; i++) {
    if (duration < shift[i]) {
      return {
        next: false,
        shift: shift[i],
      };
    }
  }
  return {
    next: true,
    shift: shift[0],
  };
}
