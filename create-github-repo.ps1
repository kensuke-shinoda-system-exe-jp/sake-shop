# GitHub リポジトリ作成とデプロイ用スクリプト

Write-Host "=== GitHub Pages デプロイ用リポジトリ作成 ===" -ForegroundColor Green

Write-Host "`n1. GitHubでリポジトリを作成してください:" -ForegroundColor Yellow
Write-Host "   - https://github.com/new にアクセス"
Write-Host "   - Repository name: sake-shop"
Write-Host "   - Description: 🍶 酒屋 - お酒とおつまみの通販サイト (Next.js)"
Write-Host "   - Public を選択"
Write-Host "   - Create repository をクリック"

Write-Host "`n2. 作成後、以下のコマンドを実行してください:" -ForegroundColor Yellow
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/sake-shop.git"
Write-Host "   git branch -M main"
Write-Host "   git push -u origin main"

Write-Host "`n3. GitHub Pages を有効化してください:" -ForegroundColor Yellow
Write-Host "   - リポジトリの Settings タブをクリック"
Write-Host "   - 左サイドバーの Pages をクリック"
Write-Host "   - Source で 'GitHub Actions' を選択"
Write-Host "   - Save をクリック"

Write-Host "`n4. デプロイ確認:" -ForegroundColor Yellow
Write-Host "   - Actions タブでワークフローの実行を確認"
Write-Host "   - 完了後、https://YOUR_USERNAME.github.io/sake-shop/ でアクセス可能"

Write-Host "`n現在の準備状況:" -ForegroundColor Cyan
Write-Host "✅ GitHub Actions ワークフロー設定済み"
Write-Host "✅ Next.js 静的エクスポート設定済み"
Write-Host "✅ .nojekyll ファイル設置済み"
Write-Host "✅ ローカルコミット完了"

Write-Host "`nGitHubユーザー名を入力してください (Enter で続行): " -ForegroundColor Green -NoNewline
$username = Read-Host

if ($username) {
    Write-Host "`nあなたのリポジトリURL:" -ForegroundColor Cyan
    Write-Host "https://github.com/$username/sake-shop"
    Write-Host "`nデプロイ後のサイトURL:" -ForegroundColor Cyan
    Write-Host "https://$username.github.io/sake-shop/"
    
    Write-Host "`nリモートリポジトリを追加しますか? (y/N): " -ForegroundColor Green -NoNewline
    $confirm = Read-Host
    
    if ($confirm -eq "y" -or $confirm -eq "Y") {
        try {
            git remote add origin "https://github.com/$username/sake-shop.git"
            Write-Host "✅ リモートリポジトリを追加しました" -ForegroundColor Green
            
            Write-Host "`nコードをプッシュしますか? (y/N): " -ForegroundColor Green -NoNewline
            $pushConfirm = Read-Host
            
            if ($pushConfirm -eq "y" -or $pushConfirm -eq "Y") {
                git branch -M main
                git push -u origin main
                Write-Host "✅ コードをプッシュしました" -ForegroundColor Green
                Write-Host "GitHub Actions でデプロイが開始されます！" -ForegroundColor Yellow
            }
        }
        catch {
            Write-Host "❌ エラーが発生しました: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host "手動でリモートリポジトリを設定してください" -ForegroundColor Yellow
        }
    }
}

Write-Host "`n=== 完了 ===" -ForegroundColor Green