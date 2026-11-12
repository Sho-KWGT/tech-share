import React, { useEffect, useState, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/templates/Layout';
import ArticleList from './pages/ArticleList';
import ArticleDetail from './pages/ArticleDetail';
import ArticleCreate from './pages/ArticleCreate';
import ArticleEdit from './pages/ArticleEdit';
import { useSearch } from './hooks/useSearch';

// 未ログイン時にリダイレクトするための保護コンポーネント
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" replace />;
}

function MainApp() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // 💡 記事一覧を再取得する関数を定義
  const fetchArticles = useCallback(() => {
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

  // 💡 初回ロード時に取得を実行
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const {
    searchTerm,
    setSearchTerm,
    filteredArticles
  } = useSearch(articles);

  if (loading) {
    return (
      <div className="p-6 text-center">
        読み込み中...
      </div>
    );
  }

  return (
    <Layout
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    >
      <Routes>
        <Route
          path="/"
          element={<ArticleList articles={filteredArticles} />}
        />

        {/* 💡 fetchArticles を props として渡す */}
        <Route
          path="/articles/:id"
          element={
            <ArticleDetail
              articles={articles}
              fetchArticles={fetchArticles}
            />
          }
        />

        <Route
          path="/create"
          element={
            <PrivateRoute>
              <ArticleCreate
                fetchArticles={fetchArticles}
              />
            </PrivateRoute>
          }
        />

        <Route
          path="/edit/:id"
          element={
            <PrivateRoute>
              <ArticleEdit
                fetchArticles={fetchArticles}
              />
            </PrivateRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return <MainApp />;
}