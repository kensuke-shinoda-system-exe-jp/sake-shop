'use client'

import { useState } from 'react'
import Link from 'next/link'

// サンプル商品データ
const allProducts = [
  {
    id: 1,
    name: '純米大吟醸 山田錦',
    category: 'sake',
    price: 3500,
    description: '山田錦を使用した上品な味わいの純米大吟醸酒。フルーティーな香りと繊細な味わいが特徴です。',
    alcoholPercent: 15.5,
    tags: ['日本酒', '純米大吟醸', '山田錦'],
    pairing: ['刺身', '天ぷら', '和食']
  },
  {
    id: 2,
    name: '本格焼酎 黒霧島',
    category: 'shochu',
    price: 1200,
    description: 'さつまいもの甘みが感じられる本格焼酎。ロックでも水割りでも美味しくお楽しみいただけます。',
    alcoholPercent: 25,
    tags: ['焼酎', 'さつまいも', '本格'],
    pairing: ['焼き鳥', '餃子', '鍋料理']
  },
  {
    id: 3,
    name: 'シャルドネ 白ワイン',
    category: 'wine',
    price: 2800,
    description: 'フルーティーで爽やかな白ワイン。魚料理やチーズとの相性が抜群です。',
    alcoholPercent: 12,
    tags: ['ワイン', '白ワイン', 'シャルドネ'],
    pairing: ['魚料理', 'チーズ', 'サラダ']
  },
  {
    id: 4,
    name: 'クラフトビール IPA',
    category: 'beer',
    price: 450,
    description: 'ホップの苦味が効いたクラフトビール。爽快な飲み心地で暑い日にぴったりです。',
    alcoholPercent: 6.5,
    tags: ['ビール', 'クラフト', 'IPA'],
    pairing: ['ピザ', 'ハンバーガー', 'スパイシー料理']
  },
  {
    id: 5,
    name: '赤ワイン カベルネ',
    category: 'wine',
    price: 3200,
    description: '深いコクと豊かな香りの赤ワイン。肉料理との相性が抜群です。',
    alcoholPercent: 13.5,
    tags: ['ワイン', '赤ワイン', 'カベルネ'],
    pairing: ['ステーキ', 'チーズ', '肉料理']
  },
  {
    id: 6,
    name: '麦焼酎 いいちこ',
    category: 'shochu',
    price: 1000,
    description: 'まろやかな口当たりの麦焼酎。すっきりとした味わいで飲みやすいです。',
    alcoholPercent: 25,
    tags: ['焼酎', '麦', 'まろやか'],
    pairing: ['唐揚げ', '焼き魚', '居酒屋料理']
  },
  {
    id: 7,
    name: 'チーズ盛り合わせ',
    category: 'snack',
    price: 1800,
    description: '3種類のチーズの盛り合わせ。ワインのお供に最適です。',
    alcoholPercent: 0,
    tags: ['おつまみ', 'チーズ', '盛り合わせ'],
    pairing: ['ワイン', '日本酒', 'ビール']
  },
  {
    id: 8,
    name: 'ナッツミックス',
    category: 'snack',
    price: 680,
    description: '4種類のナッツをミックスした人気のおつまみ。どんなお酒にも合います。',
    alcoholPercent: 0,
    tags: ['おつまみ', 'ナッツ', 'ミックス'],
    pairing: ['ビール', 'ウイスキー', '焼酎']
  }
]

export default function RandomPage() {
  const [currentProduct, setCurrentProduct] = useState<typeof allProducts[0] | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [history, setHistory] = useState<typeof allProducts>([])

  const getRandomProduct = () => {
    setIsAnimating(true)
    
    // アニメーション効果のために少し遅延
    setTimeout(() => {
      const availableProducts = allProducts.filter(p => p.id !== currentProduct?.id)
      const randomIndex = Math.floor(Math.random() * availableProducts.length)
      const selectedProduct = availableProducts[randomIndex]
      
      setCurrentProduct(selectedProduct)
      
      // 履歴に追加（最大5件まで）
      setHistory(prev => {
        const newHistory = [selectedProduct, ...prev.filter(p => p.id !== selectedProduct.id)]
        return newHistory.slice(0, 5)
      })
      
      setIsAnimating(false)
    }, 800)
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      sake: '🍶',
      wine: '🍷',
      beer: '🍺',
      shochu: '🥃',
      snack: '🥜'
    }
    return icons[category as keyof typeof icons] || '🍶'
  }

  const getCategoryName = (category: string) => {
    const names = {
      sake: '日本酒',
      wine: 'ワイン',
      beer: 'ビール',
      shochu: '焼酎',
      snack: 'おつまみ'
    }
    return names[category as keyof typeof names] || category
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm rounded-lg mb-8">
        <div className="flex items-center justify-between p-6">
          <Link href="/" className="text-3xl font-bold text-primary-600">🍶 酒屋</Link>
          <nav className="flex space-x-6">
            <Link href="/" className="text-secondary-600 hover:text-primary-600 transition-colors">
              ホーム
            </Link>
            <Link href="/products" className="text-secondary-600 hover:text-primary-600 transition-colors">
              商品一覧
            </Link>
            <Link href="/diagnosis" className="text-secondary-600 hover:text-primary-600 transition-colors">
              お酒診断
            </Link>
            <Link href="/cart" className="text-secondary-600 hover:text-primary-600 transition-colors">
              カート
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        {/* タイトルセクション */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary-700 mb-4">🎲 ランダム提案</h1>
          <p className="text-lg text-secondary-600 mb-6">
            運命の一本を見つけよう！ボタンを押してランダムにお酒やおつまみを提案します。
          </p>
          <button
            onClick={getRandomProduct}
            disabled={isAnimating}
            className={`btn-primary text-lg px-8 py-3 ${isAnimating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isAnimating ? '選んでいます...' : '🎯 ランダムに選ぶ'}
          </button>
        </div>

        {/* メイン商品表示 */}
        {currentProduct && (
          <div className={`card mb-8 transition-all duration-500 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
            <div className="grid md:grid-cols-2 gap-8">
              {/* 商品画像エリア */}
              <div className="flex flex-col items-center">
                <div className="bg-gray-200 w-full h-64 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-2">{getCategoryIcon(currentProduct.category)}</div>
                    <span className="text-gray-500">商品画像</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentProduct.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 商品情報 */}
              <div className="flex flex-col justify-center">
                <div className="mb-2">
                  <span className="text-sm text-secondary-500 font-medium">
                    {getCategoryName(currentProduct.category)}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-secondary-700 mb-4">
                  {currentProduct.name}
                </h2>
                <p className="text-secondary-600 mb-4 leading-relaxed">
                  {currentProduct.description}
                </p>
                
                {currentProduct.alcoholPercent > 0 && (
                  <div className="mb-4">
                    <span className="text-sm text-secondary-500">アルコール度数: </span>
                    <span className="font-medium text-secondary-700">{currentProduct.alcoholPercent}%</span>
                  </div>
                )}

                <div className="mb-6">
                  <h4 className="text-sm font-medium text-secondary-700 mb-2">おすすめの組み合わせ:</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentProduct.pairing.map(item => (
                      <span
                        key={item}
                        className="px-2 py-1 bg-secondary-100 text-secondary-700 text-sm rounded"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-primary-600">
                    ¥{currentProduct.price.toLocaleString()}
                  </div>
                  <button className="btn-primary">
                    カートに追加
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 初回メッセージ */}
        {!currentProduct && (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-secondary-700 mb-2">
              さあ、運試しを始めましょう！
            </h3>
            <p className="text-secondary-600">
              上のボタンを押して、あなたの運命の一本を見つけてください。
            </p>
          </div>
        )}

        {/* 履歴セクション */}
        {history.length > 0 && (
          <div className="card">
            <h3 className="text-xl font-semibold text-secondary-700 mb-4">最近の提案履歴</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {history.map((product, index) => (
                <div
                  key={`${product.id}-${index}`}
                  className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                    product.id === currentProduct?.id ? 'border-primary-300 bg-primary-50' : 'border-gray-200'
                  }`}
                  onClick={() => setCurrentProduct(product)}
                >
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">{getCategoryIcon(product.category)}</span>
                    <div>
                      <h4 className="font-medium text-secondary-700 text-sm">{product.name}</h4>
                      <p className="text-xs text-secondary-500">{getCategoryName(product.category)}</p>
                    </div>
                  </div>
                  <div className="text-primary-600 font-bold text-sm">
                    ¥{product.price.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* アクションボタン */}
        <div className="text-center mt-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="btn-secondary">
              全商品を見る
            </Link>
            <Link href="/diagnosis" className="btn-secondary">
              お酒診断を試す
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}