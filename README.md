# 🍶 酒屋 - お酒とおつまみの通販サイト

Next.jsで構築された日本酒とおつまみの通販サイトです。GitHub Pagesで自動デプロイされます。

## 🚀 デプロイ状況

このプロジェクトはGitHub ActionsとGitHub Pagesを使用して自動デプロイされます。

### デプロイURL
- **本番サイト**: `https://YOUR_USERNAME.github.io/sake-shop/`
- **リポジトリ**: `https://github.com/YOUR_USERNAME/sake-shop`

## 📋 機能

- 🍶 日本酒商品一覧・詳細表示
- 🥜 おつまみ商品一覧・詳細表示
- 🛒 ショッピングカート機能
- 🎯 お酒診断機能
- 🎲 ランダム商品表示
- 👨‍💼 管理者ダッシュボード
- 📱 レスポンシブデザイン

## 🛠️ 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **データベース**: IndexedDB (ブラウザ内)
- **デプロイ**: GitHub Pages + GitHub Actions

## 🏗️ プロジェクト構造

```
sake-shop/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx        # ホームページ
│   │   ├── products/       # 商品一覧
│   │   ├── cart/           # カート
│   │   ├── diagnosis/      # お酒診断
│   │   ├── random/         # ランダム商品
│   │   └── admin/          # 管理者機能
│   └── lib/
│       └── indexedDB.ts    # データベース操作
├── public/                 # 静的ファイル
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions設定
└── next.config.js          # Next.js設定
```

## 🚀 デプロイ手順

### 1. GitHubリポジトリの作成

1. [GitHub](https://github.com/new)で新しいリポジトリを作成
2. Repository name: `sake-shop`
3. Description: `🍶 酒屋 - お酒とおつまみの通販サイト (Next.js)`
4. **Public**を選択（GitHub Pages無料プランはPublicのみ）
5. "Create repository"をクリック

### 2. ローカルリポジトリの設定

```bash
# リモートリポジトリを追加
git remote add origin https://github.com/YOUR_USERNAME/sake-shop.git

# メインブランチに設定
git branch -M main

# コードをプッシュ
git push -u origin main
```

### 3. GitHub Pagesの有効化

1. GitHubリポジトリの**Settings**タブをクリック
2. 左サイドバーの**Pages**をクリック
3. **Source**で**GitHub Actions**を選択
4. **Save**をクリック

### 4. 自動デプロイの確認

- コードをプッシュすると、GitHub Actionsが自動実行されます
- **Actions**タブでビルド・デプロイの進行状況を確認
- 完了後、`https://YOUR_USERNAME.github.io/sake-shop/`でアクセス可能

## 🔧 ローカル開発

### 前提条件

- Node.js 18以上
- npm または yarn

### セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### ビルド

```bash
# 本番用ビルド
npm run build

# 静的ファイルの生成
npm run export
```

## 📁 設定ファイル

### GitHub Actions (`.github/workflows/deploy.yml`)

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main, master ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
        env:
          NODE_ENV: production
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
      - uses: actions/deploy-pages@v4
```

### Next.js設定 (`next.config.js`)

```javascript
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/sake-shop' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/sake-shop/' : '',
}
```

## 🐛 トラブルシューティング

### ビルドエラー

```bash
# キャッシュをクリア
npm cache clean --force

# node_modulesを再インストール
rm -rf node_modules package-lock.json
npm install
```

### デプロイ後にページが表示されない

1. GitHub Pages設定で**GitHub Actions**が選択されているか確認
2. **Actions**タブでワークフローが正常完了しているか確認
3. ブラウザのキャッシュをクリア

### 画像が表示されない

- `next.config.js`で`images.unoptimized: true`が設定されているか確認
- 画像パスが正しいか確認

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🤝 コントリビューション

プルリクエストやイシューの報告を歓迎します！

---

**🍶 乾杯！美味しいお酒とおつまみをお楽しみください！**