export interface PaginationOptions {
  page: number;
  perPage: number;
}

export interface PaginatedResult<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
  perPage: number;
}

export function paginate<T>(
  items: T[],
  options: PaginationOptions
): PaginatedResult<T> {
  const { page, perPage } = options;
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const data = items.slice(startIndex, endIndex);
  
  return {
    data,
    currentPage,
    totalPages,
    totalItems,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    perPage,
  };
}

export function generatePageNumbers(currentPage: number, totalPages: number): (number | '...')[] {
  const pages: (number | '...')[] = [];
  const showPages = 5; // 表示するページ数
  
  if (totalPages <= showPages) {
    // 総ページ数が少ない場合は全て表示
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // 最初のページは常に表示
    pages.push(1);
    
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);
    
    // 現在のページが最初の方にある場合
    if (currentPage <= 3) {
      end = 4;
    }
    
    // 現在のページが最後の方にある場合
    if (currentPage >= totalPages - 2) {
      start = totalPages - 3;
    }
    
    // 省略記号を追加
    if (start > 2) {
      pages.push('...');
    }
    
    // 中間のページを追加
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }
    
    // 省略記号を追加
    if (end < totalPages - 1) {
      pages.push('...');
    }
    
    // 最後のページは常に表示
    if (totalPages > 1) {
      pages.push(totalPages);
    }
  }
  
  return pages;
}