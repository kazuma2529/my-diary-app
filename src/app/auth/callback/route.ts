import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('認証エラー:', error)
        return NextResponse.redirect(new URL('/login?error=認証に失敗しました', request.url))
      }

      // 認証成功時はダッシュボードにリダイレクト
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } catch (err) {
      console.error('予期しないエラー:', err)
      return NextResponse.redirect(new URL('/login?error=予期しないエラーが発生しました', request.url))
    }
  }

  // codeがない場合はログインページにリダイレクト
  return NextResponse.redirect(new URL('/login', request.url))
} 