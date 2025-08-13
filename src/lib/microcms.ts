import { createClient } from 'microcms-js-sdk';

// microCMSクライアントの設定
export const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN || '',
  apiKey: import.meta.env.MICROCMS_API_KEY || '',
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
  pinned?: boolean;
  notCompleted?: boolean;
}

// microCMSから記事を取得する関数
export async function getMicroCMSPosts(): Promise<MicroCMSPost[]> {
  try {
    if (!import.meta.env.MICROCMS_SERVICE_DOMAIN || !import.meta.env.MICROCMS_API_KEY) {
      console.warn('microCMS credentials not found. Skipping microCMS posts.');
      return [];
    }

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
    if (!import.meta.env.MICROCMS_SERVICE_DOMAIN || !import.meta.env.MICROCMS_API_KEY) {
      return null;
    }

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