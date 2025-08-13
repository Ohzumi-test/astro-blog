import type { CollectionEntry } from 'astro:content';
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
  source: 'markdown' | 'microcms';
  content?: string; // microCMSの場合のみ
}

// マークダウン記事をUnifiedPostに変換
export function markdownToUnifiedPost(post: CollectionEntry<'blog'>): UnifiedPost {
  // マークダウンのカテゴリとタグを変換
  const category = post.data.category ? {
    id: post.data.category,
    name: post.data.category,
    slug: post.data.category.toLowerCase().replace(/\s+/g, '-')
  } : undefined;

  const tags = post.data.tags?.map(tag => ({
    id: tag,
    name: tag,
    slug: tag.toLowerCase().replace(/\s+/g, '-')
  })) || [];

  return {
    id: post.slug,
    slug: post.slug,
    title: post.data.title,
    description: post.data.description,
    pubDate: post.data.pubDate,
    heroImage: post.data.heroImage,
    category,
    tags,
    pinned: post.data.pinned,
    notCompleted: post.data.notCompleted,
    source: 'markdown',
  };
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