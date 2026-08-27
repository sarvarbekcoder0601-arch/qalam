-- ============================================
-- QALAM — Supabase SQL Setup
-- supabase.com > SQL Editor'ga bu kodni joylashtiring
-- ============================================

-- 1. Profiles jadvali
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique not null,
  full_name text not null,
  bio text,
  avatar_url text,
  website text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Works (Asarlar) jadvali
create table public.works (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references public.profiles(id) on delete cascade not null,
  title text not null default '',
  content text not null default '',
  category text not null default 'story' check (category in ('scenario', 'poetry', 'story', 'essay', 'other')),
  tags text[] default '{}',
  is_published boolean default false,
  view_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Messages (Xabarlar) jadvali
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  receiver_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Comments jadvali
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  work_id uuid references public.works(id) on delete cascade not null,
  author_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Follows jadvali
create table public.follows (
  follower_id uuid references public.profiles(id) on delete cascade not null,
  following_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (follower_id, following_id)
);

-- 6. Likes jadvali
create table public.likes (
  user_id uuid references public.profiles(id) on delete cascade not null,
  work_id uuid references public.works(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, work_id)
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

alter table public.profiles enable row level security;
alter table public.works enable row level security;
alter table public.messages enable row level security;
alter table public.comments enable row level security;
alter table public.follows enable row level security;
alter table public.likes enable row level security;

-- Profiles policies
create policy "Profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);

-- Works policies
create policy "Published works are viewable by everyone" on public.works for select using (is_published = true or auth.uid() = author_id);
create policy "Users can insert their own works" on public.works for insert with check (auth.uid() = author_id);
create policy "Users can update their own works" on public.works for update using (auth.uid() = author_id);
create policy "Users can delete their own works" on public.works for delete using (auth.uid() = author_id);

-- Messages policies
create policy "Users can view their own messages" on public.messages for select using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "Users can send messages" on public.messages for insert with check (auth.uid() = sender_id);
create policy "Users can update their received messages" on public.messages for update using (auth.uid() = receiver_id);

-- Comments policies
create policy "Comments are viewable by everyone" on public.comments for select using (true);
create policy "Users can insert comments" on public.comments for insert with check (auth.uid() = author_id);
create policy "Users can delete their own comments" on public.comments for delete using (auth.uid() = author_id);

-- Follows policies
create policy "Follows are viewable by everyone" on public.follows for select using (true);
create policy "Users can follow/unfollow" on public.follows for all using (auth.uid() = follower_id);

-- Likes policies
create policy "Likes are viewable by everyone" on public.likes for select using (true);
create policy "Users can like/unlike" on public.likes for all using (auth.uid() = user_id);

-- ============================================
-- REALTIME
-- ============================================

-- Messages uchun realtime yoqish
alter publication supabase_realtime add table public.messages;

-- ============================================
-- TRIGGER: Yangi user yaratilganda profile yaratish
-- ============================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- INDEX'lar (Tezlik uchun)
-- ============================================

create index works_author_id_idx on public.works(author_id);
create index works_is_published_idx on public.works(is_published);
create index works_created_at_idx on public.works(created_at desc);
create index messages_sender_receiver_idx on public.messages(sender_id, receiver_id);
create index messages_created_at_idx on public.messages(created_at);
