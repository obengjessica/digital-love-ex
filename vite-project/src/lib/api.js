export const buildApiUrl = (path) => {
  const base = import.meta.env.VITE_API_BASE_URL || "";
  if (!base) {
    return path;
  }
  return `${base.replace(/\/$/, "")}${path}`;
};
