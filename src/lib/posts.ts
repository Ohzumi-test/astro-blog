import { getCollection } from 'astro:content';
import { getMicroCMSPosts, getMicroCMSCategories, getMicroCMSTags } from '@/lib/microcms';
import { markdownToUnifiedPost, microCMSToUnifiedPost, type UnifiedPost } from '@/types/post';
import type { Category, Tag } from '@/types/post';

// 全ての記事を取得して統合する関数
export async function getAllPosts(): Promise<UnifiedPost[]> {
  // microCMS記事を取得
  const microCMSPosts = await getMicroCMSPosts();
  const unifiedMicroCMSPosts = microCMSPosts.map(microCMSToUnifiedPost);

  // マークダウン記事を取得（フォールバック用）
  let unifiedMarkdownPosts: UnifiedPost[] = [];
  try {
    const markdownPosts = await getCollection('blog');
    unifiedMarkdownPosts = markdownPosts.map(markdownToUnifiedPost);
  } catch (error) {
    console.warn('Failed to load markdown posts:', error);
  }

  // microCMS記事を優先し、マークダウン記事をフォールバックとして使用
  const allPosts = unifiedMicroCMSPosts.length > 0 
    ? unifiedMicroCMSPosts 
    : [...unifiedMicroCMSPosts, ...unifiedMarkdownPosts];
  
  return allPosts
    .filter(post => !post.notCompleted)
    .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());
}

// カテゴリ別の記事を取得
export async function getPostsByCategory(categorySlug: string): Promise<UnifiedPost[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter(post => post.category?.slug === categorySlug);
}

// タグ別の記事を取得
export async function getPostsByTag(tagSlug: string): Promise<UnifiedPost[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter(post => 
    post.tags?.some(tag => tag.slug === tagSlug)
  );
}

// 全てのカテゴリを取得
export async function getAllCategories(): Promise<Category[]> {
  try {
    // microCMSからカテゴリを取得
    const microCMSCategories = await getMicroCMSCategories();
    if (microCMSCategories.length > 0) {
      return microCMSCategories.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug
      }));
    }
  } catch (error) {
    console.error('Failed to fetch categories from microCMS:', error);
  }

  // フォールバック: 記事からカテゴリを抽出
  const allPosts = await getAllPosts();
  const categoryMap = new Map<string, Category>();
  
  allPosts.forEach(post => {
    if (post.category) {
      categoryMap.set(post.category.slug, post.category);
    }
  });
  
  return Array.from(categoryMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}

// 全てのタグを取得
export async function getAllTags(): Promise<Tag[]> {
  try {
    // microCMSからタグを取得
    const microCMSTags = await getMicroCMSTags();
    if (microCMSTags.length > 0) {
      return microCMSTags.map(tag => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug
      }));
    }
  } catch (error) {
    console.error('Failed to fetch tags from microCMS:', error);
  }

  // フォールバック: 記事からタグを抽出
  const allPosts = await getAllPosts();
  const tagMap = new Map<string, Tag>();
  
  allPosts.forEach(post => {
    post.tags?.forEach(tag => {
      tagMap.set(tag.slug, tag);
    });
  });
  
  return Array.from(tagMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}

// ピン留めされた記事のみを取得
export async function getPinnedPosts(): Promise<UnifiedPost[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter(post => post.pinned);
}