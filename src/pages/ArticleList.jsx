import React from 'react';
import { Link } from 'react-router-dom';

export default function ArticleList({ articles }) {
  if (!articles || articles.length === 0) {
    return <div style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>記事が見つかりません。</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {articles.map((article) => (
        <Link
          key={article.id}
          to={`/articles/${article.id}`}
          style={{
            display: 'block',
            padding: '24px',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            textDecoration: 'none'
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb', marginBottom: '8px' }}>{article.title}</h2>
          <p style={{ color: '#4b5563', fontSize: '14px', margin: 0 }}>投稿者: {article.author} | 作成日: {article.createdAt}</p>
        </Link>
      ))}
    </div>
  );
}