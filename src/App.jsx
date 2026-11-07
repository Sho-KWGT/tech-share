import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
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

  // useSearch フックの戻り値（searchTerm または searchQuery）に合わせて調整してください
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
          element={<ArticleDetail articles={articles} setArticles={setArticles} />}
        />
        {/* 未ログインで /create を開いた場合、PrivateRoute が働いてトップへ戻ります */}
        <Route
          path="/create"
          element={
            <PrivateRoute>
              <ArticleCreate articles={articles} setArticles={setArticles} />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <PrivateRoute>
              <ArticleEdit articles={articles} setArticles={setArticles} />
            </PrivateRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </BrowserRouter>
  );
}