export function groupBy<T>(items: T[], getKey: (item: T) => undefined|string|number): Record<string|number, T[]> {
  const output: Record<string|number, T[]> = {};

  for (const item of items) {
    const group = getKey(item);
    if (group === undefined) continue;
    output[group] =  output[group] || [];
    output[group].push(item)
  }

  return output;
}
