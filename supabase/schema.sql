-- =============================================================================
-- SUPABASE POSTGRESQL SCHEMA FOR BIBLE STUDY WEBSITE
-- =============================================================================
-- This schema establishes tables for user profiles, bookmarks, notes, highlights,
-- prayer journal entries, and reading progress with full Row Level Security (RLS).
-- =============================================================================

-- 1. USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    display_name TEXT,
    reading_preferences JSONB DEFAULT '{"fontSize": "md", "theme": "light", "verseByVerse": false, "readingLayout": "comfortable"}'::JSONB,
    last_read_book TEXT DEFAULT 'Genesis',
    last_read_chapter INTEGER DEFAULT 1,
    last_read_verse INTEGER DEFAULT 1,
    reading_streak INTEGER DEFAULT 0,
    last_active_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BOOKMARKS TABLE
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    book TEXT NOT NULL,
    chapter INTEGER NOT NULL,
    verse_start INTEGER NOT NULL,
    verse_end INTEGER,
    label TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. NOTES TABLE
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    book TEXT NOT NULL,
    chapter INTEGER NOT NULL,
    verse INTEGER,
    note_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. HIGHLIGHTS TABLE
CREATE TABLE IF NOT EXISTS public.highlights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    book TEXT NOT NULL,
    chapter INTEGER NOT NULL,
    verse INTEGER NOT NULL,
    color TEXT NOT NULL DEFAULT 'yellow', -- 'yellow', 'green', 'blue', 'purple', 'rose'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_verse_highlight UNIQUE (user_id, book, chapter, verse)
);

-- 5. PRAYER JOURNAL TABLE
CREATE TABLE IF NOT EXISTS public.prayer_journal (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    request TEXT NOT NULL,
    category TEXT DEFAULT 'Petition', -- 'Thanksgiving', 'Petition', 'Intercession', 'Praise', 'Confession'
    is_answered BOOLEAN DEFAULT FALSE,
    answer_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. READING PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.reading_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    plan_id TEXT NOT NULL,
    day_number INTEGER NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    CONSTRAINT unique_user_plan_day UNIQUE (user_id, plan_id, day_number)
);

-- 7. READING HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.reading_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    book TEXT NOT NULL,
    chapter INTEGER NOT NULL,
    read_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_passage ON public.bookmarks(book, chapter);
CREATE INDEX IF NOT EXISTS idx_notes_user ON public.notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_passage ON public.notes(book, chapter);
CREATE INDEX IF NOT EXISTS idx_highlights_user_passage ON public.highlights(user_id, book, chapter);
CREATE INDEX IF NOT EXISTS idx_prayers_user ON public.prayer_journal(user_id);
CREATE INDEX IF NOT EXISTS idx_prayers_answered ON public.prayer_journal(user_id, is_answered);
CREATE INDEX IF NOT EXISTS idx_reading_progress_user_plan ON public.reading_progress(user_id, plan_id);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_journal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_history ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- BOOKMARKS POLICIES
CREATE POLICY "Users can view their own bookmarks"
    ON public.bookmarks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks"
    ON public.bookmarks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookmarks"
    ON public.bookmarks FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
    ON public.bookmarks FOR DELETE
    USING (auth.uid() = user_id);

-- NOTES POLICIES
CREATE POLICY "Users can view their own notes"
    ON public.notes FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes"
    ON public.notes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
    ON public.notes FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
    ON public.notes FOR DELETE
    USING (auth.uid() = user_id);

-- HIGHLIGHTS POLICIES
CREATE POLICY "Users can view their own highlights"
    ON public.highlights FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own highlights"
    ON public.highlights FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own highlights"
    ON public.highlights FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own highlights"
    ON public.highlights FOR DELETE
    USING (auth.uid() = user_id);

-- PRAYER JOURNAL POLICIES
CREATE POLICY "Users can view their own prayers"
    ON public.prayer_journal FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own prayers"
    ON public.prayer_journal FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prayers"
    ON public.prayer_journal FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prayers"
    ON public.prayer_journal FOR DELETE
    USING (auth.uid() = user_id);

-- READING PROGRESS POLICIES
CREATE POLICY "Users can view their own reading progress"
    ON public.reading_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reading progress"
    ON public.reading_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reading progress"
    ON public.reading_progress FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reading progress"
    ON public.reading_progress FOR DELETE
    USING (auth.uid() = user_id);

-- READING HISTORY POLICIES
CREATE POLICY "Users can view their own reading history"
    ON public.reading_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reading history"
    ON public.reading_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- AUTH TRIGGER: AUTOMATIC PROFILE CREATION ON USER SIGNUP
-- =============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, display_name)
    VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
