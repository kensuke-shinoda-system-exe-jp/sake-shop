# GitHub Actions セットアップ・動作確認ガイド

## 🎯 概要
このガイドでは、sake-shopプロジェクトのGitHub Actionsが正しく動作しているかを確認する手順を説明します。

## ✅ 現在の設定状況

### 完了済み項目
- [x] GitHub Actions ワークフローファイル (`.github/workflows/deploy.yml`)
- [x] Next.js 静的エクスポート設定 (`next.config.js`)
- [x] package.json ビルドスクリプト設定
- [x] GitHub Pages用 `.nojekyll` ファイル
- [x] ローカルでの変更コミット

### GitHub Actions ワークフロー詳細
```yaml
# .github/workflows/deploy.yml
- Node.js 18環境でビルド
- npm ci でクリーンインストール
- npm run build で静的ファイル生成
- npm run export で静的エクスポート
- GitHub Pagesに自動デプロイ
```

## 🚀 GitHub リポジトリ作成・設定手順

### 1. GitHubリポジトリ作成
1. https://github.com/new にアクセス
2. Repository name: `sake-shop`
3. Description: `🍶 酒屋 - お酒とおつまみの通販サイト (Next.js)`
4. Public を選択
5. "Create repository" をクリック

### 2. ローカルリポジトリとの接続
```powershell
# プロキシ設定（必要に応じて）
$env:http_proxy="http://172.16.0.100:8080"
$env:https_proxy="http://172.16.0.100:8080"

# リモートリポジトリ設定（YOUR_USERNAMEを実際のユーザー名に変更）
git remote set-url origin https://github.com/YOUR_USERNAME/sake-shop.git

# コードをプッシュ
git push -u origin main
```

### 3. GitHub Pages 有効化
1. リポジトリの **Settings** タブをクリック
2. 左サイドバーの **Pages** をクリック
3. Source で **"GitHub Actions"** を選択
4. **Save** をクリック

## 🔍 GitHub Actions 動作確認

### 1. ワークフロー実行確認
1. リポジトリの **Actions** タブをクリック
2. "Deploy to GitHub Pages" ワークフローを確認
3. 実行状況を監視：
   - ✅ Setup Node.js
   - ✅ Install dependencies
   - ✅ Build application
   - ✅ Export static files
   - ✅ Deploy to GitHub Pages

### 2. ビルドログ確認項目
```
✓ Node.js 18 セットアップ完了
✓ npm ci 実行完了
✓ next build 実行完了
✓ 静的ファイル生成完了 (./out ディレクトリ)
✓ GitHub Pages デプロイ完了
```

### 3. デプロイ確認
- デプロイ完了後のURL: `https://YOUR_USERNAME.github.io/sake-shop/`
- ページが正常に表示されることを確認

## 🐛 トラブルシューティング

### よくある問題と解決方法

#### 1. ビルドエラー
```
Error: Build failed
```
**解決方法:**
- `package.json` の依存関係を確認
- `next.config.js` の設定を確認
- TypeScriptエラーがないか確認

#### 2. デプロイエラー
```
Error: Failed to deploy to GitHub Pages
```
**解決方法:**
- GitHub Pages設定で "GitHub Actions" が選択されているか確認
- リポジトリがPublicになっているか確認
- GITHUB_TOKEN権限を確認

#### 3. 404エラー
```
Page not found
```
**解決方法:**
- `basePath` 設定を確認 (`/sake-shop`)
- `.nojekyll` ファイルが存在するか確認
- ルーティング設定を確認

## 📊 パフォーマンス監視

### GitHub Actions実行時間の目安
- Setup: ~30秒
- Install dependencies: ~2-3分
- Build: ~1-2分
- Deploy: ~30秒
- **合計: ~4-6分**

### 最適化のポイント
- 依存関係のキャッシュ利用
- 不要なファイルの除外
- ビルド時間の短縮

## 🎉 完了確認チェックリスト

- [ ] GitHubリポジトリ作成完了
- [ ] コードプッシュ完了
- [ ] GitHub Pages設定完了
- [ ] Actions実行成功
- [ ] サイトアクセス確認完了
- [ ] 全ページ動作確認完了

## 📝 次のステップ

1. **継続的デプロイ**: mainブランチへのプッシュで自動デプロイ
2. **カスタムドメイン**: 独自ドメインの設定
3. **監視設定**: エラー通知の設定
4. **パフォーマンス最適化**: ビルド時間の短縮

---

**作成日**: 2025/7/4  
**対象プロジェクト**: sake-shop (Next.js)  
**GitHub Actions**: Deploy to GitHub Pages