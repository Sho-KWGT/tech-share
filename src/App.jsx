import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/templates/Layout';
import ArticleList from './pages/ArticleList';
import ArticleDetail from './pages/ArticleDetail';
import ArticleCreate from './pages/ArticleCreate';
import ArticleEdit from './pages/ArticleEdit'; // ← 追加
import { useSearch } from './hooks/useSearch';

export default function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;

    fetch(`${apiUrl}/articles`)
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("データの取得に失敗しました:", err);
        setLoading(false);
      });
  }, []);

  const { searchTerm, setSearchTerm, filteredArticles } = useSearch(articles);

  if (loading) return <div className="p-6 text-center">読み込み中...</div>;

  return (
    <Layout searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
      <Routes>
        <Route
          path="/"
          element={<ArticleList articles={filteredArticles} />}
        />
        <Route
          path="/articles/:id"
          element={<ArticleDetail />}
        />
        <Route
          path="/create"
          element={<ArticleCreate />}
        />
        {/* 編集画面のルートを追加 */}
        <Route
          path="/edit/:id"
          element={<ArticleEdit />}
        />
      </Routes>
    </Layout>
  );
}