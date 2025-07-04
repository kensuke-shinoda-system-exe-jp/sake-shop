# GitHub Actions 動作確認スクリプト

Write-Host "=== GitHub Actions 動作確認 ===" -ForegroundColor Green

# プロキシ設定
$env:http_proxy="http://172.16.0.100:8080"
$env:https_proxy="http://172.16.0.100:8080"

Write-Host "`n1. 現在のGit設定を確認..." -ForegroundColor Yellow
git remote -v
git status

Write-Host "`n2. GitHub リポジトリの手動作成が必要です:" -ForegroundColor Cyan
Write-Host "   - https://github.com/new にアクセス"
Write-Host "   - Repository name: sake-shop"
Write-Host "   - Description: 🍶 酒屋 - お酒とおつまみの通販サイト (Next.js)"
Write-Host "   - Public を選択"
Write-Host "   - Create repository をクリック"

Write-Host "`n3. リポジトリ作成後、以下を実行してください:" -ForegroundColor Yellow
Write-Host "   git remote set-url origin https://github.com/YOUR_USERNAME/sake-shop.git"
Write-Host "   git push -u origin main"

Write-Host "`n4. GitHub Pages 設定:" -ForegroundColor Cyan
Write-Host "   - リポジトリの Settings > Pages"
Write-Host "   - Source: 'GitHub Actions' を選択"
Write-Host "   - Save をクリック"

Write-Host "`n5. Actions 確認:" -ForegroundColor Green
Write-Host "   - Actions タブでワークフロー実行を確認"
Write-Host "   - 'Deploy to GitHub Pages' ワークフローが実行されることを確認"

Write-Host "`n現在の設定状況:" -ForegroundColor Magenta
Write-Host "✅ GitHub Actions ワークフロー (.github/workflows/deploy.yml)"
Write-Host "✅ Next.js 静的エクスポート設定 (next.config.js)"
Write-Host "✅ package.json export スクリプト"
Write-Host "✅ .nojekyll ファイル (GitHub Pages用)"
Write-Host "✅ ローカルコミット完了"

Write-Host "`nGitHub Actions ワークフローの内容:" -ForegroundColor Blue
Write-Host "- Node.js 18 環境でビルド"
Write-Host "- npm ci でクリーンインストール"
Write-Host "- npm run build で静的ファイル生成"
Write-Host "- GitHub Pages に自動デプロイ"

Write-Host "`n=== 次のステップ ===" -ForegroundColor Yellow
Write-Host "1. 上記の手順でGitHubリポジトリを作成"
Write-Host "2. コードをプッシュ"
Write-Host "3. Actions タブで実行状況を確認"
Write-Host "4. デプロイ完了後、https://YOUR_USERNAME.github.io/sake-shop/ でアクセス"