'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { useTheme } from '@/contexts/ThemeContext'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    // 現在のユーザー情報を取得
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()

    // 認証状態の変化を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <nav className="bg-blue-600 dark:bg-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              📖 My Diary
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* テーマ切り替えボタン */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-blue-700 dark:hover:bg-gray-700 transition-colors"
              aria-label="テーマ切り替え"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            
            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="hover:text-blue-200 dark:hover:text-gray-300 transition-colors"
                >
                  ダッシュボード
                </Link>
                <Link 
                  href="/create" 
                  className="hover:text-blue-200 dark:hover:text-gray-300 transition-colors"
                >
                  新規投稿
                </Link>
                <button
                  onClick={handleSignOut}
                  className="bg-blue-700 hover:bg-blue-800 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 py-1 rounded transition-colors"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="hover:text-blue-200 dark:hover:text-gray-300 transition-colors"
                >
                  ログイン
                </Link>
                <Link 
                  href="/signup" 
                  className="bg-blue-700 hover:bg-blue-800 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 py-1 rounded transition-colors"
                >
                  新規登録
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 