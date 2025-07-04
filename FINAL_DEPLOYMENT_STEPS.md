# 🚀 最終デプロイ手順 - GitHub Pages完全ガイド

## 📋 現在の準備状況
✅ GitHub Actions ワークフロー設定完了  
✅ Next.js 静的エクスポート設定完了  
✅ package.json ビルドスクリプト設定完了  
✅ プロキシ環境設定完了  
✅ ローカルコミット完了  

## 🎯 次に実行する手順

### ステップ 1: GitHubリポジトリ作成
1. ブラウザで https://github.com/new にアクセス
2. 以下の設定でリポジトリを作成：
   - **Repository name**: `sake-shop`
   - **Description**: `🍶 酒屋 - お酒とおつまみの通販サイト (Next.js)`
   - **Visibility**: Public を選択
   - **Initialize**: チェックを入れない（既存コードがあるため）
3. "Create repository" をクリック

### ステップ 2: コードをプッシュ
PowerShellで以下のコマンドを実行：

```powershell
# プロキシ設定
$env:http_proxy="http://172.16.0.100:8080"
$env:https_proxy="http://172.16.0.100:8080"

# リモートURL更新（YOUR_USERNAMEを実際のGitHubユーザー名に変更）
git remote set-url origin https://github.com/YOUR_USERNAME/sake-shop.git

# コードをプッシュ
git push -u origin main
```

### ステップ 3: GitHub Pages設定
1. GitHubリポジトリページで **Settings** タブをクリック
2. 左サイドバーの **Pages** をクリック
3. **Source** で **"GitHub Actions"** を選択
4. **Save** をクリック

### ステップ 4: GitHub Actions実行確認
1. リポジトリの **Actions** タブをクリック
2. "Deploy to GitHub Pages" ワークフローが自動実行されることを確認
3. 実行ログを監視：
   ```
   ✓ Setup Node.js 18
   ✓ Install dependencies (npm ci)
   ✓ Build application (npm run build)
   ✓ Export static files
   ✓ Deploy to GitHub Pages
   ```

### ステップ 5: デプロイ完了確認
- **デプロイURL**: `https://YOUR_USERNAME.github.io/sake-shop/`
- Actions完了後、上記URLでサイトにアクセス可能

## 🔧 設定済みファイル詳細

### GitHub Actions ワークフロー (`.github/workflows/deploy.yml`)
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    - run: npm ci
    - run: npm run build
    - run: npm run export
    - uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./out
```

### Next.js設定 (`next.config.js`)
```javascript
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  images: { unoptimized: true },
  basePath: process.env.NODE_ENV === 'production' ? '/sake-shop' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/sake-shop/' : '',
}
```

## 🐛 トラブルシューティング

### 問題1: プッシュエラー
```
remote: Repository not found
```
**解決**: GitHubでリポジトリが作成されているか確認

### 問題2: Actions実行エラー
```
Build failed
```
**解決**: package.jsonの依存関係とnext.config.jsを確認

### 問題3: 404エラー
```
Page not found
```
**解決**: GitHub Pages設定で"GitHub Actions"が選択されているか確認

## 📊 予想実行時間
- リポジトリ作成: 1分
- コードプッシュ: 2-3分
- GitHub Actions実行: 4-6分
- **合計**: 約7-10分

## 🎉 完了後の確認項目
- [ ] GitHubリポジトリ作成完了
- [ ] コードプッシュ成功
- [ ] GitHub Pages設定完了
- [ ] Actions実行成功（緑のチェックマーク）
- [ ] デプロイURL動作確認
- [ ] 全ページ表示確認

## 📝 デプロイ後のURL
**本番サイト**: `https://YOUR_USERNAME.github.io/sake-shop/`

---
**作成日**: 2025/7/4  
**ステータス**: デプロイ準備完了 🚀