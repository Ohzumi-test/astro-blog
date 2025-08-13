import type { MicroCMSPost } from '@/lib/microcms';

// カテゴリの型定義
export interface Category {
  id: string;
  name: string;
  slug: string;
}

// タグの型定義
export interface Tag {
  id: string;
  name: string;
  slug: string;
}

// 統一された記事の型
export interface UnifiedPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  pubDate: Date;
  heroImage?: string;
  category?: Category;
  tags?: Tag[];
  pinned?: boolean;
  notCompleted?: boolean;
  source: 'microcms';
  content?: string;
}

// microCMS記事をUnifiedPostに変換
export function microCMSToUnifiedPost(post: MicroCMSPost): UnifiedPost {
  return {
    id: post.id,
    slug: `microcms-${post.id}`,
    title: post.title,
    description: post.description,
    pubDate: new Date(post.publishedAt),
    heroImage: post.heroImage?.url,
    category: post.category,
    tags: post.tags || [],
    pinned: post.pinned,
    notCompleted: post.notCompleted,
    source: 'microcms',
    content: post.content,
  };
}