'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Diary } from '@/types/diary'

export default function DashboardPage() {
  const [diaries, setDiaries] = useState<Diary[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        router.push('/login')
        return
      }
      
      setUser(user)
      await fetchDiaries()
    } catch (error) {
      console.error('ユーザー確認エラー:', error)
      router.push('/login')
    }
  }

  const fetchDiaries = async () => {
    try {
      const { data, error } = await supabase
        .from('diaries')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('日記取得エラー:', error)
      } else {
        setDiaries(data || [])
      }
    } catch (error) {
      console.error('予期しないエラー:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📖 マイ日記</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              ようこそ、{user?.email}さん
            </p>
          </div>
          <Link
            href="/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            ✍️ 新しい日記を書く
          </Link>
        </div>

        {/* 日記一覧 */}
        {diaries.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              まだ日記がありません
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              最初の日記を書いて、あなたの思い出を記録しましょう！
            </p>
            <Link
              href="/create"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
            >
              最初の日記を書く
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {diaries.map((diary) => (
              <div
                key={diary.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {diary.title}
                  </h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap ml-4">
                    {formatDate(diary.created_at)}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {diary.content}
                </p>
                
                <div className="flex justify-between items-center">
                  <Link
                    href={`/diary/${diary.id}`}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                  >
                    続きを読む →
                  </Link>
                  <div className="flex space-x-2">
                    <Link
                      href={`/edit/${diary.id}`}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm"
                    >
                      編集
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 