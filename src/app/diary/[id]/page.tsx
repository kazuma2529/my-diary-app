'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Diary } from '@/types/diary'

export default function DiaryDetailPage() {
  const [diary, setDiary] = useState<Diary | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
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

  const handleDelete = async () => {
    setDeleting(true)
    
    try {
      const { error } = await supabase
        .from('diaries')
        .delete()
        .eq('id', diaryId)

      if (error) {
        console.error('削除エラー:', error)
        alert('日記の削除に失敗しました')
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('予期しないエラー:', error)
      alert('予期しないエラーが発生しました')
    } finally {
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit'
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
      <div className="max-w-4xl mx-auto">
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
          
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {diary.title}
              </h1>
              <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <p>作成日時: {formatDate(diary.created_at)}</p>
                {diary.updated_at !== diary.created_at && (
                  <p>更新日時: {formatDate(diary.updated_at)}</p>
                )}
              </div>
            </div>
            
            <div className="flex gap-2 ml-4">
              <Link
                href={`/edit/${diary.id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                ✏️ 編集
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                🗑️ 削除
              </button>
            </div>
          </div>
        </div>

        {/* 日記内容 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div className="prose max-w-none">
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed text-lg">
              {diary.content}
            </p>
          </div>
        </div>

        {/* 文字数表示 */}
        <div className="mt-4 text-right text-sm text-gray-500 dark:text-gray-400">
          {diary.content.length}文字
        </div>
      </div>

      {/* 削除確認モーダル */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              日記を削除しますか？
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              「{diary.title}」を削除します。この操作は取り消せません。
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                disabled={deleting}
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                disabled={deleting}
              >
                {deleting ? '削除中...' : '削除する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 