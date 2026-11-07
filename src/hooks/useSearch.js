import { useState, useMemo } from 'react';

export function useSearch(articles) {
  const [searchTerm, setSearchTerm] = useState('');

  // useMemo を使ってパフォーマンスを最適化した検索フィルタリング
  const filteredArticles = useMemo(() => {
    if (!searchTerm.trim()) {
      return articles;
    }

    const lowerQuery = searchTerm.toLowerCase();

    return articles.filter((article) => {
      const titleMatch = article.title?.toLowerCase().includes(lowerQuery);
      const contentMatch = article.content?.toLowerCase().includes(lowerQuery);
      return titleMatch || contentMatch;
    });
  }, [articles, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredArticles,
  };
}