// lib/getStrapiMedia.ts

/**
 * Get the full URL for a Strapi media file
 * Handles both local development and production URLs
 *
 * @param url - The URL or path from Strapi (can be relative or absolute)
 * @returns The complete URL to the media file
 */
export function getStrapiMedia(url: string | null | undefined): string | null {
  if (!url) return null;

  // If it's already a full URL, return it as is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Get the Strapi API URL from environment variables
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;

  if (!strapiUrl) {
    console.warn("NEXT_PUBLIC_STRAPI_API_URL is not set");
    return null;
  }

  // Remove trailing slash from Strapi URL if present
  const baseUrl = strapiUrl.replace(/\/$/, "");

  // Ensure the URL starts with a slash
  const path = url.startsWith("/") ? url : `/${url}`;

  return `${baseUrl}${path}`;
}

/**
 * Get optimized image URL with Strapi's built-in image transformation
 *
 * @param url - The original image URL
 * @param width - Desired width (optional)
 * @param height - Desired height (optional)
 * @param format - Desired format (optional)
 * @returns The transformed image URL
 */
export function getOptimizedImage(
  url: string | null | undefined,
  width?: number,
  height?: number,
  format?: "jpeg" | "png" | "webp" | "avif",
): string | null {
  const baseUrl = getStrapiMedia(url);
  if (!baseUrl) return null;

  const params = new URLSearchParams();
  if (width) params.append("width", width.toString());
  if (height) params.append("height", height.toString());
  if (format) params.append("format", format);

  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Get responsive image srcSet for different screen sizes
 *
 * @param url - The original image URL
 * @param widths - Array of widths for responsive images
 * @returns srcSet string for use in img tag
 */
export function getResponsiveSrcSet(
  url: string | null | undefined,
  widths: number[] = [320, 640, 768, 1024, 1280, 1536],
): string | null {
  const baseUrl = getStrapiMedia(url);
  if (!baseUrl) return null;

  return widths
    .map((width) => `${baseUrl}?width=${width} ${width}w`)
    .join(", ");
}
