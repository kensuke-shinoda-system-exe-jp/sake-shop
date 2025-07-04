'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { productDB, diagnosisDB, seedInitialData, Product } from '@/lib/indexedDB'

// 診断質問データ
const questions = [
  {
    id: 1,
    question: 'どのような味がお好みですか？',
    options: [
      { value: 'sweet', label: '甘い', weight: { sake: 2, wine: 3, beer: 1, shochu: 1 } },
      { value: 'dry', label: '辛口', weight: { sake: 3, wine: 2, beer: 2, shochu: 3 } },
      { value: 'bitter', label: '苦い', weight: { sake: 1, wine: 1, beer: 3, shochu: 1 } },
      { value: 'sour', label: '酸っぱい', weight: { sake: 1, wine: 3, beer: 1, shochu: 1 } }
    ]
  },
  {
    id: 2,
    question: 'アルコール度数の好みは？',
    options: [
      { value: 'low', label: '低め（5-10%）', weight: { sake: 1, wine: 2, beer: 3, shochu: 0 } },
      { value: 'medium', label: '中程度（10-20%）', weight: { sake: 3, wine: 3, beer: 1, shochu: 1 } },
      { value: 'high', label: '高め（20%以上）', weight: { sake: 2, wine: 1, beer: 0, shochu: 3 } }
    ]
  },
  {
    id: 3,
    question: 'どのようなシーンで飲みますか？',
    options: [
      { value: 'daily', label: '日常的に', weight: { sake: 2, wine: 2, beer: 3, shochu: 2 } },
      { value: 'special', label: '特別な日に', weight: { sake: 3, wine: 3, beer: 1, shochu: 2 } },
      { value: 'party', label: 'パーティーで', weight: { sake: 1, wine: 2, beer: 3, shochu: 1 } },
      { value: 'alone', label: '一人でゆっくり', weight: { sake: 3, wine: 2, beer: 2, shochu: 3 } }
    ]
  },
  {
    id: 4,
    question: '温度の好みは？',
    options: [
      { value: 'cold', label: '冷たい', weight: { sake: 2, wine: 2, beer: 3, shochu: 2 } },
      { value: 'room', label: '常温', weight: { sake: 2, wine: 3, beer: 1, shochu: 2 } },
      { value: 'warm', label: '温かい', weight: { sake: 3, wine: 1, beer: 0, shochu: 3 } }
    ]
  }
]

export default function DiagnosisPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [result, setResult] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const initializeData = async () => {
      await seedInitialData()
    }
    initializeData()
  }, [])

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer]
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // 診断結果を計算
      calculateResult(newAnswers)
    }
  }

  const calculateResult = async (userAnswers: string[]) => {
    setLoading(true)
    
    try {
      const scores = { sake: 0, wine: 0, beer: 0, shochu: 0 }

      userAnswers.forEach((answer, index) => {
        const question = questions[index]
        const selectedOption = question.options.find(opt => opt.value === answer)
        if (selectedOption) {
          Object.entries(selectedOption.weight).forEach(([category, weight]) => {
            scores[category as keyof typeof scores] += weight
          })
        }
      })

      // 最高スコアのカテゴリーを取得
      const topCategory = Object.entries(scores).reduce((a, b) =>
        scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b
      )[0]

      // IndexedDBから該当カテゴリーの商品を取得
      const allProducts = await productDB.getAll()
      const categoryProducts = allProducts.filter(product => product.category === topCategory)
      
      // 診断結果を保存
      await diagnosisDB.save({
        answers: userAnswers,
        result: topCategory,
        timestamp: Date.now()
      })

      setResult(topCategory)
      setRecommendedProducts(categoryProducts.slice(0, 3)) // 最大3件
      setShowResult(true)
    } catch (error) {
      console.error('診断結果の計算に失敗しました:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetDiagnosis = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setResult(null)
    setShowResult(false)
  }

  const getCategoryName = (category: string) => {
    const names = {
      sake: '日本酒',
      wine: 'ワイン',
      beer: 'ビール',
      shochu: '焼酎'
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
            <Link href="/random" className="text-secondary-600 hover:text-primary-600 transition-colors">
              ランダム提案
            </Link>
            <Link href="/cart" className="text-secondary-600 hover:text-primary-600 transition-colors">
              カート
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-2xl mx-auto">
        {!showResult ? (
          <div className="card">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-secondary-700 mb-2">🎯 お酒診断</h1>
              <p className="text-secondary-600">
                いくつかの質問にお答えいただくと、あなたにぴったりのお酒をおすすめします！
              </p>
            </div>

            {/* 進捗バー */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-secondary-600 mb-2">
                <span>質問 {currentQuestion + 1} / {questions.length}</span>
                <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* 質問 */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-secondary-700 mb-6">
                {questions[currentQuestion].question}
              </h2>
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    disabled={loading}
                    className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 戻るボタン */}
            {currentQuestion > 0 && (
              <button
                onClick={() => {
                  setCurrentQuestion(currentQuestion - 1)
                  setAnswers(answers.slice(0, -1))
                }}
                className="btn-secondary"
              >
                前の質問に戻る
              </button>
            )}
          </div>
        ) : (
          <div className="card">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-3xl font-bold text-secondary-700 mb-2">診断結果</h1>
              <p className="text-lg text-secondary-600">
                あなたにおすすめのお酒は...
              </p>
            </div>

            <div className="bg-primary-50 rounded-lg p-6 mb-8 text-center">
              <h2 className="text-2xl font-bold text-primary-700 mb-2">
                {getCategoryName(result!)}
              </h2>
              <p className="text-secondary-600">
                {result === 'sake' && 'あなたは繊細で上品な味わいを好む方ですね。日本酒の奥深い世界をお楽しみください。'}
                {result === 'wine' && 'あなたはフルーティーで豊かな香りを好む方ですね。ワインの多様性をお楽しみください。'}
                {result === 'beer' && 'あなたは爽快で飲みやすいお酒を好む方ですね。ビールの爽やかさをお楽しみください。'}
                {result === 'shochu' && 'あなたは力強くて個性的な味わいを好む方ですね。焼酎の深い味わいをお楽しみください。'}
              </p>
            </div>

            {/* おすすめ商品 */}
            {recommendedProducts.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-secondary-700 mb-4">おすすめ商品</h3>
                <div className="grid gap-4">
                  {recommendedProducts.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h4 className="font-semibold text-secondary-700 mb-2">{product.name}</h4>
                      <p className="text-secondary-600 text-sm mb-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-primary-600 font-bold">¥{product.price.toLocaleString()}</span>
                        <button className="btn-primary">カートに追加</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* アクションボタン */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={resetDiagnosis} className="btn-secondary flex-1">
                もう一度診断する
              </button>
              <Link href="/products" className="btn-primary flex-1 text-center">
                商品一覧を見る
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}