# TechShare

技術に関する知識やノウハウを共有するためのWebアプリケーション（SPA）です。

## アプリケーション概要
開発者向けの技術共有プラットフォームとして、記事の投稿、詳細閲覧、編集、削除、検索機能などを実装しています。

## 公開URL
- **フロントエンド（Vercel）**: [https://tech-share-nine.vercel.app/]
- **バックエンド（Render）**: [https://tech-share-zx7q.onrender.com]

## 主な機能
- **ユーザー認証機能**: 簡易的なログイン・ログアウト機能（Context APIを使用）
- **記事一覧・検索機能**: 記事の閲覧およびキーワードによるリアルタイム検索（カスタムフック・useMemoを活用）
- **記事のCRUD操作**: 
  - 新規作成（Markdownプレビュー機能付き）
  - 詳細表示・Markdownレンダリング
  - 編集（本人確認機能付き）
  - 削除機能
- **レスポンシブデザイン**: Tailwind CSSを用いたマルチデバイス対応

## 使用技術（Tech Stack）
- **フロントエンド**: React, React Router, Vite, Tailwind CSS, react-markdown
- **バックエンド**: Node.js / Express (JSON Serverなど)
- **デプロイ・ホスティング**: Vercel (Frontend), Render (Backend)

## 工夫した点
- 記事の投稿・編集・削除を行った際、ページをリロードしなくても即座に一覧や詳細画面のデータが更新されるよう、状態管理とAPIの再取得処理を最適化しました。
- ログイン中のユーザー本人だけが編集・削除ボタンを行えるように権限チェックを実装しています。
- Markdown形式での入力とプレビューを同時に確認しながら記事を作成できるようにしました。