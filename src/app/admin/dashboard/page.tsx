'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { productDB, orderDB, seedInitialData, Product, Order } from '@/lib/indexedDB'

interface Stats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeDashboard = async () => {
      // 認証チェック
      const isLoggedIn = localStorage.getItem('isAdminLoggedIn')
      if (isLoggedIn === 'true') {
        setIsAuthenticated(true)
        await loadDashboardData()
      } else {
        window.location.href = '/admin'
      }
    }

    initializeDashboard()
  }, [])

  const loadDashboardData = async () => {
    try {
      await seedInitialData()
      
      // 商品データを取得
      const products = await productDB.getAll()
      
      // 注文データを取得
      const orders = await orderDB.getAll()
      
      // 統計を計算
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
      const pendingOrders = orders.filter(order => order.status === 'pending').length
      
      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders
      })
      
      // 最近の注文（最新5件）
      const sortedOrders = orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      setRecentOrders(sortedOrders.slice(0, 5))
      
      // 在庫不足商品（在庫5個以下）
      const lowStock = products.filter(product => product.stock <= 5)
      setLowStockProducts(lowStock)
      
    } catch (error) {
      console.error('ダッシュボードデータの読み込みに失敗しました:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn')
    window.location.href = '/admin'
  }

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await orderDB.updateStatus(orderId, newStatus)
      await loadDashboardData() // データを再読み込み
      alert('注文ステータスを更新しました')
    } catch (error) {
      console.error('注文ステータスの更新に失敗しました:', error)
      alert('注文ステータスの更新に失敗しました')
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: '処理中', className: 'bg-yellow-100 text-yellow-800' },
      shipped: { label: '発送済み', className: 'bg-blue-100 text-blue-800' },
      delivered: { label: '配送完了', className: 'bg-green-100 text-green-800' },
      cancelled: { label: 'キャンセル', className: 'bg-red-100 text-red-800' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.className}`}>
        {config.label}
      </span>
    )
  }

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600">
            {!isAuthenticated ? '認証を確認中...' : 'データを読み込み中...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary-600">🍶 酒屋</Link>
              <span className="ml-4 text-lg font-medium text-secondary-700">管理者ダッシュボード</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-secondary-600 hover:text-primary-600 transition-colors">
                サイトを見る
              </Link>
              <button
                onClick={handleLogout}
                className="bg-secondary-100 hover:bg-secondary-200 text-secondary-700 px-4 py-2 rounded-lg transition-colors"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ナビゲーション */}
        <nav className="mb-8">
          <div className="flex space-x-4">
            <Link
              href="/admin/dashboard"
              className="bg-primary-100 text-primary-700 px-4 py-2 rounded-lg font-medium"
            >
              ダッシュボード
            </Link>
            <Link
              href="/admin/products"
              className="text-secondary-600 hover:text-primary-600 px-4 py-2 rounded-lg transition-colors"
            >
              商品管理
            </Link>
            <Link
              href="/admin/orders"
              className="text-secondary-600 hover:text-primary-600 px-4 py-2 rounded-lg transition-colors"
            >
              注文管理
            </Link>
          </div>
        </nav>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <span className="text-2xl">📦</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">総商品数</p>
                <p className="text-2xl font-bold text-secondary-900">{stats.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">🛒</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">総注文数</p>
                <p className="text-2xl font-bold text-secondary-900">{stats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">総売上</p>
                <p className="text-2xl font-bold text-secondary-900">¥{stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">処理待ち注文</p>
                <p className="text-2xl font-bold text-secondary-900">{stats.pendingOrders}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 最近の注文 */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-secondary-900">最近の注文</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-secondary-900">{order.id}</p>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-secondary-600">{order.customerName}</p>
                      <p className="text-sm text-secondary-500">
                        {order.items.map(item => item.name).join(', ')}
                      </p>
                      <p className="text-sm text-secondary-500">{order.date}</p>
                      {order.status === 'pending' && (
                        <div className="mt-2 space-x-2">
                          <button
                            onClick={() => updateOrderStatus(order.id, 'shipped')}
                            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                          >
                            発送済みにする
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded"
                          >
                            キャンセル
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 text-right">
                      <p className="font-bold text-primary-600">¥{order.total.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link
                  href="/admin/orders"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  すべての注文を見る →
                </Link>
              </div>
            </div>
          </div>

          {/* 在庫不足商品 */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-secondary-900">在庫不足商品</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <p className="font-medium text-secondary-900">{product.name}</p>
                      <p className="text-sm text-secondary-600">
                        在庫: {product.stock}個 (要補充レベル: 5個以下)
                      </p>
                    </div>
                    <div className="ml-4">
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        要補充
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link
                  href="/admin/products"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  商品管理を見る →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}