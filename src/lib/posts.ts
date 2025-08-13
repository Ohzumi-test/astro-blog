import { getCollection } from 'astro:content';
import { getMicroCMSPosts } from '@/lib/microcms';
import { markdownToUnifiedPost, microCMSToUnifiedPost, type UnifiedPost } from '@/types/post';
import type { Category, Tag } from '@/types/post';

// 全ての記事を取得して統合する関数
export async function getAllPosts(): Promise<UnifiedPost[]> {
  // マークダウン記事を取得
  const markdownPosts = await getCollection('blog');
  const unifiedMarkdownPosts = markdownPosts.map(markdownToUnifiedPost);

  // microCMS記事を取得
  const microCMSPosts = await getMicroCMSPosts();
  const unifiedMicroCMSPosts = microCMSPosts.map(microCMSToUnifiedPost);

  // 両方を結合してソート
  const allPosts = [...unifiedMarkdownPosts, ...unifiedMicroCMSPosts];
  
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