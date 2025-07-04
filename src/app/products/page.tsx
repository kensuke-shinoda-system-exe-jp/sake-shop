'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { productDB, cartDB, seedInitialData, Product, CartItem } from '@/lib/indexedDB'

const categories = [
  { id: 'all', name: 'すべて' },
  { id: 'sake', name: '日本酒' },
  { id: 'shochu', name: '焼酎' },
  { id: 'wine', name: 'ワイン' },
  { id: 'beer', name: 'ビール' },
  { id: 'snack', name: 'おつまみ' }
]

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        await seedInitialData()
        const allProducts = await productDB.getAll()
        setProducts(allProducts)
      } catch (error) {
        console.error('商品の読み込みに失敗しました:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const addToCart = async (product: Product) => {
    try {
      const cartItem: CartItem = {
        id: Date.now(), // 一意のID
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        category: product.category
      }
      
      await cartDB.add(cartItem)
      alert('カートに追加しました！')
    } catch (error) {
      console.error('カートへの追加に失敗しました:', error)
      alert('カートへの追加に失敗しました')
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600">商品を読み込み中...</p>
        </div>
      </div>
    )
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
            <Link href="/diagnosis" className="text-secondary-600 hover:text-primary-600 transition-colors">
              お酒診断
            </Link>
            <Link href="/random" className="text-secondary-600 hover:text-primary-600 transition-colors">
              ランダム提案
            </Link>
            <Link href="/cart" className="text-secondary-600 hover:text-primary-600 transition-colors">
              カート
            </Link>
          </nav>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* サイドバー（フィルター） */}
        <aside className="lg:w-1/4">
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-700 mb-4">検索・絞り込み</h3>
            
            {/* 検索 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                商品検索
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="商品名、説明、タグで検索"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* カテゴリー */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                カテゴリー
              </label>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-primary-100 text-primary-700 font-medium'
                        : 'text-secondary-600 hover:bg-gray-100'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* メインコンテンツ */}
        <main className="lg:w-3/4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-secondary-700 mb-2">商品一覧</h1>
            <p className="text-secondary-600">
              {filteredProducts.length}件の商品が見つかりました
            </p>
          </div>

          {/* 商品グリッド */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="card hover:shadow-lg transition-shadow">
                <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-500">商品画像</span>
                </div>
                
                <h3 className="font-semibold text-secondary-700 mb-2">{product.name}</h3>
                <p className="text-secondary-600 text-sm mb-3">{product.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary-600 font-bold text-lg">¥{product.price.toLocaleString()}</p>
                    {product.alcoholPercent > 0 && (
                      <p className="text-secondary-500 text-sm">アルコール度数: {product.alcoholPercent}%</p>
                    )}
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="btn-primary"
                  >
                    カートに追加
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-secondary-500 text-lg">該当する商品が見つかりませんでした。</p>
              <p className="text-secondary-400 mt-2">検索条件を変更してお試しください。</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}