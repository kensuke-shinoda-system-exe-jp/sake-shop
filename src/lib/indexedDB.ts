// IndexedDBのユーティリティ関数

export interface Product {
  id: number
  name: string
  category: string
  price: number
  description: string
  alcoholPercent: number
  image: string
  tags: string[]
  stock: number
  pairing?: string[]
}

export interface CartItem {
  id: number
  productId: number
  name: string
  price: number
  quantity: number
  image: string
  category: string
}

export interface Order {
  id: string
  customerName: string
  customerEmail: string
  items: CartItem[]
  total: number
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled'
  date: string
  shippingAddress: string
}

export interface User {
  id: string
  email: string
  name: string
  isAdmin: boolean
  createdAt: string
}

const DB_NAME = 'SakeShopDB'
const DB_VERSION = 1

// データベースの初期化
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // 商品ストア
      if (!db.objectStoreNames.contains('products')) {
        const productStore = db.createObjectStore('products', { keyPath: 'id' })
        productStore.createIndex('category', 'category', { unique: false })
        productStore.createIndex('name', 'name', { unique: false })
      }

      // カートストア
      if (!db.objectStoreNames.contains('cart')) {
        db.createObjectStore('cart', { keyPath: 'id' })
      }

      // 注文ストア
      if (!db.objectStoreNames.contains('orders')) {
        const orderStore = db.createObjectStore('orders', { keyPath: 'id' })
        orderStore.createIndex('status', 'status', { unique: false })
        orderStore.createIndex('date', 'date', { unique: false })
      }

      // ユーザーストア
      if (!db.objectStoreNames.contains('users')) {
        const userStore = db.createObjectStore('users', { keyPath: 'id' })
        userStore.createIndex('email', 'email', { unique: true })
      }

      // 診断履歴ストア
      if (!db.objectStoreNames.contains('diagnosis_history')) {
        db.createObjectStore('diagnosis_history', { keyPath: 'id', autoIncrement: true })
      }

      // ランダム提案履歴ストア
      if (!db.objectStoreNames.contains('random_history')) {
        db.createObjectStore('random_history', { keyPath: 'id', autoIncrement: true })
      }
    }
  })
}

// 商品関連の操作
export const productDB = {
  // 全商品を取得
  getAll: async (): Promise<Product[]> => {
    const db = await initDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['products'], 'readonly')
      const store = transaction.objectStore('products')
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  },

  // 商品を追加
  add: async (product: Product): Promise<void> => {
    const db = await initDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['products'], 'readwrite')
      const store = transaction.objectStore('products')
      const request = store.add(product)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  },

  // 商品を更新
  update: async (product: Product): Promise<void> => {
    const db = await initDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['products'], 'readwrite')
      const store = transaction.objectStore('products')
      const request = store.put(product)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  },

  // 商品を削除
  delete: async (id: number): Promise<void> => {
    const db = await initDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['products'], 'readwrite')
      const store = transaction.objectStore('products')
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  },

  // カテゴリー別商品を取得
  getByCategory: async (category: string): Promise<Product[]> => {
    const db = await initDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['products'], 'readonly')
      const store = transaction.objectStore('products')
      const index = store.index('category')
      const request = index.getAll(category)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }
}

// カート関連の操作
export const cartDB = {
  // カート内容を取得
  getAll: async (): Promise<CartItem[]> => {
    const db = await initDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['cart'], 'readonly')
      const store = transaction.objectStore('cart')
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  },

  // カートに商品を追加
  add: async (item: CartItem): Promise<void> => {
    const db = await initDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['cart'], 'readwrite')
      const store = transaction.objectStore('cart')
      const request = store.put(item)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  },

  // カートから商品を削除
  remove: async (id: number): Promise<void> => {
    const db = await initDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['cart'], 'readwrite')
      const store = transaction.objectStore('cart')
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  },

  // カートをクリア
  clear: async (): Promise<void> => {
    const db = await initDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['cart'], 'readwrite')
      const store = transaction.objectStore('cart')
      const request = store.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }
}

// 注文関連の操作
export const orderDB = {
  // 全注文を取得
  getAll: async (): Promise<Order[]> => {
    const db = await initDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['orders'], 'readonly')
      const store = transaction.objectStore('orders')
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  },

  // 注文を追加
  add: async (order: Order): Promise<void> => {
    const db = await initDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['orders'], 'readwrite')
      const store = transaction.objectStore('orders')
      const request = store.add(order)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  },

  // 注文ステータスを更新
  updateStatus: async (id: string, status: Order['status']): Promise<void> => {
    const db = await initDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['orders'], 'readwrite')
      const store = transaction.objectStore('orders')
      const getRequest = store.get(id)

      getRequest.onsuccess = () => {
        const order = getRequest.result
        if (order) {
          order.status = status
          const putRequest = store.put(order)
          putRequest.onsuccess = () => resolve()
          putRequest.onerror = () => reject(putRequest.error)
        } else {
          reject(new Error('Order not found'))
        }
      }
      getRequest.onerror = () => reject(getRequest.error)
    })
  }
}

// 診断履歴の操作
export const diagnosisDB = {
  // 診断結果を保存
  save: async (result: { answers: string[], result: string, timestamp: number }): Promise<void> => {
    const db = await initDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['diagnosis_history'], 'readwrite')
      const store = transaction.objectStore('diagnosis_history')
      const request = store.add(result)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  },

  // 診断履歴を取得
  getHistory: async (): Promise<any[]> => {
    const db = await initDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['diagnosis_history'], 'readonly')
      const store = transaction.objectStore('diagnosis_history')
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }
}

// ランダム提案履歴の操作
export const randomDB = {
  // 提案を保存
  save: async (product: Product): Promise<void> => {
    const db = await initDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['random_history'], 'readwrite')
      const store = transaction.objectStore('random_history')
      const request = store.add({ ...product, timestamp: Date.now() })

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  },

  // 履歴を取得（最新5件）
  getHistory: async (): Promise<any[]> => {
    const db = await initDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['random_history'], 'readonly')
      const store = transaction.objectStore('random_history')
      const request = store.getAll()

      request.onsuccess = () => {
        const results = request.result
        // 最新5件を取得
        const sorted = results.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5)
        resolve(sorted)
      }
      request.onerror = () => reject(request.error)
    })
  }
}

// 初期データの投入
export const seedInitialData = async (): Promise<void> => {
  const products = await productDB.getAll()
  
  // 商品データが存在しない場合のみ初期データを投入
  if (products.length === 0) {
    const initialProducts: Product[] = [
      {
        id: 1,
        name: '純米大吟醸 山田錦',
        category: 'sake',
        price: 3500,
        description: '山田錦を使用した上品な味わいの純米大吟醸酒',
        alcoholPercent: 15.5,
        image: '/images/sake1.jpg',
        tags: ['日本酒', '純米大吟醸', '山田錦'],
        stock: 10,
        pairing: ['刺身', '天ぷら', '和食']
      },
      {
        id: 2,
        name: '本格焼酎 黒霧島',
        category: 'shochu',
        price: 1200,
        description: 'さつまいもの甘みが感じられる本格焼酎',
        alcoholPercent: 25,
        image: '/images/shochu1.jpg',
        tags: ['焼酎', 'さつまいも', '本格'],
        stock: 15,
        pairing: ['焼き鳥', '餃子', '鍋料理']
      },
      {
        id: 3,
        name: 'シャルドネ 白ワイン',
        category: 'wine',
        price: 2800,
        description: 'フルーティーで爽やかな白ワイン',
        alcoholPercent: 12,
        image: '/images/wine1.jpg',
        tags: ['ワイン', '白ワイン', 'シャルドネ'],
        stock: 8,
        pairing: ['魚料理', 'チーズ', 'サラダ']
      },
      {
        id: 4,
        name: 'クラフトビール IPA',
        category: 'beer',
        price: 450,
        description: 'ホップの苦味が効いたクラフトビール',
        alcoholPercent: 6.5,
        image: '/images/beer1.jpg',
        tags: ['ビール', 'クラフト', 'IPA'],
        stock: 20,
        pairing: ['ピザ', 'ハンバーガー', 'スパイシー料理']
      },
      {
        id: 5,
        name: 'チーズ盛り合わせ',
        category: 'snack',
        price: 1800,
        description: '3種類のチーズの盛り合わせ',
        alcoholPercent: 0,
        image: '/images/cheese1.jpg',
        tags: ['おつまみ', 'チーズ', '盛り合わせ'],
        stock: 12,
        pairing: ['ワイン', '日本酒', 'ビール']
      },
      {
        id: 6,
        name: 'ナッツミックス',
        category: 'snack',
        price: 680,
        description: '4種類のナッツをミックスした人気のおつまみ',
        alcoholPercent: 0,
        image: '/images/nuts1.jpg',
        tags: ['おつまみ', 'ナッツ', 'ミックス'],
        stock: 25,
        pairing: ['ビール', 'ウイスキー', '焼酎']
      }
    ]

    // 初期商品データを投入
    for (const product of initialProducts) {
      await productDB.add(product)
    }
  }
}