export default function parseEnum<T extends string>(values: readonly T[], value: unknown): T | undefined {
  return values.find((item) => item === value);
}
