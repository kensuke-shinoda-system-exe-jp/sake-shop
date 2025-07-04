# GitHub Pages デプロイガイド

## 1. GitHubリポジトリの作成

1. [GitHub](https://github.com)にアクセスしてログイン
2. 右上の「+」ボタンから「New repository」を選択
3. Repository name: `sake-shop`
4. 「Public」を選択（GitHub Pagesは無料プランではPublicリポジトリのみ）
5. 「Create repository」をクリック

## 2. ローカルリポジトリとの接続

作成されたリポジトリのURLを使って以下のコマンドを実行：

```bash
git remote add origin https://github.com/YOUR_USERNAME/sake-shop.git
git branch -M main
git push -u origin main
```

## 3. GitHub Pages の設定

1. GitHubリポジトリのページで「Settings」タブをクリック
2. 左サイドバーの「Pages」をクリック
3. Source で「GitHub Actions」を選択
4. 設定を保存

## 4. 自動デプロイの確認

- コードをプッシュすると、GitHub Actionsが自動的に実行されます
- 「Actions」タブでビルドとデプロイの進行状況を確認できます
- デプロイが完了すると、`https://YOUR_USERNAME.github.io/sake-shop/` でサイトにアクセスできます

## 現在の設定状況

✅ GitHub Actions ワークフローファイル (`.github/workflows/deploy.yml`) 設定済み
✅ Next.js 静的エクスポート設定 (`next.config.js`) 設定済み
✅ `.nojekyll` ファイル設置済み
✅ ローカルでのコミット完了

## 次に必要な作業

1. GitHubリポジトリの作成
2. リモートリポジトリの設定
3. コードのプッシュ
4. GitHub Pages設定の有効化

## トラブルシューティング

### ビルドエラーが発生した場合
- `npm run build` をローカルで実行してエラーを確認
- `package.json` の依存関係を確認

### デプロイ後にページが表示されない場合
- GitHub Pages の設定で「GitHub Actions」が選択されているか確認
- ワークフローが正常に完了しているか「Actions」タブで確認
- ブラウザのキャッシュをクリアして再度アクセス