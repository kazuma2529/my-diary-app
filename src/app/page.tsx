'use client'

import Link from 'next/link'

export default function Home() {

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-4xl mx-auto">
        {/* ヒーローセクション */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            📖 My Diary
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            あなただけの特別な日記帳。毎日の思い出を安全に記録しましょう。
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              今すぐ始める
            </Link>
            <Link
              href="/login"
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              ログイン
            </Link>
          </div>
        </div>

        {/* 機能紹介 */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">プライベート</h3>
            <p className="text-gray-600 dark:text-gray-300">
              あなたの日記は完全にプライベート。他の人には見えません。
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">✍️</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">簡単記録</h3>
            <p className="text-gray-600 dark:text-gray-300">
              シンプルなインターフェースで、思い出を簡単に記録できます。
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">どこでもアクセス</h3>
            <p className="text-gray-600 dark:text-gray-300">
              スマートフォンやパソコンから、いつでもアクセスできます。
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-blue-50 dark:bg-gray-800 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            今日から日記を始めませんか？
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            無料でアカウントを作成して、あなたの日記ライフを始めましょう。
          </p>
          <Link
            href="/signup"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
          >
            無料で始める
          </Link>
        </div>
      </div>
    </div>
  )
}
