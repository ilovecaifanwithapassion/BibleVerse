/**
 * Database & Persistence Layer for Bible Study Website
 * Provides seamless dual-mode operation:
 * 1. Supabase PostgreSQL when authenticated
 * 2. LocalStorage for Guest Mode and offline resilience
 * 3. Automatic data migration from guest mode upon user sign-up
 */

(function (window) {
  'use strict';

  class StorageDatabase {
    constructor() {
      this.supabase = null;
      this.currentUser = null;
      this.isConfigured = false;
      this.initSupabaseClient();
    }

    initSupabaseClient() {
      const url = window.AppConfig?.supabaseUrl;
      const key = window.AppConfig?.supabaseAnonKey;

      if (url && key && window.supabase && typeof window.supabase.createClient === 'function') {
        try {
          this.supabase = window.supabase.createClient(url, key);
          this.isConfigured = true;
          console.log('[DB] Supabase client initialized.');
        } catch (e) {
          console.warn('[DB] Supabase initialization failed, falling back to LocalStorage:', e);
          this.isConfigured = false;
        }
      } else {
        this.isConfigured = false;
      }
    }

    setCurrentUser(user) {
      this.currentUser = user;
    }

    isGuest() {
      return !this.currentUser || !this.isConfigured;
    }

    // ---------------------------------------------------------------------------
    // LOCAL STORAGE HELPERS
    // ---------------------------------------------------------------------------
    _getLocal(key, defaultValue = []) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (e) {
        console.error(`Error reading ${key} from localStorage:`, e);
        return defaultValue;
      }
    }

    _setLocal(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.error(`Error saving ${key} to localStorage:`, e);
      }
    }

    // ---------------------------------------------------------------------------
    // BOOKMARKS
    // ---------------------------------------------------------------------------
    async getBookmarks() {
      if (!this.isGuest()) {
        try {
          const { data, error } = await this.supabase
            .from('bookmarks')
            .select('*')
            .order('created_at', { ascending: false });
          if (error) throw error;
          return data || [];
        } catch (e) {
          console.warn('[DB] Falling back to local bookmarks:', e);
        }
      }
      return this._getLocal(window.AppConfig.storageKeys.bookmarks, []);
    }

    async addBookmark(bookmark) {
      const record = {
        id: bookmark.id || 'bm_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        book: bookmark.book,
        chapter: parseInt(bookmark.chapter, 10),
        verse_start: parseInt(bookmark.verse_start || bookmark.verse, 10),
        verse_end: bookmark.verse_end ? parseInt(bookmark.verse_end, 10) : null,
        label: bookmark.label || `${bookmark.book} ${bookmark.chapter}:${bookmark.verse_start || bookmark.verse}`,
        created_at: new Date().toISOString()
      };

      if (!this.isGuest()) {
        try {
          const { data, error } = await this.supabase
            .from('bookmarks')
            .insert([{ ...record, user_id: this.currentUser.id }])
            .select()
            .single();
          if (error) throw error;
          return data;
        } catch (e) {
          console.warn('[DB] Supabase bookmark insert failed, saving locally:', e);
        }
      }

      const bookmarks = this._getLocal(window.AppConfig.storageKeys.bookmarks, []);
      bookmarks.unshift(record);
      this._setLocal(window.AppConfig.storageKeys.bookmarks, bookmarks);
      return record;
    }

    async deleteBookmark(id) {
      if (!this.isGuest()) {
        try {
          await this.supabase.from('bookmarks').delete().eq('id', id);
        } catch (e) {
          console.warn('[DB] Supabase delete bookmark failed:', e);
        }
      }
      let bookmarks = this._getLocal(window.AppConfig.storageKeys.bookmarks, []);
      bookmarks = bookmarks.filter(b => b.id !== id);
      this._setLocal(window.AppConfig.storageKeys.bookmarks, bookmarks);
      return true;
    }

    // ---------------------------------------------------------------------------
    // NOTES
    // ---------------------------------------------------------------------------
    async getNotes(book, chapter) {
      if (!this.isGuest()) {
        try {
          let query = this.supabase.from('notes').select('*').order('created_at', { ascending: false });
          if (book) query = query.eq('book', book);
          if (chapter) query = query.eq('chapter', parseInt(chapter, 10));
          const { data, error } = await query;
          if (error) throw error;
          return data || [];
        } catch (e) {
          console.warn('[DB] Supabase getNotes failed, fallback local:', e);
        }
      }

      let notes = this._getLocal(window.AppConfig.storageKeys.notes, []);
      if (book) notes = notes.filter(n => n.book === book);
      if (chapter) notes = notes.filter(n => parseInt(n.chapter, 10) === parseInt(chapter, 10));
      return notes;
    }

    async saveNote(note) {
      const record = {
        id: note.id || 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        book: note.book,
        chapter: parseInt(note.chapter, 10),
        verse: note.verse ? parseInt(note.verse, 10) : null,
        note_text: note.note_text || note.text,
        updated_at: new Date().toISOString(),
        created_at: note.created_at || new Date().toISOString()
      };

      if (!this.isGuest()) {
        try {
          const { data, error } = await this.supabase
            .from('notes')
            .upsert({ ...record, user_id: this.currentUser.id })
            .select()
            .single();
          if (error) throw error;
          return data;
        } catch (e) {
          console.warn('[DB] Supabase save note failed:', e);
        }
      }

      let notes = this._getLocal(window.AppConfig.storageKeys.notes, []);
      const existingIndex = notes.findIndex(n => n.id === record.id);
      if (existingIndex >= 0) {
        notes[existingIndex] = record;
      } else {
        notes.unshift(record);
      }
      this._setLocal(window.AppConfig.storageKeys.notes, notes);
      return record;
    }

    async deleteNote(id) {
      if (!this.isGuest()) {
        try {
          await this.supabase.from('notes').delete().eq('id', id);
        } catch (e) {
          console.warn('[DB] Supabase delete note failed:', e);
        }
      }
      let notes = this._getLocal(window.AppConfig.storageKeys.notes, []);
      notes = notes.filter(n => n.id !== id);
      this._setLocal(window.AppConfig.storageKeys.notes, notes);
      return true;
    }

    // ---------------------------------------------------------------------------
    // HIGHLIGHTS
    // ---------------------------------------------------------------------------
    async getHighlights(book, chapter) {
      if (!this.isGuest()) {
        try {
          let query = this.supabase.from('highlights').select('*');
          if (book) query = query.eq('book', book);
          if (chapter) query = query.eq('chapter', parseInt(chapter, 10));
          const { data, error } = await query;
          if (error) throw error;
          return data || [];
        } catch (e) {
          console.warn('[DB] Supabase getHighlights fallback:', e);
        }
      }

      let hl = this._getLocal(window.AppConfig.storageKeys.highlights, []);
      if (book) hl = hl.filter(h => h.book === book);
      if (chapter) hl = hl.filter(h => parseInt(h.chapter, 10) === parseInt(chapter, 10));
      return hl;
    }

    async setHighlight(book, chapter, verse, color = 'yellow') {
      const ch = parseInt(chapter, 10);
      const v = parseInt(verse, 10);

      if (!this.isGuest()) {
        try {
          const { data, error } = await this.supabase
            .from('highlights')
            .upsert({
              user_id: this.currentUser.id,
              book,
              chapter: ch,
              verse: v,
              color,
              created_at: new Date().toISOString()
            }, { onConflict: 'user_id,book,chapter,verse' })
            .select()
            .single();
          if (error) throw error;
          return data;
        } catch (e) {
          console.warn('[DB] Supabase setHighlight failed:', e);
        }
      }

      let hl = this._getLocal(window.AppConfig.storageKeys.highlights, []);
      const existingIdx = hl.findIndex(h => h.book === book && parseInt(h.chapter, 10) === ch && parseInt(h.verse, 10) === v);
      const record = {
        id: 'hl_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        book,
        chapter: ch,
        verse: v,
        color,
        created_at: new Date().toISOString()
      };

      if (existingIdx >= 0) {
        hl[existingIdx].color = color;
      } else {
        hl.push(record);
      }
      this._setLocal(window.AppConfig.storageKeys.highlights, hl);
      return record;
    }

    async removeHighlight(book, chapter, verse) {
      const ch = parseInt(chapter, 10);
      const v = parseInt(verse, 10);

      if (!this.isGuest()) {
        try {
          await this.supabase
            .from('highlights')
            .delete()
            .eq('book', book)
            .eq('chapter', ch)
            .eq('verse', v);
        } catch (e) {
          console.warn('[DB] Supabase removeHighlight failed:', e);
        }
      }

      let hl = this._getLocal(window.AppConfig.storageKeys.highlights, []);
      hl = hl.filter(h => !(h.book === book && parseInt(h.chapter, 10) === ch && parseInt(h.verse, 10) === v));
      this._setLocal(window.AppConfig.storageKeys.highlights, hl);
      return true;
    }

    // ---------------------------------------------------------------------------
    // PRAYER JOURNAL (CRUD)
    // ---------------------------------------------------------------------------
    async getPrayers() {
      if (!this.isGuest()) {
        try {
          const { data, error } = await this.supabase
            .from('prayer_journal')
            .select('*')
            .order('created_at', { ascending: false });
          if (error) throw error;
          return data || [];
        } catch (e) {
          console.warn('[DB] Supabase getPrayers fallback:', e);
        }
      }

      return this._getLocal(window.AppConfig.storageKeys.prayers, []);
    }

    async savePrayer(prayer) {
      const record = {
        id: prayer.id || 'prayer_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        title: prayer.title,
        request: prayer.request,
        category: prayer.category || 'Petition',
        is_answered: prayer.is_answered || false,
        answer_notes: prayer.answer_notes || '',
        updated_at: new Date().toISOString(),
        created_at: prayer.created_at || new Date().toISOString()
      };

      if (!this.isGuest()) {
        try {
          const { data, error } = await this.supabase
            .from('prayer_journal')
            .upsert({ ...record, user_id: this.currentUser.id })
            .select()
            .single();
          if (error) throw error;
          return data;
        } catch (e) {
          console.warn('[DB] Supabase savePrayer failed:', e);
        }
      }

      let prayers = this._getLocal(window.AppConfig.storageKeys.prayers, []);
      const idx = prayers.findIndex(p => p.id === record.id);
      if (idx >= 0) {
        prayers[idx] = record;
      } else {
        prayers.unshift(record);
      }
      this._setLocal(window.AppConfig.storageKeys.prayers, prayers);
      return record;
    }

    async deletePrayer(id) {
      if (!this.isGuest()) {
        try {
          await this.supabase.from('prayer_journal').delete().eq('id', id);
        } catch (e) {
          console.warn('[DB] Supabase deletePrayer failed:', e);
        }
      }
      let prayers = this._getLocal(window.AppConfig.storageKeys.prayers, []);
      prayers = prayers.filter(p => p.id !== id);
      this._setLocal(window.AppConfig.storageKeys.prayers, prayers);
      return true;
    }

    async togglePrayerAnswered(id, answerNotes = '') {
      let prayers = await this.getPrayers();
      const target = prayers.find(p => p.id === id);
      if (!target) return null;

      target.is_answered = !target.is_answered;
      if (target.is_answered && answerNotes) {
        target.answer_notes = answerNotes;
      }
      target.updated_at = new Date().toISOString();

      return await this.savePrayer(target);
    }

    // ---------------------------------------------------------------------------
    // READING PROGRESS & READING PLANS
    // ---------------------------------------------------------------------------
    async getReadingProgress(planId) {
      if (!this.isGuest()) {
        try {
          let query = this.supabase.from('reading_progress').select('*');
          if (planId) query = query.eq('plan_id', planId);
          const { data, error } = await query;
          if (error) throw error;
          return data || [];
        } catch (e) {
          console.warn('[DB] Supabase getReadingProgress fallback:', e);
        }
      }

      const all = this._getLocal(window.AppConfig.storageKeys.readingProgress, []);
      return planId ? all.filter(p => p.plan_id === planId) : all;
    }

    async setPlanDayCompleted(planId, dayNumber, completed = true) {
      const record = {
        id: `prog_${planId}_${dayNumber}`,
        plan_id: planId,
        day_number: parseInt(dayNumber, 10),
        completed: completed,
        completed_at: completed ? new Date().toISOString() : null
      };

      if (!this.isGuest()) {
        try {
          await this.supabase
            .from('reading_progress')
            .upsert({ ...record, user_id: this.currentUser.id }, { onConflict: 'user_id,plan_id,day_number' });
        } catch (e) {
          console.warn('[DB] Supabase setPlanDayCompleted failed:', e);
        }
      }

      let all = this._getLocal(window.AppConfig.storageKeys.readingProgress, []);
      const idx = all.findIndex(p => p.plan_id === planId && p.day_number === parseInt(dayNumber, 10));
      if (idx >= 0) {
        all[idx] = record;
      } else {
        all.push(record);
      }
      this._setLocal(window.AppConfig.storageKeys.readingProgress, all);
      this.updateStreak();
      return record;
    }

    // ---------------------------------------------------------------------------
    // READING HISTORY & LAST POSITION
    // ---------------------------------------------------------------------------
    getLastPosition() {
      const def = { book: 'Genesis', chapter: 1, verse: 1 };
      return this._getLocal(window.AppConfig.storageKeys.lastPosition, def);
    }

    saveLastPosition(book, chapter, verse = 1) {
      const pos = {
        book,
        chapter: parseInt(chapter, 10),
        verse: parseInt(verse, 10),
        timestamp: new Date().toISOString()
      };
      this._setLocal(window.AppConfig.storageKeys.lastPosition, pos);

      if (!this.isGuest()) {
        this.supabase
          .from('profiles')
          .update({
            last_read_book: book,
            last_read_chapter: parseInt(chapter, 10),
            last_read_verse: parseInt(verse, 10),
            last_active_date: new Date().toISOString().split('T')[0]
          })
          .eq('id', this.currentUser.id)
          .then(() => {})
          .catch(e => console.warn('[DB] Profile last position sync error:', e));
      }
    }

    // ---------------------------------------------------------------------------
    // READING STREAKS
    // ---------------------------------------------------------------------------
    getStreakInfo() {
      const data = this._getLocal('bv_streak_data', { streak: 1, lastDate: new Date().toISOString().split('T')[0] });
      return data;
    }

    updateStreak() {
      const today = new Date().toISOString().split('T')[0];
      const data = this.getStreakInfo();

      if (data.lastDate === today) {
        return data.streak; // already recorded today
      }

      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (data.lastDate === yesterday) {
        data.streak += 1;
      } else {
        data.streak = 1; // reset streak if gap
      }

      data.lastDate = today;
      this._setLocal('bv_streak_data', data);
      return data.streak;
    }

    // ---------------------------------------------------------------------------
    // SYNC GUEST DATA TO USER ACCOUNT ON LOGIN
    // ---------------------------------------------------------------------------
    async syncGuestDataToAccount(userId) {
      if (!this.supabase || !userId) return;

      console.log('[DB] Migrating guest data to account:', userId);
      try {
        // Sync Bookmarks
        const localBookmarks = this._getLocal(window.AppConfig.storageKeys.bookmarks, []);
        for (const bm of localBookmarks) {
          await this.supabase.from('bookmarks').insert({
            user_id: userId,
            book: bm.book,
            chapter: bm.chapter,
            verse_start: bm.verse_start,
            verse_end: bm.verse_end,
            label: bm.label
          });
        }

        // Sync Notes
        const localNotes = this._getLocal(window.AppConfig.storageKeys.notes, []);
        for (const note of localNotes) {
          await this.supabase.from('notes').insert({
            user_id: userId,
            book: note.book,
            chapter: note.chapter,
            verse: note.verse,
            note_text: note.note_text
          });
        }

        // Sync Prayers
        const localPrayers = this._getLocal(window.AppConfig.storageKeys.prayers, []);
        for (const pr of localPrayers) {
          await this.supabase.from('prayer_journal').insert({
            user_id: userId,
            title: pr.title,
            request: pr.request,
            category: pr.category,
            is_answered: pr.is_answered,
            answer_notes: pr.answer_notes
          });
        }

        console.log('[DB] Guest data migration completed successfully.');
      } catch (e) {
        console.error('[DB] Migration error:', e);
      }
    }
  }

  window.AppDB = new StorageDatabase();

})(window);
