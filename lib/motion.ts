export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

/** Detects WebGL support (needed for the 3D scene). */
export function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}
