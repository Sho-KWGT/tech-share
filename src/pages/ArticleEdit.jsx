import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../contexts/AuthContext';

export default function ArticleEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 未ログインの場合トップページにリダイレクト（合格基準 No.5）
  useEffect(() => {
    if (!user) {
      alert("ログインが必要です。");
      navigate('/');
    }
  }, [user, navigate]);

  // 既存の記事データを取得
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;

    fetch(`${apiUrl}/articles/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("記事が見つかりません");
        return res.json();
      })
      .then((data) => {
        // 本人以外が直接編集URLを開いた場合のリダイレクト保護
        if (user && user.name !== data.author) {
          alert("他人の記事は編集できません。");
          navigate('/');
          return;
        }

        setTitle(data.title);
        setContent(data.content);
        setCreatedAt(data.createdAt); // 作成日を保持
        setAuthor(data.author);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("記事データの取得に失敗しました。");
        navigate('/');
      });
  }, [id, user, navigate]);

  // 記事の更新処理
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("タイトルと本文を入力してください。");
      return;
    }

    setSubmitting(true);
    const apiUrl = import.meta.env.VITE_API_URL;

    // createdAt は元のまま保持し、title と content のみ更新（合格基準 No.3）
    const updatedArticle = {
      title,
      content,
      author,
      createdAt,
    };

    fetch(`${apiUrl}/articles/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedArticle),
    })
      .then((res) => {
        if (!res.ok) throw new Error("記事の更新に失敗しました");
        return res.json();
      })
      .then(() => {
        navigate(`/articles/${id}`); // 更新後に詳細ページに戻る
      })
      .catch((err) => {
        console.error(err);
        alert("更新中にエラーが発生しました。");
        setSubmitting(false);
      });
  };

  if (!user || loading) return <div className="p-6 text-center">読み込み中...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      {/* 見出し：「記事の編集」（合格基準 No.3） */}
      <h1 className="text-2xl font-bold mb-6 text-gray-800">記事の編集</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">本文 (Markdown)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="12"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
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
            onClick={() => navigate(`/articles/${id}`)}
            className="px-4 py-2 border text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
          >
            キャンセル
          </button>
          {/* ボタン：「更新する」（合格基準 No.3） */}
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {submitting ? '更新中...' : '更新する'}
          </button>
        </div>
      </form>
    </div>
  );
}