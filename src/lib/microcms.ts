import { createClient } from 'microcms-js-sdk';

// 環境変数の検証
const serviceDomain = import.meta.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = import.meta.env.MICROCMS_API_KEY;

// microCMSが設定されているかチェック
const isMicroCMSConfigured = serviceDomain && 
  apiKey && 
  serviceDomain !== 'your-service-domain' && 
  apiKey !== 'your-api-key';

// microCMSクライアントの設定
export const client = isMicroCMSConfigured ? createClient({
  serviceDomain: serviceDomain,
  apiKey: apiKey,
}) : null;

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
  // microCMSが設定されていない場合は空配列を返す
  if (!client) {
    console.log('microCMS is not configured. Skipping microCMS posts fetch.');
    return [];
  }

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
  // microCMSが設定されていない場合はnullを返す
  if (!client) {
    console.log('microCMS is not configured. Cannot fetch microCMS post.');
    return null;
  }

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
  // microCMSが設定されていない場合は空配列を返す
  if (!client) {
    console.log('microCMS is not configured. Skipping microCMS categories fetch.');
    return [];
  }

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
  // microCMSが設定されていない場合は空配列を返す
  if (!client) {
    console.log('microCMS is not configured. Skipping microCMS tags fetch.');
    return [];
  }

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