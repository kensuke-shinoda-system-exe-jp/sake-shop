'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cartDB, orderDB, CartItem, Order } from '@/lib/indexedDB'

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const items = await cartDB.getAll()
        setCartItems(items)
      } catch (error) {
        console.error('カートの読み込みに失敗しました:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCartItems()
  }, [])

  const updateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeItem(id)
      return
    }
    
    try {
      const updatedItems = cartItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
      
      const updatedItem = updatedItems.find(item => item.id === id)
      if (updatedItem) {
        await cartDB.add(updatedItem) // putと同じ動作
        setCartItems(updatedItems)
      }
    } catch (error) {
      console.error('数量の更新に失敗しました:', error)
    }
  }

  const removeItem = async (id: number) => {
    try {
      await cartDB.remove(id)
      setCartItems(items => items.filter(item => item.id !== id))
    } catch (error) {
      console.error('商品の削除に失敗しました:', error)
    }
  }

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('カートが空です')
      return
    }

    try {
      const order: Order = {
        id: `ORD-${Date.now()}`,
        customerName: 'ゲストユーザー', // 実際のアプリでは認証情報から取得
        customerEmail: 'guest@example.com',
        items: cartItems,
        total: getTotalPrice() + 500, // 送料込み
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        shippingAddress: '住所未設定'
      }

      await orderDB.add(order)
      await cartDB.clear()
      setCartItems([])
      alert(`注文が完了しました！注文番号: ${order.id}`)
    } catch (error) {
      console.error('注文の処理に失敗しました:', error)
      alert('注文の処理に失敗しました')
    }
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600">カートを読み込み中...</p>
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
            <Link href="/products" className="text-secondary-600 hover:text-primary-600 transition-colors">
              商品一覧
            </Link>
            <Link href="/diagnosis" className="text-secondary-600 hover:text-primary-600 transition-colors">
              お酒診断
            </Link>
            <Link href="/random" className="text-secondary-600 hover:text-primary-600 transition-colors">
              ランダム提案
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-secondary-700 mb-8">🛒 ショッピングカート</h1>

        {cartItems.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold text-secondary-700 mb-2">
              カートは空です
            </h3>
            <p className="text-secondary-600 mb-6">
              商品を追加してお買い物を始めましょう！
            </p>
            <Link href="/products" className="btn-primary">
              商品一覧を見る
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* カート商品一覧 */}
            <div className="lg:col-span-2">
              <div className="card">
                <h2 className="text-xl font-semibold text-secondary-700 mb-6">
                  カート内商品 ({getTotalItems()}点)
                </h2>
                
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center p-4 border border-gray-200 rounded-lg">
                      {/* 商品画像 */}
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                        <span className="text-2xl">{getCategoryIcon(item.category)}</span>
                      </div>
                      
                      {/* 商品情報 */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-secondary-700 mb-1">{item.name}</h3>
                        <p className="text-primary-600 font-bold">¥{item.price.toLocaleString()}</p>
                      </div>
                      
                      {/* 数量調整 */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        >
                          +
                        </button>
                      </div>
                      
                      {/* 小計と削除ボタン */}
                      <div className="ml-6 text-right">
                        <p className="font-bold text-secondary-700 mb-2">
                          ¥{(item.price * item.quantity).toLocaleString()}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 text-sm transition-colors"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 注文サマリー */}
            <div className="lg:col-span-1">
              <div className="card sticky top-8">
                <h2 className="text-xl font-semibold text-secondary-700 mb-6">注文サマリー</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">商品合計 ({getTotalItems()}点)</span>
                    <span className="font-medium">¥{getTotalPrice().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">送料</span>
                    <span className="font-medium">¥500</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>合計</span>
                      <span className="text-primary-600">¥{(getTotalPrice() + 500).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full btn-primary mb-4"
                >
                  レジに進む
                </button>
                
                <div className="text-center">
                  <Link
                    href="/products"
                    className="text-primary-600 hover:text-primary-700 text-sm transition-colors"
                  >
                    ← 買い物を続ける
                  </Link>
                </div>

                {/* 配送情報 */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-secondary-700 mb-3">配送について</h3>
                  <div className="text-sm text-secondary-600 space-y-2">
                    <p>📦 通常配送: 2-3営業日</p>
                    <p>🚚 送料: ¥500 (¥5,000以上で無料)</p>
                    <p>📍 全国配送対応</p>
                  </div>
                </div>

                {/* おすすめ商品 */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-secondary-700 mb-3">こちらもおすすめ</h3>
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-2xl mr-3">🥜</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-secondary-700">ナッツミックス</p>
                        <p className="text-sm text-primary-600 font-bold">¥680</p>
                      </div>
                      <button className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                        追加
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}