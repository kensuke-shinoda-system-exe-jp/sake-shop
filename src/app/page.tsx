import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm rounded-lg mb-8">
        <div className="flex items-center justify-between p-6">
          <h1 className="text-3xl font-bold text-primary-600">🍶 酒屋</h1>
          <nav className="flex space-x-6">
            <Link href="/products" className="text-secondary-600 hover:text-primary-600 transition-colors">
              商品一覧
            </Link>
            <Link href="/diagnosis" className="text-secondary-600 hover:text-primary-600 transition-colors">
              お酒診断
            </Link>
            <Link href="/random" className="text-secondary-600 hover:text-primary-600 transition-colors">
              ランダム提案
            </Link>
            <Link href="/cart" className="text-secondary-600 hover:text-primary-600 transition-colors">
              カート
            </Link>
            <Link href="/admin" className="text-secondary-600 hover:text-primary-600 transition-colors">
              管理者
            </Link>
          </nav>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main>
        {/* ヒーローセクション */}
        <section className="card mb-12 text-center">
          <h2 className="text-4xl font-bold text-secondary-700 mb-4">
            お酒とおつまみの専門店
          </h2>
          <p className="text-lg text-secondary-600 mb-8">
            厳選されたお酒とおつまみをお届けします。お酒診断でぴったりの一本を見つけよう！
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/products" className="btn-primary">
              商品を見る
            </Link>
            <Link href="/diagnosis" className="btn-secondary">
              お酒診断を始める
            </Link>
          </div>
        </section>

        {/* 特徴セクション */}
        <section className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="card text-center">
            <div className="text-4xl mb-4">🍶</div>
            <h3 className="text-xl font-semibold text-secondary-700 mb-2">厳選されたお酒</h3>
            <p className="text-secondary-600">
              日本酒、焼酎、ワイン、ビールなど、厳選されたお酒を取り揃えています。
            </p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-4">🥜</div>
            <h3 className="text-xl font-semibold text-secondary-700 mb-2">こだわりのおつまみ</h3>
            <p className="text-secondary-600">
              お酒に合う美味しいおつまみを豊富に取り揃えています。
            </p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-secondary-700 mb-2">お酒診断</h3>
            <p className="text-secondary-600">
              あなたの好みに合ったお酒を診断機能で見つけることができます。
            </p>
          </div>
        </section>

        {/* おすすめ商品セクション */}
        <section className="card">
          <h3 className="text-2xl font-bold text-secondary-700 mb-6">おすすめ商品</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {/* サンプル商品 */}
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-gray-50 rounded-lg p-4">
                <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-500">商品画像</span>
                </div>
                <h4 className="font-semibold text-secondary-700 mb-2">サンプル商品 {item}</h4>
                <p className="text-secondary-600 text-sm mb-2">商品の説明文がここに入ります。</p>
                <p className="text-primary-600 font-bold">¥1,500</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* フッター */}
      <footer className="mt-16 text-center text-secondary-500">
        <p>&copy; 2024 酒屋. All rights reserved.</p>
      </footer>
    </div>
  )
}