export const APP_NAME = "NextRep";

export function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
