/**
 * Bible Provider Module for New International Version (NIV)
 * Handles book indexing, chapter and verse retrieval, caching, and search.
 * Designed with a pluggable adapter architecture to support multiple Scripture data sources.
 */

(function (window) {
  'use strict';

  // 66 Canonical Books of the Bible with metadata
  const BIBLE_BOOKS = [
    // Old Testament (39 books)
    { id: 1, name: 'Genesis', testament: 'OT', chapters: 50, category: 'Pentateuch', abbrev: ['Gen', 'Ge', 'Gn'] },
    { id: 2, name: 'Exodus', testament: 'OT', chapters: 40, category: 'Pentateuch', abbrev: ['Exo', 'Ex', 'Exod'] },
    { id: 3, name: 'Leviticus', testament: 'OT', chapters: 27, category: 'Pentateuch', abbrev: ['Lev', 'Le', 'Lv'] },
    { id: 4, name: 'Numbers', testament: 'OT', chapters: 36, category: 'Pentateuch', abbrev: ['Num', 'Nu', 'Nm', 'Nb'] },
    { id: 5, name: 'Deuteronomy', testament: 'OT', chapters: 34, category: 'Pentateuch', abbrev: ['Deut', 'De', 'Dt'] },
    { id: 6, name: 'Joshua', testament: 'OT', chapters: 24, category: 'Historical', abbrev: ['Josh', 'Jos', 'Jsh'] },
    { id: 7, name: 'Judges', testament: 'OT', chapters: 21, category: 'Historical', abbrev: ['Judg', 'Jdg', 'Jdgs'] },
    { id: 8, name: 'Ruth', testament: 'OT', chapters: 4, category: 'Historical', abbrev: ['Rth', 'Ru'] },
    { id: 9, name: '1 Samuel', testament: 'OT', chapters: 31, category: 'Historical', abbrev: ['1 Sam', '1Sam', '1Sa', '1S'] },
    { id: 10, name: '2 Samuel', testament: 'OT', chapters: 24, category: 'Historical', abbrev: ['2 Sam', '2Sam', '2Sa', '2S'] },
    { id: 11, name: '1 Kings', testament: 'OT', chapters: 22, category: 'Historical', abbrev: ['1 Kgs', '1Kings', '1Ki', '1K'] },
    { id: 12, name: '2 Kings', testament: 'OT', chapters: 25, category: 'Historical', abbrev: ['2 Kgs', '2Kings', '2Ki', '2K'] },
    { id: 13, name: '1 Chronicles', testament: 'OT', chapters: 29, category: 'Historical', abbrev: ['1 Chron', '1Chr', '1Ch'] },
    { id: 14, name: '2 Chronicles', testament: 'OT', chapters: 36, category: 'Historical', abbrev: ['2 Chron', '2Chr', '2Ch'] },
    { id: 15, name: 'Ezra', testament: 'OT', chapters: 10, category: 'Historical', abbrev: ['Ezr'] },
    { id: 16, name: 'Nehemiah', testament: 'OT', chapters: 13, category: 'Historical', abbrev: ['Neh', 'Ne'] },
    { id: 17, name: 'Esther', testament: 'OT', chapters: 10, category: 'Historical', abbrev: ['Esth', 'Es'] },
    { id: 18, name: 'Job', testament: 'OT', chapters: 42, category: 'Poetry & Wisdom', abbrev: ['Jb'] },
    { id: 19, name: 'Psalms', testament: 'OT', chapters: 150, category: 'Poetry & Wisdom', abbrev: ['Psalm', 'Psa', 'Ps', 'Psm'] },
    { id: 20, name: 'Proverbs', testament: 'OT', chapters: 31, category: 'Poetry & Wisdom', abbrev: ['Prov', 'Pro', 'Pr', 'Prv'] },
    { id: 21, name: 'Ecclesiastes', testament: 'OT', chapters: 12, category: 'Poetry & Wisdom', abbrev: ['Eccl', 'Ecc', 'Ec'] },
    { id: 22, name: 'Song of Songs', testament: 'OT', chapters: 8, category: 'Poetry & Wisdom', abbrev: ['Song', 'Song of Solomon', 'SOS', 'Canticles'] },
    { id: 23, name: 'Isaiah', testament: 'OT', chapters: 66, category: 'Major Prophets', abbrev: ['Isa', 'Is'] },
    { id: 24, name: 'Jeremiah', testament: 'OT', chapters: 52, category: 'Major Prophets', abbrev: ['Jer', 'Je', 'Jr'] },
    { id: 25, name: 'Lamentations', testament: 'OT', chapters: 5, category: 'Major Prophets', abbrev: ['Lam', 'La'] },
    { id: 26, name: 'Ezekiel', testament: 'OT', chapters: 48, category: 'Major Prophets', abbrev: ['Ezek', 'Eze', 'Ezk'] },
    { id: 27, name: 'Daniel', testament: 'OT', chapters: 12, category: 'Major Prophets', abbrev: ['Dan', 'Da', 'Dn'] },
    { id: 28, name: 'Hosea', testament: 'OT', chapters: 14, category: 'Minor Prophets', abbrev: ['Hos', 'Ho'] },
    { id: 29, name: 'Joel', testament: 'OT', chapters: 3, category: 'Minor Prophets', abbrev: ['Joe', 'Jl'] },
    { id: 30, name: 'Amos', testament: 'OT', chapters: 9, category: 'Minor Prophets', abbrev: ['Am'] },
    { id: 31, name: 'Obadiah', testament: 'OT', chapters: 1, category: 'Minor Prophets', abbrev: ['Obad', 'Ob'] },
    { id: 32, name: 'Jonah', testament: 'OT', chapters: 4, category: 'Minor Prophets', abbrev: ['Jon', 'Jnh'] },
    { id: 33, name: 'Micah', testament: 'OT', chapters: 7, category: 'Minor Prophets', abbrev: ['Mic'] },
    { id: 34, name: 'Nahum', testament: 'OT', chapters: 3, category: 'Minor Prophets', abbrev: ['Nah', 'Na'] },
    { id: 35, name: 'Habakkuk', testament: 'OT', chapters: 3, category: 'Minor Prophets', abbrev: ['Hab'] },
    { id: 36, name: 'Zephaniah', testament: 'OT', chapters: 3, category: 'Minor Prophets', abbrev: ['Zeph', 'Zep', 'Zp'] },
    { id: 37, name: 'Haggai', testament: 'OT', chapters: 2, category: 'Minor Prophets', abbrev: ['Hag', 'Hg'] },
    { id: 38, name: 'Zechariah', testament: 'OT', chapters: 14, category: 'Minor Prophets', abbrev: ['Zech', 'Zec', 'Zc'] },
    { id: 39, name: 'Malachi', testament: 'OT', chapters: 4, category: 'Minor Prophets', abbrev: ['Mal', 'Ml'] },

    // New Testament (27 books)
    { id: 40, name: 'Matthew', testament: 'NT', chapters: 28, category: 'Gospels', abbrev: ['Matt', 'Mat', 'Mt'] },
    { id: 41, name: 'Mark', testament: 'NT', chapters: 16, category: 'Gospels', abbrev: ['Mrk', 'Mk', 'Mr'] },
    { id: 42, name: 'Luke', testament: 'NT', chapters: 24, category: 'Gospels', abbrev: ['Luk', 'Lk'] },
    { id: 43, name: 'John', testament: 'NT', chapters: 21, category: 'Gospels', abbrev: ['Jn', 'Jhn'] },
    { id: 44, name: 'Acts', testament: 'NT', chapters: 28, category: 'Church History', abbrev: ['Act', 'Ac'] },
    { id: 45, name: 'Romans', testament: 'NT', chapters: 16, category: 'Pauline Epistles', abbrev: ['Rom', 'Ro', 'Rm'] },
    { id: 46, name: '1 Corinthians', testament: 'NT', chapters: 16, category: 'Pauline Epistles', abbrev: ['1 Cor', '1Cor', '1Co'] },
    { id: 47, name: '2 Corinthians', testament: 'NT', chapters: 13, category: 'Pauline Epistles', abbrev: ['2 Cor', '2Cor', '2Co'] },
    { id: 48, name: 'Galatians', testament: 'NT', chapters: 6, category: 'Pauline Epistles', abbrev: ['Gal', 'Ga'] },
    { id: 49, name: 'Ephesians', testament: 'NT', chapters: 6, category: 'Pauline Epistles', abbrev: ['Eph', 'Ep'] },
    { id: 50, name: 'Philippians', testament: 'NT', chapters: 4, category: 'Pauline Epistles', abbrev: ['Phil', 'Php', 'Pp'] },
    { id: 51, name: 'Colossians', testament: 'NT', chapters: 4, category: 'Pauline Epistles', abbrev: ['Col'] },
    { id: 52, name: '1 Thessalonians', testament: 'NT', chapters: 5, category: 'Pauline Epistles', abbrev: ['1 Thess', '1Thess', '1Th', '1Ts'] },
    { id: 53, name: '2 Thessalonians', testament: 'NT', chapters: 3, category: 'Pauline Epistles', abbrev: ['2 Thess', '2Thess', '2Th', '2Ts'] },
    { id: 54, name: '1 Timothy', testament: 'NT', chapters: 6, category: 'Pauline Epistles', abbrev: ['1 Tim', '1Tim', '1Ti'] },
    { id: 55, name: '2 Timothy', testament: 'NT', chapters: 4, category: 'Pauline Epistles', abbrev: ['2 Tim', '2Tim', '2Ti'] },
    { id: 56, name: 'Titus', testament: 'NT', chapters: 3, category: 'Pauline Epistles', abbrev: ['Tit', 'Ti'] },
    { id: 57, name: 'Philemon', testament: 'NT', chapters: 1, category: 'Pauline Epistles', abbrev: ['Phlm', 'Phm', 'Pm'] },
    { id: 58, name: 'Hebrews', testament: 'NT', chapters: 13, category: 'General Epistles', abbrev: ['Heb'] },
    { id: 59, name: 'James', testament: 'NT', chapters: 5, category: 'General Epistles', abbrev: ['Jas', 'Jm'] },
    { id: 60, name: '1 Peter', testament: 'NT', chapters: 5, category: 'General Epistles', abbrev: ['1 Pet', '1Pet', '1Pe', '1P'] },
    { id: 61, name: '2 Peter', testament: 'NT', chapters: 3, category: 'General Epistles', abbrev: ['2 Pet', '2Pet', '2Pe', '2P'] },
    { id: 62, name: '1 John', testament: 'NT', chapters: 5, category: 'General Epistles', abbrev: ['1 Jn', '1John', '1J'] },
    { id: 63, name: '2 John', testament: 'NT', chapters: 1, category: 'General Epistles', abbrev: ['2 Jn', '2John', '2J'] },
    { id: 64, name: '3 John', testament: 'NT', chapters: 1, category: 'General Epistles', abbrev: ['3 Jn', '3John', '3J'] },
    { id: 65, name: 'Jude', testament: 'NT', chapters: 1, category: 'General Epistles', abbrev: ['Jud'] },
    { id: 66, name: 'Revelation', testament: 'NT', chapters: 22, category: 'Prophecy', abbrev: ['Rev', 'Rv'] }
  ];

  /**
   * GitHub Raw Data Provider (aruljohn/Bible-niv)
   */
  class GitHubNivProvider {
    constructor(baseUrl) {
      this.baseUrl = baseUrl || 'https://raw.githubusercontent.com/aruljohn/Bible-niv/main';
    }

    async getBook(bookName) {
      // Normalize book name to exact file name in repo
      const canonical = BibleProvider.findBook(bookName);
      if (!canonical) {
        throw new Error(`Unknown book: "${bookName}"`);
      }

      const fileName = encodeURIComponent(canonical.name) + '.json';
      const url = `${this.baseUrl}/${fileName}`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to load ${canonical.name} (${res.status} ${res.statusText})`);
      }

      const data = await res.json();
      return this._normalizeBookData(data, canonical.name);
    }

    _normalizeBookData(data, expectedName) {
      // Ensure consistent numeric chapters and verses
      const chapters = (data.chapters || []).map(ch => {
        const chapterNum = parseInt(ch.chapter, 10);
        const verses = (ch.verses || []).map(v => ({
          verse: parseInt(v.verse, 10),
          text: (v.text || '').trim()
        }));
        return {
          chapter: chapterNum,
          verses: verses
        };
      });

      return {
        book: expectedName || data.book,
        count: chapters.length,
        chapters: chapters
      };
    }
  }

  /**
   * Adapter for Authorized NIV API (e.g. API.Bible or custom Biblica endpoint)
   * Connects to official API when authorized credentials are provided.
   */
  class AuthorizedNivApiAdapter {
    constructor(config) {
      this.apiKey = config.apiKey || '';
      this.bibleId = config.bibleId || '';
      this.endpoint = config.endpoint || 'https://api.scripture.api.bible/v1';
    }

    async getBook(bookName) {
      if (!this.apiKey) {
        throw new Error('Authorized NIV API key is missing. Please configure your API key in Settings.');
      }
      // Implementation ready for production licensed NIV API endpoint
      const canonical = BibleProvider.findBook(bookName);
      const url = `${this.endpoint}/bibles/${this.bibleId}/books/${canonical.abbrev[0]}?include-chapters=true`;
      const res = await fetch(url, {
        headers: { 'api-key': this.apiKey }
      });
      if (!res.ok) {
        throw new Error(`Authorized API error: ${res.status}`);
      }
      return await res.json();
    }
  }

  /**
   * Main Bible Provider Service
   */
  class BibleService {
    constructor() {
      this.books = BIBLE_BOOKS;
      this.memoryCache = new Map();
      this.providerType = window.AppConfig?.scriptureProvider || 'github';
      this.activeProvider = new GitHubNivProvider(window.AppConfig?.githubBaseUrl);
    }

    setProvider(type, options = {}) {
      this.providerType = type;
      if (type === 'api_bible') {
        this.activeProvider = new AuthorizedNivApiAdapter(options);
      } else {
        this.activeProvider = new GitHubNivProvider(options.baseUrl || window.AppConfig?.githubBaseUrl);
      }
      this.clearCache();
    }

    clearCache() {
      this.memoryCache.clear();
    }

    /**
     * Find canonical book object by full name or abbreviation
     */
    findBook(query) {
      if (!query) return null;
      const clean = query.trim().toLowerCase();

      // Check exact name match
      let match = this.books.find(b => b.name.toLowerCase() === clean);
      if (match) return match;

      // Check name without spaces (e.g., '1john')
      match = this.books.find(b => b.name.toLowerCase().replace(/\s+/g, '') === clean.replace(/\s+/g, ''));
      if (match) return match;

      // Check abbreviations
      match = this.books.find(b => {
        return b.abbrev.some(a => a.toLowerCase() === clean || a.toLowerCase().replace(/\s+/g, '') === clean.replace(/\s+/g, ''));
      });
      if (match) return match;

      // Prefix match (e.g. 'gen' -> 'Genesis')
      if (clean.length >= 3) {
        match = this.books.find(b => b.name.toLowerCase().startsWith(clean));
        if (match) return match;
      }

      return null;
    }

    /**
     * Fetch a full book (uses in-memory cache)
     */
    async fetchBook(bookName) {
      const canonical = this.findBook(bookName);
      if (!canonical) {
        throw new Error(`Book not found: "${bookName}"`);
      }

      const cacheKey = canonical.name;
      if (this.memoryCache.has(cacheKey)) {
        return this.memoryCache.get(cacheKey);
      }

      const bookData = await this.activeProvider.getBook(canonical.name);
      this.memoryCache.set(cacheKey, bookData);
      return bookData;
    }

    /**
     * Fetch a specific chapter
     */
    async fetchChapter(bookName, chapterNum) {
      const bookData = await this.fetchBook(bookName);
      const targetChapter = parseInt(chapterNum, 10);

      const chapter = bookData.chapters.find(c => c.chapter === targetChapter);
      if (!chapter) {
        throw new Error(`${bookData.book} does not have chapter ${targetChapter} (Max: ${bookData.chapters.length})`);
      }

      return {
        book: bookData.book,
        chapter: targetChapter,
        totalChapters: bookData.chapters.length,
        verses: chapter.verses,
        canonical: this.findBook(bookData.book)
      };
    }

    /**
     * Fetch a specific passage or verse range
     */
    async fetchPassage(bookName, chapterNum, verseStart, verseEnd) {
      const chapterData = await this.fetchChapter(bookName, chapterNum);
      const start = parseInt(verseStart, 10);
      const end = verseEnd ? parseInt(verseEnd, 10) : start;

      const filteredVerses = chapterData.verses.filter(v => v.verse >= start && v.verse <= end);
      return {
        book: chapterData.book,
        chapter: chapterData.chapter,
        verseStart: start,
        verseEnd: end,
        verses: filteredVerses,
        referenceText: end > start 
          ? `${chapterData.book} ${chapterData.chapter}:${start}-${end}` 
          : `${chapterData.book} ${chapterData.chapter}:${start}`
      };
    }

    /**
     * Parse a Bible reference string like "John 3:16", "Romans 8:28-30", "1 Cor 13", "Gen 1"
     */
    parseReference(referenceStr) {
      if (!referenceStr || typeof referenceStr !== 'string') return null;

      // Regex matches: "1 John 3:16-17", "John 3:16", "Genesis 1", "Romans 8:28"
      const match = referenceStr.trim().match(/^((?:[1-3]\s+)?[A-Za-z\s]+?)\s*(\d+)(?:\s*[:.]\s*(\d+)(?:\s*[-–]\s*(\d+))?)?$/);
      if (!match) return null;

      const bookStr = match[1].trim();
      const canonical = this.findBook(bookStr);
      if (!canonical) return null;

      const chapter = parseInt(match[2], 10);
      const verseStart = match[3] ? parseInt(match[3], 10) : null;
      const verseEnd = match[4] ? parseInt(match[4], 10) : (verseStart ? verseStart : null);

      return {
        book: canonical.name,
        chapter: chapter,
        verseStart: verseStart,
        verseEnd: verseEnd,
        canonical: canonical
      };
    }

    /**
     * Search Scripture
     * Supports:
     * 1. Direct Reference (e.g., "John 3:16") -> returns single passage
     * 2. Keyword or Phrase across loaded / popular books
     */
    async searchScripture(query, options = {}) {
      if (!query || query.trim().length === 0) return { type: 'empty', results: [] };
      const q = query.trim();

      // Check if query is a Bible reference
      const refParsed = this.parseReference(q);
      if (refParsed) {
        try {
          if (refParsed.verseStart) {
            const passage = await this.fetchPassage(refParsed.book, refParsed.chapter, refParsed.verseStart, refParsed.verseEnd);
            return {
              type: 'reference',
              query: q,
              results: passage.verses.map(v => ({
                book: passage.book,
                chapter: passage.chapter,
                verse: v.verse,
                reference: `${passage.book} ${passage.chapter}:${v.verse}`,
                text: v.text
              }))
            };
          } else {
            const chapter = await this.fetchChapter(refParsed.book, refParsed.chapter);
            return {
              type: 'chapter',
              query: q,
              book: chapter.book,
              chapter: chapter.chapter,
              results: chapter.verses.map(v => ({
                book: chapter.book,
                chapter: chapter.chapter,
                verse: v.verse,
                reference: `${chapter.book} ${chapter.chapter}:${v.verse}`,
                text: v.text
              }))
            };
          }
        } catch (e) {
          // If reference lookup fails, fall through to text search
        }
      }

      // Keyword / Phrase search
      const searchTerm = q.toLowerCase();
      const scopeBooks = options.scopeBooks || [
        'Matthew', 'Mark', 'Luke', 'John', 'Romans', 'Psalms', 'Proverbs', 
        'Genesis', 'Ephesians', 'Philippians', 'Hebrews', 'James', '1 John'
      ];

      const results = [];
      const maxResults = options.limit || 50;

      // Search through target books
      for (const bookName of scopeBooks) {
        if (results.length >= maxResults) break;
        try {
          const bookData = await this.fetchBook(bookName);
          for (const ch of bookData.chapters) {
            for (const v of ch.verses) {
              if (v.text && v.text.toLowerCase().includes(searchTerm)) {
                results.push({
                  book: bookData.book,
                  chapter: ch.chapter,
                  verse: v.verse,
                  reference: `${bookData.book} ${ch.chapter}:${v.verse}`,
                  text: v.text
                });
                if (results.length >= maxResults) break;
              }
            }
            if (results.length >= maxResults) break;
          }
        } catch (err) {
          console.warn(`Search error in ${bookName}:`, err);
        }
      }

      return {
        type: 'text_search',
        query: q,
        totalFound: results.length,
        results: results
      };
    }
  }

  // Export singleton instance
  window.BibleProvider = new BibleService();
  window.BIBLE_BOOKS = BIBLE_BOOKS;

})(window);
