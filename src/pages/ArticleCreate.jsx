import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../contexts/AuthContext';

export default function ArticleCreate() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 未ログインの場合、強制的にトップページにリダイレクトする（合格基準 No.5）
  useEffect(() => {
    if (!user) {
      alert("ログインが必要です。");
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return null;

  // 記事の投稿処理
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("タイトルと本文を入力してください。");
      return;
    }

    setSubmitting(true);
    const apiUrl = import.meta.env.VITE_API_URL;

    // 現在の日付を YYYY-MM-DD 形式で取得
    const today = new Date().toISOString().split('T')[0];

    const newArticle = {
      title,
      content,
      author: user.name,
      createdAt: today,
    };

    fetch(`${apiUrl}/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newArticle),
    })
      .then((res) => {
        if (!res.ok) throw new Error("記事の投稿に失敗しました");
        return res.json();
      })
      .then(() => {
        navigate('/'); // 投稿成功後にトップページへ戻る
      })
      .catch((err) => {
        console.error(err);
        alert("エラーが発生しました。");
        setSubmitting(false);
      });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">新規記事作成</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="記事のタイトルを入力..."
            required
          />
        </div>

        {/* プレビュー付きの入力欄（合格基準 No.2） */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">本文 (Markdown)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="12"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="Markdown形式で本文を入力..."
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">プレビュー</label>
            <div className="w-full h-[288px] px-3 py-2 border rounded-lg bg-gray-50 overflow-y-auto prose max-w-none text-sm">
              {content ? (
                <ReactMarkdown>{content}</ReactMarkdown>
              ) : (
                <span className="text-gray-400">プレビューがここに表示されます...</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 border text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {submitting ? '投稿中...' : '記事を投稿する'}
          </button>
        </div>
      </form>
    </div>
  );
}