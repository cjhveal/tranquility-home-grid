export function randomInt(n: number): number {
  return Math.floor(Math.random()*n);
}

export function sample<T>(list: T[]): T {
  return list[randomInt(list.length)];
}

export function choose<T>(n: number, list: T[]): T[] {
  const candidates: T[] = [...list];
  const chosen: T[] = [];

  if (n >= candidates.length) {
    return candidates;
  }

  for (let i = 0; i < n; i++) {
    const j = randomInt(candidates.length);
    chosen.push(candidates[j]);
    candidates.splice(j, 1);
  }

  return chosen;
}

export function shuffle<T>(list: readonly T[]): T[] {
  const next = [...list];
  for (let i = next.length - 1; i >= 1; i--) {
    const j = randomInt(i+1);
    const tmp = next[j];
    next[j] = next[i];
    next[i] = tmp;
  }

  return next;
}
