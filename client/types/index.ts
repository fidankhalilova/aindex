// types/index.ts
//
// Strapi v5 — flat response shape, confirmed against live API response.
// Field names verified from /api/tools?populate=*

// ---------------------------------------------------------------------------
// Media
// ---------------------------------------------------------------------------

export interface StrapiImageFormats {
  thumbnail?: { url: string; width: number; height: number };
  small?: { url: string; width: number; height: number };
  medium?: { url: string; width: number; height: number };
  large?: { url: string; width: number; height: number };
}

export interface StrapiImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText?: string;
  caption?: string;
  url: string;
  width: number;
  height: number;
  formats?: StrapiImageFormats;
  mime: string;
  size: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// ---------------------------------------------------------------------------
// Category
// ---------------------------------------------------------------------------

export interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  // Only present when fetched with populate
  tools?: Tool[];
}

// ---------------------------------------------------------------------------
// Feature
// ---------------------------------------------------------------------------

export interface Feature {
  id: number;
  documentId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// ---------------------------------------------------------------------------
// Tag
// ---------------------------------------------------------------------------

export interface Tag {
  id: number;
  documentId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// ---------------------------------------------------------------------------
// User
// ---------------------------------------------------------------------------

export interface User {
  id: number;
  documentId: string;
  username: string;
  password: string;
  email: string;
  provider?: string;
  confirmed?: boolean;
  blocked?: boolean;
  bio?: string;
  avatar?: {
    id: number;
    url: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// ---------------------------------------------------------------------------
// Review
// ---------------------------------------------------------------------------

export interface Review {
  id: number;
  documentId: string;
  rating: number;
  title?: string;
  content: string;
  pros?: string;
  cons?: string;
  isVerified: boolean;
  helpful: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  // Populated relations (flat in v5)
  user?: User;
  tool?: Tool;
}

// ---------------------------------------------------------------------------
// Tool
// Relation field names confirmed from /api/tools?populate=*:
//   logo        → StrapiImage   (single media)
//   categories  → Category[]    (plural — NOT "category")
//   features    → Feature[]
//   tags        → Tag[]
//   screenshots → StrapiImage   (nullable)
//   submittedBy → User
//   reviews     → Review[]
// ---------------------------------------------------------------------------

export interface Tool {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  website: string;
  pricing:
    | "free"
    | "freemium"
    | "paid"
    | "enterprise"
    | "Freemium"
    | "Free"
    | "Paid"
    | "Enterprise";
  pricingDetails: string;
  averageRating: number;
  reviewsCount: number;
  viewsCount: number;
  isVerified: boolean;
  isFeatured: boolean;
  state: "Draft" | "Published" | "Rejected";
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  // Populated relations
  logo?: StrapiImage;
  categories?: Category[]; // ← plural, confirmed
  features?: Feature[];
  tags?: Tag[];
  screenshots?: StrapiImage | null;
  submittedBy?: User;
  reviews?: Review[];
}

// ---------------------------------------------------------------------------
// API envelope
// ---------------------------------------------------------------------------

export interface ApiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// ---------------------------------------------------------------------------
// Query params
// ---------------------------------------------------------------------------

export interface ToolsQueryParams {
  search?: string;
  category?: string;
  pricing?: string;
  sort?: "newest" | "rating" | "popular" | "name";
  page?: number;
  pageSize?: number;
  featured?: boolean;
  verified?: boolean;
}

// ---------------------------------------------------------------------------
// Mutation payloads
// ---------------------------------------------------------------------------

export interface ReviewCreateData {
  rating: number;
  title?: string;
  content: string;
  pros?: string;
  cons?: string;
  tool: number;
  user: number;
}

export interface ToolSubmitData {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  website: string;
  pricing: string;
  pricingDetails: string;
  features: number[]; // IDs for relation
  tags: number[];
  categories: number[]; // ← plural, confirmed
  submittedBy: number;
}
