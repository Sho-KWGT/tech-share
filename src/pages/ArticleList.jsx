import React from 'react';
import { Link } from 'react-router-dom';

export default function ArticleList({ articles }) {
  if (!articles || articles.length === 0) {
    return <div style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>記事が見つかりません。</div>;
  }

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>記事一覧</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {articles.map((article) => (
          <Link
            key={article.id}
            to={`/articles/${article.id}`}
            style={{
              display: 'block',
              padding: '20px',
              border: '2px solid #d1d5db',
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
    </div>
  );
}