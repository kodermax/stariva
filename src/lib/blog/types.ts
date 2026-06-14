export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  coverImage: string;
  content: BlogContent[];
}

export interface BlogContent {
  type: "paragraph" | "heading" | "image" | "quote";
  text?: string;
  src?: string;
  alt?: string;
  caption?: string;
}
