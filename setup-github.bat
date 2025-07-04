@echo off
chcp 65001 >nul
echo === GitHub Pages デプロイ用リポジトリ作成 ===
echo.
echo 1. GitHubでリポジトリを作成してください:
echo    - https://github.com/new にアクセス
echo    - Repository name: sake-shop
echo    - Description: 酒屋 - お酒とおつまみの通販サイト (Next.js)
echo    - Public を選択
echo    - Create repository をクリック
echo.
echo 2. GitHubユーザー名を入力してください:
set /p username="GitHub Username: "
echo.
echo あなたのリポジトリURL: https://github.com/%username%/sake-shop
echo デプロイ後のサイトURL: https://%username%.github.io/sake-shop/
echo.
echo 3. リモートリポジトリを追加しますか? (y/N):
set /p confirm="Continue? "
if /i "%confirm%"=="y" (
    git remote add origin https://github.com/%username%/sake-shop.git
    echo リモートリポジトリを追加しました
    echo.
    echo 4. コードをプッシュしますか? (y/N):
    set /p pushconfirm="Push code? "
    if /i "%pushconfirm%"=="y" (
        git branch -M main
        git push -u origin main
        echo コードをプッシュしました
        echo GitHub Actions でデプロイが開始されます！
    )
)
echo.
echo === 完了 ===
pause