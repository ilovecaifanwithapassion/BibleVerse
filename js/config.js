/**
 * Configuration module for Bible Verse Study Website
 * Supports runtime configuration, environment variables, and user overrides in localStorage.
 */
const AppConfig = {
  appName: 'Bible App',
  translation: 'New International Version (NIV)',
  translationShort: 'NIV',
  
  // Scripture Data Provider: 'github' | 'api_bible' | 'custom_api'
  scriptureProvider: localStorage.getItem('bv_scripture_provider') || 'github',
  githubBaseUrl: 'https://raw.githubusercontent.com/aruljohn/Bible-niv/main',
  
  // Supabase Configuration
  // Can be pre-filled via server or dynamically configured by user in Settings UI
  supabaseUrl: localStorage.getItem('bv_supabase_url') || '',
  supabaseAnonKey: localStorage.getItem('bv_supabase_anon_key') || '',
  
  // Storage keys for guest / offline mode
  storageKeys: {
    theme: 'bv_theme',
    fontSize: 'bv_font_size',
    readerLayout: 'bv_reader_layout',
    lastPosition: 'bv_last_position',
    bookmarks: 'bv_bookmarks',
    notes: 'bv_notes',
    highlights: 'bv_highlights',
    prayers: 'bv_prayer_journal',
    readingProgress: 'bv_reading_progress',
    readingHistory: 'bv_reading_history',
    cachedBooks: 'bv_cache_books_'
  },
  
  // Legal copyright notice for NIV Scripture
  copyrightNotice: 'Scripture quotations taken from the Holy Bible, New International Version®, NIV®. Copyright © 1973, 1978, 1984, 2011 by Biblica, Inc.™ Used by permission of Zondervan. All rights reserved worldwide.'
};

window.AppConfig = AppConfig;
