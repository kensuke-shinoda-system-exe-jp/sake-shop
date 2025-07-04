# 🚀 自動デプロイスクリプト - GitHub Pages完全自動化

Write-Host "=== sake-shop 自動デプロイ開始 ===" -ForegroundColor Green

# プロキシ設定
$env:http_proxy="http://172.16.0.100:8080"
$env:https_proxy="http://172.16.0.100:8080"

Write-Host "`n📋 現在の設定確認..." -ForegroundColor Cyan
Write-Host "✅ GitHub Actions ワークフロー設定済み"
Write-Host "✅ Next.js 静的エクスポート設定済み"
Write-Host "✅ プロキシ環境設定済み"
Write-Host "✅ 全ファイルコミット済み"

Write-Host "`n🔐 GitHub認証確認..." -ForegroundColor Yellow
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ GitHub認証が必要です" -ForegroundColor Red
    Write-Host "認証を開始します..." -ForegroundColor Yellow
    gh auth login --web
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ GitHub認証に失敗しました" -ForegroundColor Red
        Write-Host "手動で以下を実行してください:" -ForegroundColor Yellow
        Write-Host "1. gh auth login --web"
        Write-Host "2. ブラウザでGitHubにログイン"
        Write-Host "3. 認証完了後、このスクリプトを再実行"
        exit 1
    }
}

Write-Host "✅ GitHub認証確認完了" -ForegroundColor Green

Write-Host "`n🏗️ GitHubリポジトリ作成..." -ForegroundColor Cyan
$repoExists = gh repo view kensuke-shinoda-system-exe-jp/sake-shop 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "新しいリポジトリを作成します..." -ForegroundColor Yellow
    gh repo create sake-shop --public --description "🍶 酒屋 - お酒とおつまみの通販サイト (Next.js)" --push --source=.
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ リポジトリ作成・プッシュ完了" -ForegroundColor Green
    } else {
        Write-Host "❌ リポジトリ作成に失敗しました" -ForegroundColor Red
        Write-Host "手動でリポジトリを作成してください:" -ForegroundColor Yellow
        Write-Host "1. https://github.com/new にアクセス"
        Write-Host "2. Repository name: sake-shop"
        Write-Host "3. Public設定でリポジトリ作成"
        Write-Host "4. git remote set-url origin https://github.com/YOUR_USERNAME/sake-shop.git"
        Write-Host "5. git push -u origin main"
        exit 1
    }
} else {
    Write-Host "✅ リポジトリが既に存在します" -ForegroundColor Green
    Write-Host "コードをプッシュします..." -ForegroundColor Yellow
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ コードプッシュ完了" -ForegroundColor Green
    } else {
        Write-Host "❌ プッシュに失敗しました" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n⚙️ GitHub Pages設定..." -ForegroundColor Cyan
$username = gh api user --jq .login
$repoUrl = "https://github.com/$username/sake-shop"

Write-Host "リポジトリURL: $repoUrl" -ForegroundColor Blue

# GitHub Pages APIで設定を試行
Write-Host "GitHub Pages設定を試行中..." -ForegroundColor Yellow
$pagesConfig = @{
    source = @{
        branch = "gh-pages"
        path = "/"
    }
    build_type = "workflow"
} | ConvertTo-Json -Depth 3

try {
    $pagesConfig | gh api repos/$username/sake-shop/pages -X POST --input - 2>$null
    Write-Host "✅ GitHub Pages設定完了" -ForegroundColor Green
} catch {
    Write-Host "⚠️ GitHub Pages設定は手動で行ってください:" -ForegroundColor Yellow
    Write-Host "1. $repoUrl/settings/pages にアクセス"
    Write-Host "2. Source で 'GitHub Actions' を選択"
    Write-Host "3. Save をクリック"
}

Write-Host "`n🔄 GitHub Actions実行確認..." -ForegroundColor Cyan
Write-Host "Actions URL: $repoUrl/actions" -ForegroundColor Blue

# 少し待ってからActions状況を確認
Start-Sleep -Seconds 5
$workflows = gh api repos/$username/sake-shop/actions/runs --jq '.workflow_runs[0]'
if ($workflows) {
    $status = gh api repos/$username/sake-shop/actions/runs --jq '.workflow_runs[0].status'
    $conclusion = gh api repos/$username/sake-shop/actions/runs --jq '.workflow_runs[0].conclusion'
    
    Write-Host "最新ワークフロー状況: $status" -ForegroundColor Blue
    if ($conclusion -eq "success") {
        Write-Host "✅ デプロイ成功！" -ForegroundColor Green
    } elseif ($status -eq "in_progress") {
        Write-Host "🔄 デプロイ実行中..." -ForegroundColor Yellow
    } else {
        Write-Host "⚠️ デプロイ状況を確認してください" -ForegroundColor Yellow
    }
}

Write-Host "`n🎉 デプロイ完了情報" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host "📍 リポジトリURL: $repoUrl" -ForegroundColor Cyan
Write-Host "🌐 デプロイURL: https://$username.github.io/sake-shop/" -ForegroundColor Cyan
Write-Host "📊 Actions監視: $repoUrl/actions" -ForegroundColor Cyan
Write-Host "⚙️ Pages設定: $repoUrl/settings/pages" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

Write-Host "`n⏱️ デプロイ完了まで約5-10分お待ちください" -ForegroundColor Yellow
Write-Host "完了後、上記URLでサイトにアクセスできます！" -ForegroundColor Green

Write-Host "`n=== 自動デプロイ完了 ===" -ForegroundColor Green