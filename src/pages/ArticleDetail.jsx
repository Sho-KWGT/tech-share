import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../contexts/AuthContext';

// 💡 1. props から fetchArticles を受け取るようにします
export default function ArticleDetail({ fetchArticles }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;

    fetch(`${apiUrl}/articles/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("記事が見つかりません");
        return res.json();
      })
      .then((data) => {
        setArticle(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-6 text-center">読み込み中...</div>;
  if (!article) return <div className="p-6 text-center text-red-500">記事が見つかりませんでした。</div>;

  // ログインユーザーと記事の投稿者が一致するか判定（編集・削除ボタンの制御用）
  const isAuthor = user && user.name === article.author;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <Link to="/" className="text-blue-600 hover:underline text-sm mb-4 inline-block">
        &larr; 記事一覧に戻る
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">{article.title}</h1>
      <div className="text-gray-500 text-sm mb-6 pb-4 border-b flex justify-between items-center">
        <span>投稿者: {article.author} | 作成日: {article.createdAt}</span>

        {/* ログイン中の本人だけに編集・削除ボタンを表示する（合格基準 No.3, 4, 5） */}
        {isAuthor && (
          <div className="space-x-2">
            <button
              onClick={() => navigate(`/edit/${article.id}`)}
              className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 transition"
            >
              記事の編集
            </button>
            <button
              onClick={() => {
                if (window.confirm("本当にこの記事を削除しますか？")) {
                  const apiUrl = import.meta.env.VITE_API_URL;
                  fetch(`${apiUrl}/articles/${article.id}`, { method: 'DELETE' })
                    .then(() => {
                      // 💡 2. 削除が成功したら、一覧のデータを再取得する
                      if (fetchArticles) {
                        fetchArticles();
                      }
                      navigate('/');
                    })
                    .catch((err) => console.error("削除に失敗しました", err));
                }
              }}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition"
            >
              削除
            </button>
          </div>
        )}
      </div>

      {/* Markdown のレンダリング */}
      <div className="prose max-w-none text-gray-800 leading-relaxed space-y-4">
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </div>
    </div>
  );
}