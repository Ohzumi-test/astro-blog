import type { CollectionEntry } from 'astro:content';
import type { MicroCMSPost } from '@/lib/microcms';

// 統一された記事の型
export interface UnifiedPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  pubDate: Date;
  heroImage?: string;
  pinned?: boolean;
  notCompleted?: boolean;
  source: 'markdown' | 'microcms';
  content?: string; // microCMSの場合のみ
}

// マークダウン記事をUnifiedPostに変換
export function markdownToUnifiedPost(post: CollectionEntry<'blog'>): UnifiedPost {
  return {
    id: post.slug,
    slug: post.slug,
    title: post.data.title,
    description: post.data.description,
    pubDate: post.data.pubDate,
    heroImage: post.data.heroImage,
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
    pinned: post.pinned,
    notCompleted: post.notCompleted,
    source: 'microcms',
    content: post.content,
  };
}