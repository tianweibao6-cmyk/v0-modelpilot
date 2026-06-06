// SigmaPilot 的 Supabase 客户端入口。
// 仅从环境变量读取配置，不写死任何密钥。
//   NEXT_PUBLIC_SUPABASE_URL
//   NEXT_PUBLIC_SUPABASE_ANON_KEY
//
// 客户端组件请使用 createClient（基于 @supabase/ssr 的浏览器客户端）。
// 服务端组件请从 "@/lib/supabase/server" 引入。
export { createClient } from "@/lib/supabase/client"
