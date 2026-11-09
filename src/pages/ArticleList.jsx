import React from 'react';
import { Link } from 'react-router-dom';

export default function ArticleList({ articles }) {
  if (!articles || articles.length === 0) {
    return <div className="p-6 text-center text-gray-500">記事が見つかりません。</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">記事一覧</h1>
      <div className="space-y-4">
        {articles.map((article) => (
          <Link
            key={article.id}
            to={`/articles/${article.id}`}
            className="block p-6 border-2 border-gray-200 rounded-xl shadow-md bg-white hover:shadow-lg hover:border-blue-400 transition"
          >
            <h2 className="text-xl font-bold text-blue-600 mb-2">{article.title}</h2>
            <p className="text-gray-600 text-sm">投稿者: {article.author} | 作成日: {article.createdAt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}