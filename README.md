# 🍶 酒屋 - お酒とおつまみの通販サイト

Next.jsで構築されたAmazon風の通販サイトです。お酒とおつまみを販売し、お酒診断機能やランダム提案機能を備えています。

## 🚀 機能

### ユーザー向け機能
- **商品一覧・検索・絞り込み** - カテゴリー別の商品表示と検索機能
- **商品詳細表示** - 商品の詳細情報とスペック表示
- **ショッピングカート** - 商品の追加・削除・数量変更
- **お酒診断** - 質問に答えてユーザーの好みに合うお酒を提案
- **ランダム提案** - ワンクリックでランダムに商品を提案
- **レスポンシブデザイン** - モバイル・タブレット・デスクトップ対応

### 管理者向け機能
- **管理者認証** - セキュアなログイン機能
- **ダッシュボード** - 売上・注文・在庫の統計表示
- **商品管理** - 商品の追加・編集・削除
- **注文管理** - 注文の確認・ステータス更新

## 🛠️ 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **UI**: React Hooks
- **データベース**: IndexedDB (ブラウザ内データベース)
- **認証**: localStorage (デモ用)

## 📁 プロジェクト構造

```
sake-shop/
├── src/
│   ├── app/
│   │   ├── globals.css          # グローバルスタイル
│   │   ├── layout.tsx           # ルートレイアウト
│   │   ├── page.tsx             # トップページ
│   │   ├── products/            # 商品一覧ページ
│   │   ├── diagnosis/           # お酒診断ページ
│   │   ├── random/              # ランダム提案ページ
│   │   ├── cart/                # ショッピングカートページ
│   │   └── admin/               # 管理者機能
│   │       ├── page.tsx         # 管理者ログイン
│   │       └── dashboard/       # 管理者ダッシュボード
│   └── lib/
│       └── indexedDB.ts         # IndexedDBユーティリティ
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── postcss.config.js
```

## 🎯 主要ページ

### ユーザー向け
- `/` - トップページ
- `/products` - 商品一覧
- `/diagnosis` - お酒診断
- `/random` - ランダム提案
- `/cart` - ショッピングカート

### 管理者向け
- `/admin` - 管理者ログイン
- `/admin/dashboard` - 管理者ダッシュボード

## 🔐 管理者ログイン情報（デモ用）

```
メールアドレス: admin@sake-shop.com
パスワード: admin123
```

## 🎨 デザインシステム

### カラーパレット
- **プライマリ**: オレンジ系（#f97316）
- **セカンダリ**: グレー系（#64748b）
- **背景**: ライトグレー（#f8fafc）

### コンポーネント
- **btn-primary**: プライマリボタン
- **btn-secondary**: セカンダリボタン
- **card**: カードコンポーネント

## 🚀 開発・実行方法

### 前提条件
- Node.js 18以上
- npm または yarn

### セットアップ

1. **依存関係のインストール**
```bash
cd sake-shop
npm install
```

2. **開発サーバーの起動**
```bash
npm run dev
```

3. **ブラウザでアクセス**
```
http://localhost:3000
```

### ビルド・本番環境

```bash
# 本番用ビルド
npm run build

# 本番サーバー起動
npm start

# GitHub Pages用静的エクスポート
npm run export
```

## 🌐 GitHub Pagesデプロイ

このプロジェクトはGitHub Actionsを使用してGitHub Pagesに自動デプロイされます。

### デプロイ手順

1. **GitHubリポジトリの作成**
   - GitHubで新しいリポジトリを作成
   - リポジトリ名は `sake-shop` を推奨

2. **コードのプッシュ**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/sake-shop.git
   git push -u origin main
   ```

3. **GitHub Pages設定**
   - リポジトリの Settings → Pages に移動
   - Source を "GitHub Actions" に設定

4. **自動デプロイ**
   - `main`ブランチにプッシュすると自動的にデプロイが開始
   - Actions タブでデプロイ状況を確認可能
   - デプロイ完了後、`https://YOUR_USERNAME.github.io/sake-shop/` でアクセス可能

### デプロイ設定ファイル

- `.github/workflows/deploy.yml` - GitHub Actionsワークフロー
- `next.config.js` - GitHub Pages用の設定
- `public/.nojekyll` - Jekyll無効化ファイル

## 📱 レスポンシブ対応

- **モバイル**: 320px〜768px
- **タブレット**: 768px〜1024px
- **デスクトップ**: 1024px以上

## 🔧 カスタマイズ

### 商品データの変更
各ページの`sampleProducts`配列を編集することで商品データを変更できます。

### スタイルの変更
`tailwind.config.ts`でカラーパレットやテーマを変更できます。

### 診断ロジックの変更
`src/app/diagnosis/page.tsx`の`questions`配列と`calculateResult`関数を編集できます。

## 🚧 今後の拡張予定

- [ ] 実際のデータベース連携
- [ ] 決済機能の実装
- [ ] ユーザー認証・会員機能
- [ ] 商品レビュー機能
- [ ] 在庫管理システム
- [ ] メール通知機能
- [ ] SEO最適化

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🤝 コントリビューション

プルリクエストやイシューの報告を歓迎します。

---

**開発者**: Roo  
**作成日**: 2024年1月  
**バージョン**: 1.0.0