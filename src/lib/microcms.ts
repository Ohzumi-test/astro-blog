import { createClient } from 'microcms-js-sdk';

// microCMSクライアントの設定
export const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN || 'your-service-domain',
  apiKey: import.meta.env.MICROCMS_API_KEY || 'your-api-key',
});

// microCMSの記事の型定義
export interface MicroCMSPost {
  id: string;
  title: string;
  description: string;
  content: string;
  publishedAt: string;
  updatedAt: string;
  heroImage?: {
    url: string;
    alt?: string;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  tags?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  pinned?: boolean;
  notCompleted?: boolean;
}

// microCMSのカテゴリの型定義
export interface MicroCMSCategory {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

// microCMSのタグの型定義
export interface MicroCMSTag {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

// microCMSから記事を取得する関数
export async function getMicroCMSPosts(): Promise<MicroCMSPost[]> {
  try {
    const response = await client.get({
      endpoint: 'posts',
      queries: {
        limit: 100,
        orders: '-publishedAt',
      },
    });

    return response.contents || [];
  } catch (error) {
    console.error('Failed to fetch microCMS posts:', error);
    return [];
  }
}

// 単一の記事を取得する関数
export async function getMicroCMSPost(id: string): Promise<MicroCMSPost | null> {
  try {
    const post = await client.get({
      endpoint: 'posts',
      contentId: id,
    });

    return post;
  } catch (error) {
    console.error(`Failed to fetch microCMS post ${id}:`, error);
    return null;
  }
}

// microCMSからカテゴリを取得する関数
export async function getMicroCMSCategories(): Promise<MicroCMSCategory[]> {
  try {
    const response = await client.get({
      endpoint: 'categories',
      queries: {
        limit: 100,
        orders: 'name',
      },
    });

    return response.contents || [];
  } catch (error) {
    console.error('Failed to fetch microCMS categories:', error);
    return [];
  }
}

// microCMSからタグを取得する関数
export async function getMicroCMSTags(): Promise<MicroCMSTag[]> {
  try {
    const response = await client.get({
      endpoint: 'tags',
      queries: {
        limit: 100,
        orders: 'name',
      },
    });

    return response.contents || [];
  } catch (error) {
    console.error('Failed to fetch microCMS tags:', error);
    return [];
  }
}