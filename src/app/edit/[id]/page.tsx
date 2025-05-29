'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Diary } from '@/types/diary'

export default function EditDiaryPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [diary, setDiary] = useState<Diary | null>(null)
  const router = useRouter()
  const params = useParams()
  const diaryId = params.id as string

  const fetchDiary = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('diaries')
        .select('*')
        .eq('id', diaryId)
        .single()

      if (error) {
        console.error('日記取得エラー:', error)
        router.push('/dashboard')
      } else {
        setDiary(data)
        setTitle(data.title)
        setContent(data.content)
      }
    } catch (error) {
      console.error('予期しないエラー:', error)
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }, [diaryId, router])

  const checkUserAndFetchDiary = useCallback(async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        router.push('/login')
        return
      }
      
      await fetchDiary()
    } catch (error) {
      console.error('ユーザー確認エラー:', error)
      router.push('/login')
    }
  }, [router, fetchDiary])

  useEffect(() => {
    checkUserAndFetchDiary()
  }, [checkUserAndFetchDiary])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    if (!title.trim() || !content.trim()) {
      setError('タイトルと内容を入力してください')
      setSaving(false)
      return
    }

    try {
      const { error } = await supabase
        .from('diaries')
        .update({
          title: title.trim(),
          content: content.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', diaryId)
        .select()

      if (error) {
        console.error('日記更新エラー:', error)
        setError('日記の更新に失敗しました')
      } else {
        // 更新成功時は詳細ページにリダイレクト
        router.push(`/diary/${diaryId}`)
      }
    } catch (err) {
      console.error('予期しないエラー:', err)
      setError('予期しないエラーが発生しました')
    } finally {
      setSaving(false)
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

  if (!diary) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            日記が見つかりません
          </h2>
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-800"
          >
            ダッシュボードに戻る
          </Link>
        </div>
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
              href={`/diary/${diaryId}`}
              className="text-blue-600 hover:text-blue-800 mr-4"
            >
              ← 日記に戻る
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">✏️ 日記を編集</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {formatDate(diary.created_at)}に作成された日記を編集しています
          </p>
        </div>

        {/* 日記編集フォーム */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              タイトル
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="日記のタイトルを入力してください"
              maxLength={100}
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {title.length}/100
            </div>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              内容
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
              placeholder="日記の内容を入力してください..."
            />
            <div className="text-right text-sm text-gray-500 mt-1">
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
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? '保存中...' : '💾 変更を保存'}
            </button>
            <Link
              href={`/diary/${diaryId}`}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center"
            >
              キャンセル
            </Link>
          </div>
        </form>

        {/* プレビューエリア */}
        {(title || content) && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">プレビュー</h3>
            <div className="bg-white p-4 rounded border">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                {title || 'タイトルなし'}
              </h4>
              <p className="text-gray-600 whitespace-pre-wrap">
                {content || '内容がありません'}
              </p>
            </div>
          </div>
        )}

        {/* 変更履歴情報 */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">📝 編集情報</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p>作成日時: {formatDate(diary.created_at)}</p>
            {diary.updated_at !== diary.created_at && (
              <p>最終更新: {formatDate(diary.updated_at)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 