import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Layout({ children, searchTerm, setSearchTerm }) {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 共通ヘッダー */}
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-gray-800 hover:text-blue-600 transition">
            TechShare
          </Link>

          {/* 検索フォーム（トップページ等で利用） */}
          {setSearchTerm && (
            <div className="flex-1 max-w-md mx-6">
              <input
                type="text"
                placeholder="記事を検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* 認証状態に応じたボタン切り替え */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <button
                  onClick={() => navigate('/create')}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                  記事を書く
                </button>
                {/* 変更箇所：「ようこそ、」を追加しました */}
                <span className="text-sm text-gray-600 font-medium">ようこそ、{user.name}さん</span>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <button
                onClick={login}
                className="px-3 py-1.5 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition"
              >
                ログイン
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 各ページのメインコンテンツ */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6">
        {children}
      </main>
    </div>
  );
}