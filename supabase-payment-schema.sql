-- SigmaPilot 支付与用户系统数据库 Schema
-- 在 Supabase SQL Editor 中执行即可创建全部表与 RLS 策略。

-- ============================================================
-- 1. 用户档案表：记录套餐状态
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  plan_status text not null default 'inactive', -- inactive | beta_active
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_delete_own" on public.profiles;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

-- ============================================================
-- 2. 订单表
-- ============================================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric not null default 0,
  status text not null default 'pending', -- pending | paid | failed
  out_trade_no text,                       -- 商户订单号
  trade_no text,                           -- 码支付平台订单号
  product_type text,                       -- project_pack | diagram
  product_name text,
  pay_type text default 'wxpay',
  qr_code text,                            -- 支付二维码链接
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

drop policy if exists "orders_select_own" on public.orders;
drop policy if exists "orders_insert_own" on public.orders;
drop policy if exists "orders_update_own" on public.orders;
drop policy if exists "orders_delete_own" on public.orders;

create policy "orders_select_own" on public.orders for select using (auth.uid() = user_id);
create policy "orders_insert_own" on public.orders for insert with check (auth.uid() = user_id);
create policy "orders_update_own" on public.orders for update using (auth.uid() = user_id);
create policy "orders_delete_own" on public.orders for delete using (auth.uid() = user_id);

create unique index if not exists orders_out_trade_no_key on public.orders (out_trade_no);
create index if not exists orders_user_id_idx on public.orders (user_id);

-- ============================================================
-- 3. 报告表
-- ============================================================
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  status text not null default 'processing', -- processing | ready
  created_at timestamptz not null default now()
);

alter table public.reports enable row level security;

drop policy if exists "reports_select_own" on public.reports;
drop policy if exists "reports_insert_own" on public.reports;
drop policy if exists "reports_update_own" on public.reports;
drop policy if exists "reports_delete_own" on public.reports;

create policy "reports_select_own" on public.reports for select using (auth.uid() = user_id);
create policy "reports_insert_own" on public.reports for insert with check (auth.uid() = user_id);
create policy "reports_update_own" on public.reports for update using (auth.uid() = user_id);
create policy "reports_delete_own" on public.reports for delete using (auth.uid() = user_id);

-- ============================================================
-- 4. 新用户自动建档触发器
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, plan_status)
  values (new.id, new.email, 'inactive')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
