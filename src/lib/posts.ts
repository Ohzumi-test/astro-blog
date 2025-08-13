import { getCollection } from 'astro:content';
import { getMicroCMSPosts } from '@/lib/microcms';
import { markdownToUnifiedPost, microCMSToUnifiedPost, type UnifiedPost } from '@/types/post';

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

// ピン留めされた記事のみを取得
export async function getPinnedPosts(): Promise<UnifiedPost[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter(post => post.pinned);
}