export const describedBy = (id: string, hint?: string, error?: string) => {
  const ids = [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ");
  return ids || undefined;
};
