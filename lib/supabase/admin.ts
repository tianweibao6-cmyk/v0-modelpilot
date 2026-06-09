import { createClient as createSupabaseClient } from "@supabase/supabase-js"

/**
 * 服务端管理员客户端（使用 Service Role Key，绕过 RLS）。
 * 仅可在受信任的服务端环境使用，例如支付异步通知回调。
 * 严禁在客户端代码中引入此文件。
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  )
}
