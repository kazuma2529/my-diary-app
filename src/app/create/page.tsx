'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function CreatePage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
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
    } catch (error) {
      console.error('ユーザー確認エラー:', error)
      router.push('/login')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!title.trim() || !content.trim()) {
      setError('タイトルと内容を入力してください')
      setLoading(false)
      return
    }

    try {
      // UUIDを生成
      const diaryId = crypto.randomUUID()
      
      const { data, error } = await supabase
        .from('diaries')
        .insert([
          {
            id: diaryId,
            user_id: user.id,
            title: title.trim(),
            content: content.trim(),
          }
        ])
        .select()

      if (error) {
        console.error('日記作成エラー:', error)
        setError('日記の作成に失敗しました')
      } else {
        // 作成成功時はダッシュボードにリダイレクト
        router.push('/dashboard')
      }
    } catch (err) {
      console.error('予期しないエラー:', err)
      setError('予期しないエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">認証確認中...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link 
              href="/dashboard"
              className="text-blue-600 hover:text-blue-800 mr-4"
            >
              ← ダッシュボードに戻る
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">✍️ 新しい日記を書く</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            今日の出来事や気持ちを記録しましょう
          </p>
        </div>

        {/* 日記作成フォーム */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              タイトル
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="今日のタイトルを入力してください"
              maxLength={100}
            />
            <div className="text-right text-sm text-gray-500 dark:text-gray-400 mt-1">
              {title.length}/100
            </div>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              内容
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="今日の出来事や気持ちを自由に書いてください..."
            />
            <div className="text-right text-sm text-gray-500 dark:text-gray-400 mt-1">
              {content.length}文字
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '保存中...' : '📝 日記を保存'}
            </button>
            <Link
              href="/dashboard"
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center"
            >
              キャンセル
            </Link>
          </div>
        </form>

        {/* プレビューエリア */}
        {(title || content) && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">プレビュー</h3>
            <div className="bg-white dark:bg-gray-700 p-4 rounded border dark:border-gray-600">
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {title || 'タイトルなし'}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                {content || '内容がありません'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 