/**
 * Main Application Coordinator & Controller
 * Implements Bible Reader, Study Tools, Reading Plans, Prayer Journal,
 * Search, Bookmarks, and User State Management.
 */

(function (window) {
  'use strict';

  // ===========================================================================
  // APPLICATION ROUTER
  // ===========================================================================
  const AppRouter = {
    currentView: 'home',

    init() {
      // Hash change listener
      window.addEventListener('hashchange', () => {
        const hash = window.location.hash.replace('#', '') || 'home';
        this.navigate(hash, false);
      });

      // Handle initial hash
      const initialHash = window.location.hash.replace('#', '') || 'home';
      this.navigate(initialHash, false);

      // Bind nav links
      document.querySelectorAll('[data-view]').forEach(link => {
        link.addEventListener('click', (e) => {
          const view = link.getAttribute('data-view');
          if (view) {
            e.preventDefault();
            this.navigate(view);
          }
        });
      });
    },

    navigate(viewName, updateHash = true, scrollToTop = true) {
      const target = document.getElementById(`view-${viewName}`);
      if (!target) return;

      this.currentView = viewName;
      if (updateHash) {
        window.location.hash = viewName;
      }

      // Update active view class
      document.querySelectorAll('.app-view').forEach(v => v.classList.remove('active'));
      target.classList.add('active');

      // Update nav link styles
      document.querySelectorAll('.nav-link, .mobile-nav-item').forEach(link => {
        if (link.getAttribute('data-view') === viewName) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      // Refresh view-specific data
      if (viewName === 'home') AppUI.refreshHome();
      if (viewName === 'prayers') AppUI.renderPrayers();
      if (viewName === 'plans') AppUI.renderPlans();
      if (viewName === 'bookmarks') AppUI.renderSavedItems();
      if (viewName === 'study') AppUI.renderStudyTools();
      if (viewName === 'settings') AppUI.renderSettings();

      // Scroll to top when requested
      if (scrollToTop) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // ===========================================================================
  // APP UI & FEATURE CONTROLLER
  // ===========================================================================
  const AppUI = {
    // Current reader state
    reader: {
      book: 'Genesis',
      chapter: 1,
      fontSize: localStorage.getItem(window.AppConfig?.storageKeys.fontSize) || 'md',
      layout: localStorage.getItem(window.AppConfig?.storageKeys.readerLayout) || 'paragraph',
      showHeadings: localStorage.getItem('bv_show_headings') !== 'false',
      selectedVerse: null,
      selectedVerseText: '',
      highlights: [],
      notes: []
    },

    // Custom titles helper
    getCustomTitles() {
      try {
        return JSON.parse(localStorage.getItem('bv_custom_titles') || '{}');
      } catch (e) {
        return {};
      }
    },

    setCustomTitle(book, chapter, verse, title) {
      const all = this.getCustomTitles();
      const key = `${book}:${chapter}:${verse}`;
      if (title && title.trim()) {
        all[key] = title.trim();
      } else {
        delete all[key];
      }
      localStorage.setItem('bv_custom_titles', JSON.stringify(all));
    },

    toggleSectionHeadings() {
      this.reader.showHeadings = !this.reader.showHeadings;
      localStorage.setItem('bv_show_headings', this.reader.showHeadings);
      const btn = document.getElementById('btn-toggle-headings');
      const lbl = document.getElementById('headings-label');
      if (btn) btn.classList.toggle('active', this.reader.showHeadings);
      if (lbl) lbl.textContent = `Headings: ${this.reader.showHeadings ? 'On' : 'Off'}`;
      this.showToast(`Section Headings: ${this.reader.showHeadings ? 'Enabled' : 'Disabled'}`);
      this.loadChapter(this.reader.book, this.reader.chapter);
    },

    // Study tool state
    selectedStudyBook: 'Genesis',

    // Book picker state
    pickerTestament: 'OT',
    pickerSelectedBook: null,

    // Active auth mode: 'signin' | 'signup'
    authMode: 'signin',

    init() {
      this.initTheme();
      this.initEventListeners();
      this.initAuthListeners();

      // Restore last reading position
      const lastPos = window.AppDB.getLastPosition();
      this.reader.book = lastPos.book || 'Genesis';
      this.reader.chapter = lastPos.chapter || 1;

      // Initial renders
      this.loadChapter(this.reader.book, this.reader.chapter);
      this.refreshHome();
      this.renderStudyTools();
      this.renderPlans();
      this.renderPrayers();

      // Lucide icon replacement
      if (window.lucide) {
        window.lucide.createIcons();
      }
    },

    // -------------------------------------------------------------------------
    // THEME & APPEARANCE
    // -------------------------------------------------------------------------
    initTheme() {
      const savedTheme = localStorage.getItem(window.AppConfig?.storageKeys.theme) || 'light';
      document.documentElement.setAttribute('data-theme', savedTheme);
      this.updateThemeIcon(savedTheme);
    },

    toggleTheme() {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem(window.AppConfig?.storageKeys.theme, next);
      this.updateThemeIcon(next);
      this.showToast(`Switched to ${next === 'dark' ? 'Dark' : 'Light'} Mode`);
    },

    updateThemeIcon(theme) {
      const icon = document.getElementById('theme-icon');
      if (icon) {
        icon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
        if (window.lucide) window.lucide.createIcons();
      }
    },

    setFontSize(size) {
      this.reader.fontSize = size;
      localStorage.setItem(window.AppConfig?.storageKeys.fontSize, size);

      const textElem = document.getElementById('scripture-verses-body');
      if (textElem) {
        textElem.classList.remove('font-sm', 'font-md', 'font-lg', 'font-xl');
        textElem.classList.add(`font-${size}`);
      }

      document.querySelectorAll('.font-size-btn').forEach(btn => {
        if (btn.getAttribute('data-size') === size) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    },

    toggleLayout() {
      this.reader.layout = this.reader.layout === 'paragraph' ? 'verse-by-verse' : 'paragraph';
      localStorage.setItem(window.AppConfig?.storageKeys.readerLayout, this.reader.layout);

      const textElem = document.getElementById('scripture-verses-body');
      const label = document.getElementById('layout-label');
      if (textElem && label) {
        if (this.reader.layout === 'verse-by-verse') {
          textElem.classList.remove('layout-paragraph');
          textElem.classList.add('layout-verse-by-verse');
          label.textContent = 'Paragraph';
        } else {
          textElem.classList.remove('layout-verse-by-verse');
          textElem.classList.add('layout-paragraph');
          label.textContent = 'Verse Mode';
        }
      }
    },

    // -------------------------------------------------------------------------
    // VERSE NAVIGATION & TARGET HIGHLIGHTING
    // -------------------------------------------------------------------------
    async navigateToVerse(bookName, chapterNum, verseNum) {
      if (!bookName || !chapterNum) {
        this.showToast('Invalid Scripture reference', 'error');
        return;
      }

      const vNum = parseInt(verseNum, 10);
      const chNum = parseInt(chapterNum, 10);

      if (isNaN(vNum) || vNum < 1) {
        this.showToast(`Invalid verse number: ${verseNum}`, 'error');
        return;
      }

      // Close any open modals and reset body scroll locks
      document.querySelectorAll('.modal-backdrop.active').forEach(m => m.classList.remove('active'));
      document.body.style.overflow = '';

      // Switch view to reader without automatically resetting scroll to top
      AppRouter.navigate('reader', true, false);

      try {
        const canonical = window.BibleProvider.findBook(bookName);
        if (!canonical) {
          this.showToast(`Book "${bookName}" could not be found.`, 'error');
          return;
        }

        // Check if the requested book & chapter is currently displayed with verses rendered
        const isCurrentChapter = (
          this.reader.book &&
          this.reader.book.toLowerCase() === canonical.name.toLowerCase() &&
          parseInt(this.reader.chapter, 10) === chNum
        );

        const currentVersesContainer = document.getElementById('scripture-verses-body');
        const hasRenderedVerses = currentVersesContainer && currentVersesContainer.querySelector('.verse-item');

        if (!isCurrentChapter || !hasRenderedVerses) {
          // Asynchronously load the chapter and await data fetching and DOM rendering
          await this.loadChapter(canonical.name, chNum);
        }

        // Wait until target verse element exists and is rendered in DOM
        const targetElement = await this.waitForVerseElement(vNum, 3500);

        if (!targetElement) {
          const count = this.reader.versesCount || document.querySelectorAll('.verse-item').length;
          const countMsg = count ? ` (Chapter has ${count} verses)` : '';
          this.showToast(`Verse ${vNum} not found in ${canonical.name} ${chNum}${countMsg}.`, 'error');
          return;
        }

        // Double requestAnimationFrame ensures full browser layout calculation and geometry readiness
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            try {
              targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
              });
            } catch (e) {
              targetElement.scrollIntoView(true);
            }

            // Outline and pulse target verse for clear visual discovery
            this.highlightTargetVerse(targetElement);
          });
        });

      } catch (err) {
        console.error('Error navigating to verse:', err);
        this.showToast(`Navigation error: ${err.message || err}`, 'error');
      }
    },

    async waitForVerseElement(verseNum, timeoutMs = 3500) {
      const startTime = Date.now();
      while (Date.now() - startTime < timeoutMs) {
        const el = document.getElementById(`verse-${verseNum}`);
        if (el && el.offsetParent !== null) {
          return el;
        }
        await new Promise(resolve => setTimeout(resolve, 40));
      }
      return document.getElementById(`verse-${verseNum}`) || null;
    },

    highlightTargetVerse(targetElement) {
      if (!targetElement) return;

      // Remove any lingering target focus classes
      document.querySelectorAll('.verse-target-focus').forEach(el => el.classList.remove('verse-target-focus'));

      targetElement.classList.add('verse-target-focus');

      // Remove outline class after 3 seconds so original highlights are preserved
      setTimeout(() => {
        targetElement.classList.remove('verse-target-focus');
      }, 3000);
    },

    // -------------------------------------------------------------------------
    // BIBLE READER
    // -------------------------------------------------------------------------
    async loadChapter(bookName, chapterNum) {
      const container = document.getElementById('scripture-verses-body');
      const heading = document.getElementById('reader-heading');
      const bookLabel = document.getElementById('current-book-label');
      const chLabel = document.getElementById('current-chapter-label');
      const testamentLabel = document.getElementById('reader-book-testament');
      const versesCountLabel = document.getElementById('reader-verses-count');

      // Hide verse action bar
      this.hideVerseActionBar();

      // Show loading indicator
      if (container) {
        container.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon"><i data-lucide="loader-2" class="spin"></i></div>
            <div class="empty-state-title">Loading Scripture...</div>
            <div class="empty-state-desc">${bookName} Chapter ${chapterNum} (NIV)</div>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
      }

      try {
        const canonical = window.BibleProvider.findBook(bookName);
        if (!canonical) throw new Error(`Unknown book: ${bookName}`);

        const ch = parseInt(chapterNum, 10);
        this.reader.book = canonical.name;
        this.reader.chapter = ch;

        // Fetch chapter data, highlights, and notes in parallel
        const [chapterData, highlights, notes] = await Promise.all([
          window.BibleProvider.fetchChapter(canonical.name, ch),
          window.AppDB.getHighlights(canonical.name, ch),
          window.AppDB.getNotes(canonical.name, ch)
        ]);

        this.reader.highlights = highlights;
        this.reader.notes = notes;

        // Update headers
        if (heading) heading.textContent = `${canonical.name} ${ch}`;
        if (bookLabel) bookLabel.textContent = canonical.name;
        if (chLabel) chLabel.textContent = ch;
        if (testamentLabel) testamentLabel.textContent = canonical.testament === 'OT' ? 'Old Testament' : 'New Testament';
        if (versesCountLabel) versesCountLabel.textContent = `${chapterData.verses.length} Verses`;
        this.reader.versesCount = chapterData.verses.length;

        // Save last read position & record streak
        window.AppDB.saveLastPosition(canonical.name, ch, 1);
        window.AppDB.updateStreak();

        // Render verses
        this.renderVerses(chapterData.verses);

        // Update Prev / Next chapter navigation cards
        this.updateChapterNavButtons(canonical, ch);

        // Update Home resume button label
        const resumeLbl = document.getElementById('resume-position-label');
        if (resumeLbl) resumeLbl.textContent = `${canonical.name} ${ch}`;

      } catch (err) {
        console.error('Error loading chapter:', err);
        if (container) {
          container.innerHTML = `
            <div class="empty-state">
              <div class="empty-state-icon"><i data-lucide="alert-circle"></i></div>
              <div class="empty-state-title">Failed to load chapter</div>
              <div class="empty-state-desc">${err.message || 'Please check your connection.'}</div>
              <button class="btn btn-primary btn-sm" onclick="AppUI.loadChapter('${bookName}', ${chapterNum})">Try Again</button>
            </div>
          `;
          if (window.lucide) window.lucide.createIcons();
        }
      }
    },

    renderVerses(verses) {
      const container = document.getElementById('scripture-verses-body');
      if (!container) return;

      container.className = `scripture-text font-${this.reader.fontSize} layout-${this.reader.layout}`;
      container.innerHTML = '';

      const customTitles = this.getCustomTitles();

      verses.forEach(v => {
        // Render Section Title / Heading above verse if present
        if (this.reader.showHeadings) {
          const customKey = `${this.reader.book}:${this.reader.chapter}:${v.verse}`;
          const customTitle = customTitles[customKey];
          const standardHeading = window.SectionHeadings ? window.SectionHeadings.getHeading(this.reader.book, this.reader.chapter, v.verse) : null;
          const sectionTitle = customTitle || standardHeading;

          if (sectionTitle) {
            const headingWrap = document.createElement('div');
            headingWrap.className = 'verse-section-container';
            headingWrap.innerHTML = `
              <div class="verse-section-heading">
                <span class="section-tag-badge">Section</span>
                <span>${sectionTitle}</span>
              </div>
            `;
            container.appendChild(headingWrap);
          }
        }

        const verseSpan = document.createElement('span');
        verseSpan.className = 'verse-item';
        verseSpan.setAttribute('data-verse', v.verse);
        verseSpan.setAttribute('id', `verse-${v.verse}`);

        // Check if highlighted
        const hl = this.reader.highlights.find(h => parseInt(h.verse, 10) === v.verse);
        if (hl) {
          verseSpan.classList.add(`hl-${hl.color}`);
        }

        // Verse Number
        const numSpan = document.createElement('sup');
        numSpan.className = 'verse-num';
        numSpan.textContent = v.verse;
        verseSpan.appendChild(numSpan);

        // Verse Text
        const textNode = document.createTextNode(v.text + ' ');
        verseSpan.appendChild(textNode);

        // Check for attached note
        const note = this.reader.notes.find(n => parseInt(n.verse, 10) === v.verse);
        if (note) {
          const noteBadge = document.createElement('span');
          noteBadge.className = 'note-badge';
          noteBadge.title = 'View note: ' + note.note_text.slice(0, 40) + '...';
          noteBadge.innerHTML = '✎';
          noteBadge.onclick = (e) => {
            e.stopPropagation();
            AppUI.openNoteEditor(v.verse, v.text, note);
          };
          verseSpan.appendChild(noteBadge);
        }

        // Click handler for floating action bar
        verseSpan.addEventListener('click', () => {
          AppUI.selectVerse(v.verse, v.text);
        });

        container.appendChild(verseSpan);
      });
    },

    openCustomTitleModal() {
      if (!this.reader.selectedVerse) return;
      const v = this.reader.selectedVerse;
      const heading = document.getElementById('verse-title-modal-heading');
      const preview = document.getElementById('title-verse-preview');
      const input = document.getElementById('custom-verse-title-input');

      if (heading) heading.textContent = `Section Title for ${this.reader.book} ${this.reader.chapter}:${v}`;
      if (preview) preview.textContent = `"${this.reader.selectedVerseText}"`;

      const key = `${this.reader.book}:${this.reader.chapter}:${v}`;
      const existingCustom = this.getCustomTitles()[key];
      const existingStandard = window.SectionHeadings ? window.SectionHeadings.getHeading(this.reader.book, this.reader.chapter, v) : '';
      if (input) input.value = existingCustom || existingStandard || '';

      this.openModal('modal-verse-title');
    },

    saveCustomTitleFromModal() {
      if (!this.reader.selectedVerse) return;
      const v = this.reader.selectedVerse;
      const input = document.getElementById('custom-verse-title-input');
      const title = input ? input.value.trim() : '';

      this.setCustomTitle(this.reader.book, this.reader.chapter, v, title);
      this.closeModal('modal-verse-title');
      this.showToast(`Section title ${title ? 'saved' : 'cleared'} for verse ${v}`);
      this.hideVerseActionBar();
      this.loadChapter(this.reader.book, this.reader.chapter);
    },

    selectVerse(verseNum, verseText) {
      this.reader.selectedVerse = verseNum;
      this.reader.selectedVerseText = verseText;

      // Update selected class
      document.querySelectorAll('.verse-item').forEach(el => {
        if (parseInt(el.getAttribute('data-verse'), 10) === verseNum) {
          el.classList.add('selected');
        } else {
          el.classList.remove('selected');
        }
      });

      // Show floating action bar
      const bar = document.getElementById('verse-action-bar');
      const label = document.getElementById('action-bar-verse-ref');
      if (bar && label) {
        label.textContent = `${this.reader.book} ${this.reader.chapter}:${verseNum}`;
        bar.classList.add('active');
      }
    },

    hideVerseActionBar() {
      this.reader.selectedVerse = null;
      document.querySelectorAll('.verse-item').forEach(el => el.classList.remove('selected'));
      const bar = document.getElementById('verse-action-bar');
      if (bar) bar.classList.remove('active');
    },

    async applyHighlight(color) {
      if (!this.reader.selectedVerse) return;
      const v = this.reader.selectedVerse;
      const book = this.reader.book;
      const ch = this.reader.chapter;

      const verseEl = document.getElementById(`verse-${v}`);

      if (color === 'none') {
        await window.AppDB.removeHighlight(book, ch, v);
        if (verseEl) {
          verseEl.classList.remove('hl-yellow', 'hl-green', 'hl-blue', 'hl-purple', 'hl-rose');
        }
        this.showToast(`Highlight removed from verse ${v}`);
      } else {
        await window.AppDB.setHighlight(book, ch, v, color);
        if (verseEl) {
          verseEl.classList.remove('hl-yellow', 'hl-green', 'hl-blue', 'hl-purple', 'hl-rose');
          verseEl.classList.add(`hl-${color}`);
        }
        this.showToast(`Verse ${v} highlighted in ${color}`);
      }
    },

    async bookmarkSelectedVerse() {
      if (!this.reader.selectedVerse) return;
      const v = this.reader.selectedVerse;
      const book = this.reader.book;
      const ch = this.reader.chapter;

      await window.AppDB.addBookmark({
        book,
        chapter: ch,
        verse_start: v,
        label: `${book} ${ch}:${v}`
      });

      this.showToast(`Bookmarked ${book} ${ch}:${v}`);
      this.hideVerseActionBar();
    },

    copySelectedVerse() {
      if (!this.reader.selectedVerse) return;
      const v = this.reader.selectedVerse;
      const ref = `${this.reader.book} ${this.reader.chapter}:${v}`;
      const text = `"${this.reader.selectedVerseText}" — ${ref} (NIV)`;

      navigator.clipboard.writeText(text).then(() => {
        this.showToast(`Copied ${ref} to clipboard`);
      }).catch(() => {
        this.showToast(`Copied ${ref}`);
      });
      this.hideVerseActionBar();
    },

    studySelectedVerse() {
      if (!this.reader.selectedVerse) return;
      this.selectedStudyBook = this.reader.book;
      AppRouter.navigate('study');
      this.renderStudyTools();
      this.hideVerseActionBar();
    },

    updateChapterNavButtons(canonical, currentCh) {
      const prevCard = document.getElementById('card-nav-prev');
      const nextCard = document.getElementById('card-nav-next');
      const prevLbl = document.getElementById('prev-target-label');
      const nextLbl = document.getElementById('next-target-label');
      const prevBtn = document.getElementById('btn-prev-chapter');
      const nextBtn = document.getElementById('btn-next-chapter');

      // Previous chapter calculation
      if (currentCh > 1) {
        const target = currentCh - 1;
        prevLbl.textContent = `${canonical.name} ${target}`;
        prevCard.style.visibility = 'visible';
        prevBtn.disabled = false;
        prevCard.onclick = () => AppUI.loadChapter(canonical.name, target);
        prevBtn.onclick = () => AppUI.loadChapter(canonical.name, target);
      } else {
        // Look up previous book in 66 books list
        const prevBook = window.BIBLE_BOOKS.find(b => b.id === canonical.id - 1);
        if (prevBook) {
          prevLbl.textContent = `${prevBook.name} ${prevBook.chapters}`;
          prevCard.style.visibility = 'visible';
          prevBtn.disabled = false;
          prevCard.onclick = () => AppUI.loadChapter(prevBook.name, prevBook.chapters);
          prevBtn.onclick = () => AppUI.loadChapter(prevBook.name, prevBook.chapters);
        } else {
          prevCard.style.visibility = 'hidden';
          prevBtn.disabled = true;
        }
      }

      // Next chapter calculation
      if (currentCh < canonical.chapters) {
        const target = currentCh + 1;
        nextLbl.textContent = `${canonical.name} ${target}`;
        nextCard.style.visibility = 'visible';
        nextBtn.disabled = false;
        nextCard.onclick = () => AppUI.loadChapter(canonical.name, target);
        nextBtn.onclick = () => AppUI.loadChapter(canonical.name, target);
      } else {
        // Look up next book in 66 books list
        const nextBook = window.BIBLE_BOOKS.find(b => b.id === canonical.id + 1);
        if (nextBook) {
          nextLbl.textContent = `${nextBook.name} 1`;
          nextCard.style.visibility = 'visible';
          nextBtn.disabled = false;
          nextCard.onclick = () => AppUI.loadChapter(nextBook.name, 1);
          nextBtn.onclick = () => AppUI.loadChapter(nextBook.name, 1);
        } else {
          nextCard.style.visibility = 'hidden';
          nextBtn.disabled = true;
        }
      }
    },

    // -------------------------------------------------------------------------
    // BOOK & CHAPTER PICKER MODAL
    // -------------------------------------------------------------------------
    openBookPicker() {
      this.pickerSelectedBook = null;
      document.getElementById('picker-books-step').style.display = 'block';
      document.getElementById('picker-chapters-step').style.display = 'none';
      this.switchTestamentTab(this.pickerTestament);
      this.openModal('modal-book-picker');
    },

    switchTestamentTab(testament) {
      this.pickerTestament = testament;
      document.getElementById('tab-ot').classList.toggle('active', testament === 'OT');
      document.getElementById('tab-nt').classList.toggle('active', testament === 'NT');

      const grid = document.getElementById('picker-books-grid');
      if (!grid) return;
      grid.innerHTML = '';

      const filtered = window.BIBLE_BOOKS.filter(b => b.testament === testament);
      filtered.forEach(book => {
        const btn = document.createElement('button');
        btn.className = 'book-select-btn';
        btn.innerHTML = `
          <div>${book.name}</div>
          <small style="color: var(--text-muted); font-size: 0.72rem;">${book.chapters} chs • ${book.category}</small>
        `;
        btn.onclick = () => AppUI.selectPickerBook(book);
        grid.appendChild(btn);
      });
    },

    selectPickerBook(book) {
      this.pickerSelectedBook = book;
      document.getElementById('picker-books-step').style.display = 'none';
      document.getElementById('picker-chapters-step').style.display = 'block';
      document.getElementById('picker-selected-book-name').textContent = `${book.name} (${book.chapters} Chapters)`;

      const chGrid = document.getElementById('picker-chapters-grid');
      if (!chGrid) return;
      chGrid.innerHTML = '';

      for (let i = 1; i <= book.chapters; i++) {
        const chBtn = document.createElement('button');
        chBtn.className = 'chapter-select-btn';
        chBtn.textContent = i;
        chBtn.onclick = () => {
          AppUI.closeModal('modal-book-picker');
          AppUI.loadChapter(book.name, i);
          AppRouter.navigate('reader');
        };
        chGrid.appendChild(chBtn);
      }
    },

    // -------------------------------------------------------------------------
    // NOTE EDITOR MODAL
    // -------------------------------------------------------------------------
    openNoteEditor(verseNum, verseText, existingNote = null) {
      this.reader.editingNote = existingNote;
      this.reader.selectedVerse = verseNum;
      this.reader.selectedVerseText = verseText;

      const title = document.getElementById('note-modal-title');
      const preview = document.getElementById('note-verse-preview');
      const input = document.getElementById('note-text-input');

      if (title) title.textContent = `Note on ${this.reader.book} ${this.reader.chapter}:${verseNum}`;
      if (preview) preview.textContent = `"${verseText}"`;
      if (input) input.value = existingNote ? existingNote.note_text : '';

      this.openModal('modal-note-editor');
    },

    async saveNoteFromModal() {
      const input = document.getElementById('note-text-input');
      const text = input ? input.value.trim() : '';
      if (!text) {
        this.showToast('Please enter note text');
        return;
      }

      const noteRecord = {
        id: this.reader.editingNote ? this.reader.editingNote.id : null,
        book: this.reader.book,
        chapter: this.reader.chapter,
        verse: this.reader.selectedVerse,
        note_text: text
      };

      await window.AppDB.saveNote(noteRecord);
      this.closeModal('modal-note-editor');
      this.showToast(`Saved note for ${this.reader.book} ${this.reader.chapter}:${this.reader.selectedVerse}`);
      
      // Reload current chapter to show updated badge
      this.loadChapter(this.reader.book, this.reader.chapter);
    },

    // -------------------------------------------------------------------------
    // HOME & DAILY DEVOTIONAL
    // -------------------------------------------------------------------------
    refreshHome() {
      const today = window.DevotionalsData.getToday();
      if (!today) return;

      const verseText = document.getElementById('daily-verse-text');
      const verseRef = document.getElementById('daily-verse-ref');
      const title = document.getElementById('daily-reflection-title');
      const text = document.getElementById('daily-reflection-text');
      const prayer = document.getElementById('daily-reflection-prayer');

      if (verseText) verseText.textContent = `"${today.scripture}"`;
      if (verseRef) verseRef.textContent = `${today.reference} (NIV)`;
      if (title) title.textContent = today.title;
      if (text) text.textContent = today.reflection;
      if (prayer) prayer.textContent = `"${today.prayer}"`;

      // Read context button
      const readContextBtn = document.getElementById('btn-read-verse-context');
      if (readContextBtn) {
        readContextBtn.onclick = () => {
          AppUI.navigateToVerse(today.book, today.chapter, today.verseStart || 1);
        };
      }

      // Bookmark daily verse button
      const saveBtn = document.getElementById('btn-save-daily-verse');
      if (saveBtn) {
        saveBtn.onclick = async () => {
          await window.AppDB.addBookmark({
            book: today.book,
            chapter: today.chapter,
            verse_start: today.verseStart,
            verse_end: today.verseEnd,
            label: `${today.reference}`
          });
          AppUI.showToast(`Bookmarked ${today.reference}`);
        };
      }

      // Share button
      const shareBtn = document.getElementById('btn-share-daily-verse');
      if (shareBtn) {
        shareBtn.onclick = () => {
          const shareText = `"${today.scripture}" — ${today.reference} (NIV)\n${today.reflection}`;
          navigator.clipboard.writeText(shareText);
          AppUI.showToast('Copied daily verse and reflection to clipboard');
        };
      }

      // Streak
      const streakInfo = window.AppDB.getStreakInfo();
      const streakLbl = document.getElementById('streak-counter-label');
      if (streakLbl) streakLbl.textContent = `${streakInfo.streak} Day Streak 🔥`;

      // Resume reading button
      const lastPos = window.AppDB.getLastPosition();
      const resumeLbl = document.getElementById('resume-position-label');
      if (resumeLbl) resumeLbl.textContent = `${lastPos.book} ${lastPos.chapter}`;

      const resumeBtn = document.getElementById('btn-resume-reading');
      if (resumeBtn) {
        resumeBtn.onclick = () => {
          AppUI.navigateToVerse(lastPos.book, lastPos.chapter, lastPos.verse || 1);
        };
      }

      // Prayer count
      window.AppDB.getPrayers().then(prayers => {
        const active = prayers.filter(p => !p.is_answered);
        const countLbl = document.getElementById('home-prayers-count');
        if (countLbl) countLbl.textContent = `${active.length} Active Prayers`;
      });

      // Topics badges
      const topicsList = document.getElementById('topics-badges-list');
      if (topicsList) {
        const topics = ['Peace & Anxiety', 'Grace & Forgiveness', 'Knowing God', 'Temptation & Spiritual Armor', 'Steadfast Faith'];
        topicsList.innerHTML = '';
        topics.forEach(top => {
          const badge = document.createElement('button');
          badge.className = 'btn btn-secondary btn-sm';
          badge.textContent = top;
          badge.onclick = () => {
            const dev = window.DevotionalsData.getByTopic(top)[0] || today;
            if (verseText) verseText.textContent = `"${dev.scripture}"`;
            if (verseRef) verseRef.textContent = `${dev.reference} (NIV)`;
            if (title) title.textContent = dev.title;
            if (text) text.textContent = dev.reflection;
            if (prayer) prayer.textContent = `"${dev.prayer}"`;
            AppUI.showToast(`Showing topic: ${top}`);
          };
          topicsList.appendChild(badge);
        });
      }
    },

    // -------------------------------------------------------------------------
    // BIBLE STUDY & CONTEXT (NO AI)
    // -------------------------------------------------------------------------
    renderStudyTools() {
      // 1. Populate Book Selector Dropdown
      const dropdown = document.getElementById('study-book-dropdown');
      if (dropdown && dropdown.children.length === 0) {
        window.BIBLE_BOOKS.forEach(b => {
          const opt = document.createElement('option');
          opt.value = b.name;
          opt.textContent = `${b.name} (${b.testament === 'OT' ? 'Old Testament' : 'New Testament'})`;
          dropdown.appendChild(opt);
        });
        dropdown.value = this.selectedStudyBook;
        dropdown.onchange = () => {
          AppUI.selectedStudyBook = dropdown.value;
          AppUI.renderStudyTools();
        };
      }

      // 2. Book Background Info
      const intro = window.StudyResources.getBookIntro(this.selectedStudyBook) || {
        author: 'Biblical attribution',
        date: 'Ancient Near Eastern era',
        audience: 'Covenant people of God',
        genre: 'Scriptural text',
        purpose: 'Divine revelation and spiritual instruction.',
        themes: ['Faith', 'Covenant', 'Righteousness']
      };

      document.getElementById('study-book-name').textContent = this.selectedStudyBook;
      document.getElementById('study-book-author').textContent = intro.author;
      document.getElementById('study-book-date').textContent = intro.date;
      document.getElementById('study-book-audience').textContent = intro.audience;
      document.getElementById('study-book-genre').textContent = intro.genre;
      document.getElementById('study-book-purpose').textContent = intro.purpose;

      const themesContainer = document.getElementById('study-book-themes');
      if (themesContainer) {
        themesContainer.innerHTML = '';
        (intro.themes || []).forEach(theme => {
          const pill = document.createElement('span');
          pill.className = 'category-pill';
          pill.textContent = theme;
          themesContainer.appendChild(pill);
        });
      }

      // 3. Original Language Lexicon
      const lexiconContainer = document.getElementById('lexicon-terms-container');
      if (lexiconContainer && lexiconContainer.children.length === 0) {
        const terms = window.StudyResources.getAllLexiconTerms();
        terms.forEach(term => {
          const card = document.createElement('div');
          card.className = 'lexicon-card';
          card.innerHTML = `
            <div class="lexicon-header">
              <span class="lexicon-term">${term.term} (${term.language})</span>
              <span class="lexicon-original">${term.original}</span>
            </div>
            <div class="lexicon-meta">Strong's ${term.strongs} • ${term.partOfSpeech} • <em>${term.pronunciation}</em></div>
            <div class="lexicon-body">
              <strong>${term.primaryMeaning}</strong>
              <p style="margin-top: 6px; font-size: 0.85rem; color: var(--text-secondary);">${term.theologicalSignificance}</p>
            </div>
          `;
          lexiconContainer.appendChild(card);
        });
      }

      // 4. Treasury of Scripture Knowledge Cross-References
      const crossRefContainer = document.getElementById('cross-references-container');
      if (crossRefContainer && crossRefContainer.children.length === 0) {
        const crossRefs = window.StudyResources.getAllCrossReferences();
        crossRefs.forEach(cr => {
          const item = document.createElement('div');
          item.className = 'search-result-item';
          let connsHtml = cr.connections.map(c => `
            <div style="margin-top: 6px; padding-left: 12px; border-left: 2px solid var(--border-medium);">
              <strong style="color: var(--text-primary); font-size: 0.88rem;">${c.target}</strong>
              <div style="font-size: 0.82rem; color: var(--text-secondary);">${c.note}</div>
            </div>
          `).join('');

          item.innerHTML = `
            <div class="search-result-ref">${cr.sourcePassage}</div>
            <div class="search-result-text">"${cr.sourceText}"</div>
            <div style="margin-top: 8px;">${connsHtml}</div>
          `;
          crossRefContainer.appendChild(item);
        });
      }

      // 5. Historical Commentaries
      const commentaryContainer = document.getElementById('commentary-notes-container');
      if (commentaryContainer && commentaryContainer.children.length === 0) {
        const commentaries = window.StudyResources.getAllCommentaries();
        Object.entries(commentaries).forEach(([key, val]) => {
          const card = document.createElement('div');
          card.className = 'search-result-item';
          card.style.marginBottom = '12px';
          const insightsHtml = val.insights.map(i => `
            <div style="margin-top: 8px;">
              <strong style="color: var(--text-primary); font-size: 0.9rem;">${i.verseRef}:</strong>
              <p style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 2px;">${i.commentary}</p>
            </div>
          `).join('');

          card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
              <span class="search-result-ref">${key}</span>
              <span style="font-size: 0.72rem; color: var(--text-muted);">${val.source}</span>
            </div>
            <p style="font-size: 0.92rem; font-weight: 600; margin-bottom: 8px;">${val.summary}</p>
            ${insightsHtml}
          `;
          commentaryContainer.appendChild(card);
        });
      }

      // 6. Perspectives on Christian Interpretation
      const topicsContainer = document.getElementById('theological-topics-container');
      if (topicsContainer && topicsContainer.children.length === 0) {
        const topics = window.StudyResources.getTheologicalTopics();
        topics.forEach(t => {
          const item = document.createElement('div');
          item.className = 'search-result-item';
          item.style.marginBottom = '16px';
          const viewsHtml = t.views.map(v => `
            <div style="margin-top: 8px; background-color: var(--bg-secondary); padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
              <div style="font-weight: 700; color: var(--text-primary); font-size: 0.9rem;">${v.name}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 4px;">Historical Proponents: ${v.keyProponents}</div>
              <div style="font-size: 0.85rem; color: var(--text-secondary);">${v.emphasis}</div>
            </div>
          `).join('');

          item.innerHTML = `
            <div class="search-result-ref">${t.title}</div>
            <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 8px;">${t.summary}</p>
            ${viewsHtml}
            <div style="margin-top: 10px; font-size: 0.85rem; font-style: italic; color: var(--text-muted);">
              <strong>Common Ground:</strong> ${t.commonGround}
            </div>
          `;
          topicsContainer.appendChild(item);
        });
      }
    },

    // -------------------------------------------------------------------------
    // READING PLANS
    // -------------------------------------------------------------------------
    async renderPlans() {
      const container = document.getElementById('plans-grid-container');
      if (!container) return;

      const plans = window.ReadingPlansData.getAll();
      const allProgress = await window.AppDB.getReadingProgress();

      container.innerHTML = '';
      plans.forEach(plan => {
        const planProgress = allProgress.filter(p => p.plan_id === plan.id && p.completed);
        const completedDays = planProgress.length;
        const percent = Math.round((completedDays / plan.durationDays) * 100);

        const card = document.createElement('div');
        card.className = 'plan-card';
        card.innerHTML = `
          <div class="plan-category">${plan.category} • ${plan.durationDays} Days</div>
          <h3 class="plan-title">${plan.title}</h3>
          <p class="plan-desc">${plan.description}</p>
          <div class="plan-progress-container">
            <div class="plan-progress-bar">
              <div class="plan-progress-fill" style="width: ${percent}%;"></div>
            </div>
            <div class="plan-progress-label">
              <span>${completedDays} of ${plan.durationDays} Days Completed</span>
              <span>${percent}%</span>
            </div>
          </div>
          <button class="btn btn-primary btn-sm" onclick="AppUI.openPlanDetail('${plan.id}')" style="margin-top: auto;">
            <i data-lucide="list-checks"></i> ${completedDays > 0 ? 'Continue Plan' : 'Start Reading Plan'}
          </button>
        `;
        container.appendChild(card);
      });
      if (window.lucide) window.lucide.createIcons();
    },

    async openPlanDetail(planId) {
      const plan = window.ReadingPlansData.getById(planId);
      if (!plan) return;

      const title = document.getElementById('plan-detail-title');
      const meta = document.getElementById('plan-detail-meta');
      const container = document.getElementById('plan-days-checklist');

      if (title) title.textContent = plan.title;
      if (meta) meta.textContent = `${plan.category} • ${plan.durationDays} Days`;

      const progress = await window.AppDB.getReadingProgress(planId);
      const completedSet = new Set(progress.filter(p => p.completed).map(p => p.day_number));

      if (container) {
        container.innerHTML = '';
        plan.days.forEach(d => {
          const isDone = completedSet.has(d.day);
          const dayRow = document.createElement('div');
          dayRow.className = 'search-result-item';
          dayRow.style.display = 'flex';
          dayRow.style.alignItems = 'flex-start';
          dayRow.style.gap = '14px';
          dayRow.style.marginBottom = '10px';

          dayRow.innerHTML = `
            <input type="checkbox" style="margin-top: 4px; width: 18px; height: 18px; accent-color: var(--text-primary); cursor: pointer;" ${isDone ? 'checked' : ''} id="chk-day-${d.day}">
            <div style="flex: 1;">
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <strong style="color: var(--text-primary); font-size: 0.95rem;">Day ${d.day}: ${d.title}</strong>
                <button class="btn btn-outline btn-sm" style="padding: 2px 10px; font-size: 0.78rem;" id="btn-read-day-${d.day}">
                  Read ${d.book} ${d.chapter}
                </button>
              </div>
              <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">${d.focus}</p>
            </div>
          `;

          const chk = dayRow.querySelector(`#chk-day-${d.day}`);
          chk.onchange = async () => {
            await window.AppDB.setPlanDayCompleted(plan.id, d.day, chk.checked);
            AppUI.showToast(chk.checked ? `Day ${d.day} marked completed!` : `Day ${d.day} unmarked.`);
            AppUI.renderPlans();
          };

          const readBtn = dayRow.querySelector(`#btn-read-day-${d.day}`);
          readBtn.onclick = () => {
            AppUI.closeModal('plan-detail-modal');
            AppUI.navigateToVerse(d.book, d.chapter, 1);
          };

          container.appendChild(dayRow);
        });
      }

      this.openModal('plan-detail-modal');
    },

    // -------------------------------------------------------------------------
    // PRAYER JOURNAL
    // -------------------------------------------------------------------------
    async renderPrayers(filter = 'all') {
      const container = document.getElementById('prayers-grid-container');
      if (!container) return;

      const prayers = await window.AppDB.getPrayers();
      const allCount = prayers.length;
      const activeCount = prayers.filter(p => !p.is_answered).length;
      const answeredCount = prayers.filter(p => p.is_answered).length;

      document.getElementById('count-all-prayers').textContent = allCount;
      document.getElementById('count-active-prayers').textContent = activeCount;
      document.getElementById('count-answered-prayers').textContent = answeredCount;

      let filtered = prayers;
      if (filter === 'active') filtered = prayers.filter(p => !p.is_answered);
      if (filter === 'answered') filtered = prayers.filter(p => p.is_answered);

      container.innerHTML = '';
      if (filtered.length === 0) {
        container.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-state-icon"><i data-lucide="feather"></i></div>
            <div class="empty-state-title">No prayers found</div>
            <div class="empty-state-desc">Record your first prayer request to track God's faithfulness in your journey.</div>
            <button class="btn btn-primary btn-sm" onclick="AppUI.openNewPrayerModal()">Add Prayer Request</button>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = `prayer-card ${p.is_answered ? 'answered' : ''}`;
        const dateStr = new Date(p.created_at).toLocaleDateString();

        card.innerHTML = `
          <div class="prayer-header">
            <span class="category-pill">${p.category}</span>
            ${p.is_answered ? '<span class="answered-badge">Answered Praise</span>' : ''}
          </div>
          <h4 class="prayer-title">${p.title}</h4>
          <p class="prayer-text">${p.request}</p>
          ${p.is_answered && p.answer_notes ? `
            <div class="answered-notes-box">
              <strong>God's Faithfulness:</strong> ${p.answer_notes}
            </div>
          ` : ''}
          <div class="prayer-footer">
            <span>Created ${dateStr}</span>
            <div style="display: flex; gap: 8px;">
              <button class="btn-icon" style="width: 30px; height: 30px;" title="${p.is_answered ? 'Unmark Answered' : 'Mark as Answered'}" id="btn-toggle-answer-${p.id}">
                <i data-lucide="${p.is_answered ? 'check-circle-2' : 'check'}"></i>
              </button>
              <button class="btn-icon" style="width: 30px; height: 30px;" title="Delete Prayer" id="btn-delete-prayer-${p.id}">
                <i data-lucide="trash-2"></i>
              </button>
            </div>
          </div>
        `;

        card.querySelector(`#btn-toggle-answer-${p.id}`).onclick = () => {
          if (p.is_answered) {
            window.AppDB.togglePrayerAnswered(p.id, '').then(() => {
              AppUI.showToast('Unmarked prayer as answered');
              AppUI.renderPrayers(filter);
            });
          } else {
            AppUI.openAnswerPrayerModal(p.id);
          }
        };

        card.querySelector(`#btn-delete-prayer-${p.id}`).onclick = () => {
          if (confirm(`Delete prayer: "${p.title}"?`)) {
            window.AppDB.deletePrayer(p.id).then(() => {
              AppUI.showToast('Prayer deleted');
              AppUI.renderPrayers(filter);
            });
          }
        };

        container.appendChild(card);
      });

      if (window.lucide) window.lucide.createIcons();
    },

    openNewPrayerModal() {
      document.getElementById('prayer-title-input').value = '';
      document.getElementById('prayer-request-input').value = '';
      document.getElementById('prayer-category-input').value = 'Petition';
      this.openModal('modal-prayer-editor');
    },

    async savePrayerFromModal() {
      const title = document.getElementById('prayer-title-input').value.trim();
      const request = document.getElementById('prayer-request-input').value.trim();
      const category = document.getElementById('prayer-category-input').value;

      if (!title || !request) {
        this.showToast('Please provide a title and details.');
        return;
      }

      await window.AppDB.savePrayer({ title, request, category });
      this.closeModal('modal-prayer-editor');
      this.showToast('Prayer request saved!');
      this.renderPrayers();
    },

    openAnswerPrayerModal(prayerId) {
      this.activePrayerForAnswer = prayerId;
      document.getElementById('prayer-answer-input').value = '';
      this.openModal('modal-answer-prayer');
    },

    async confirmAnsweredPrayer() {
      const notes = document.getElementById('prayer-answer-input').value.trim();
      if (this.activePrayerForAnswer) {
        await window.AppDB.togglePrayerAnswered(this.activePrayerForAnswer, notes);
        this.closeModal('modal-answer-prayer');
        this.showToast('Praise God! Prayer celebrated as answered.');
        this.renderPrayers();
      }
    },

    // -------------------------------------------------------------------------
    // BOOKMARKS & SAVED NOTES
    // -------------------------------------------------------------------------
    async renderSavedItems(type = 'bookmarks') {
      const container = document.getElementById('saved-items-container');
      if (!container) return;

      const [bookmarks, notes, highlights] = await Promise.all([
        window.AppDB.getBookmarks(),
        window.AppDB.getNotes(),
        window.AppDB.getHighlights()
      ]);

      document.getElementById('count-bookmarks').textContent = bookmarks.length;
      document.getElementById('count-notes').textContent = notes.length;
      document.getElementById('count-highlights').textContent = highlights.length;

      document.getElementById('tab-btn-bookmarks').classList.toggle('active', type === 'bookmarks');
      document.getElementById('tab-btn-notes').classList.toggle('active', type === 'notes');
      document.getElementById('tab-btn-highlights').classList.toggle('active', type === 'highlights');

      container.innerHTML = '';

      if (type === 'bookmarks') {
        if (bookmarks.length === 0) {
          container.innerHTML = `<div class="empty-state"><div class="empty-state-title">No bookmarks saved</div><div class="empty-state-desc">Click any verse while reading to bookmark it.</div></div>`;
          return;
        }
        bookmarks.forEach(bm => {
          const item = document.createElement('div');
          item.className = 'search-result-item';
          item.style.display = 'flex';
          item.style.justifyContent = 'space-between';
          item.style.alignItems = 'center';
          item.style.cursor = 'pointer';
          item.innerHTML = `
            <div>
              <div class="search-result-ref">${bm.label || `${bm.book} ${bm.chapter}:${bm.verse_start}`}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Saved ${new Date(bm.created_at).toLocaleDateString()}</div>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-outline btn-sm" id="btn-jump-bm-${bm.id}">Read Verse</button>
              <button class="btn-icon" style="width: 32px; height: 32px;" id="btn-del-bm-${bm.id}"><i data-lucide="trash-2"></i></button>
            </div>
          `;
          const handleJump = (e) => {
            if (e) e.stopPropagation();
            AppUI.navigateToVerse(bm.book, bm.chapter, bm.verse_start || 1);
          };
          item.querySelector(`#btn-jump-bm-${bm.id}`).onclick = handleJump;
          item.onclick = handleJump;
          item.querySelector(`#btn-del-bm-${bm.id}`).onclick = async (e) => {
            e.stopPropagation();
            await window.AppDB.deleteBookmark(bm.id);
            AppUI.renderSavedItems('bookmarks');
          };
          container.appendChild(item);
        });
      } else if (type === 'notes') {
        if (notes.length === 0) {
          container.innerHTML = `<div class="empty-state"><div class="empty-state-title">No notes written</div><div class="empty-state-desc">Select any verse in the reader to write personal reflections.</div></div>`;
          return;
        }
        notes.forEach(n => {
          const item = document.createElement('div');
          item.className = 'search-result-item';
          item.style.cursor = 'pointer';
          item.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <div class="search-result-ref">${n.book} ${n.chapter}:${n.verse || ''}</div>
              <button class="btn-icon" style="width: 28px; height: 28px;" id="btn-del-note-${n.id}"><i data-lucide="trash-2"></i></button>
            </div>
            <p style="font-size: 0.95rem; margin: 8px 0;">${n.note_text}</p>
            <button class="btn btn-secondary btn-sm" id="btn-jump-note-${n.id}">Open in Reader</button>
          `;
          const handleJump = (e) => {
            if (e) e.stopPropagation();
            AppUI.navigateToVerse(n.book, n.chapter, n.verse || 1);
          };
          item.querySelector(`#btn-jump-note-${n.id}`).onclick = handleJump;
          item.onclick = handleJump;
          item.querySelector(`#btn-del-note-${n.id}`).onclick = async (e) => {
            e.stopPropagation();
            await window.AppDB.deleteNote(n.id);
            AppUI.renderSavedItems('notes');
          };
          container.appendChild(item);
        });
      } else if (type === 'highlights') {
        if (highlights.length === 0) {
          container.innerHTML = `<div class="empty-state"><div class="empty-state-title">No highlighted verses</div><div class="empty-state-desc">Choose from 5 monochrome highlight styles while reading to mark verses.</div></div>`;
          return;
        }
        highlights.forEach(h => {
          const item = document.createElement('div');
          item.className = 'search-result-item';
          item.style.display = 'flex';
          item.style.justifyContent = 'space-between';
          item.style.alignItems = 'center';
          item.style.cursor = 'pointer';
          item.innerHTML = `
            <div>
              <span class="category-pill" style="margin-right: 8px;">${h.color || 'Highlight'}</span>
              <strong style="font-size: 1rem; color: var(--text-primary);">${h.book} ${h.chapter}:${h.verse}</strong>
            </div>
            <div style="display: flex; gap: 8px; align-items: center;">
              <button class="btn btn-outline btn-sm" id="btn-jump-hl-${h.id}">Read Verse</button>
              <button class="btn-icon" style="width: 32px; height: 32px;" id="btn-del-hl-${h.id}" title="Remove Highlight"><i data-lucide="trash-2"></i></button>
            </div>
          `;
          const handleJump = (e) => {
            if (e) e.stopPropagation();
            AppUI.navigateToVerse(h.book, h.chapter, h.verse);
          };
          item.querySelector(`#btn-jump-hl-${h.id}`).onclick = handleJump;
          item.onclick = handleJump;
          const delBtn = item.querySelector(`#btn-del-hl-${h.id}`);
          if (delBtn) {
            delBtn.onclick = async (e) => {
              e.stopPropagation();
              await window.AppDB.removeHighlight(h.book, h.chapter, h.verse);
              AppUI.renderSavedItems('highlights');
              AppUI.showToast(`Removed highlight on ${h.book} ${h.chapter}:${h.verse}`);
            };
          }
          container.appendChild(item);
        });
      }

      if (window.lucide) window.lucide.createIcons();
    },

    // -------------------------------------------------------------------------
    // SEARCH SCRIPTURE
    // -------------------------------------------------------------------------
    openSearchModal() {
      const input = document.getElementById('search-input');
      const results = document.getElementById('search-results-container');
      if (input) input.value = '';
      if (results) results.innerHTML = '';
      this.openModal('modal-search');
      setTimeout(() => input && input.focus(), 150);
    },

    async performSearch(query) {
      const container = document.getElementById('search-results-container');
      if (!container) return;

      if (!query || query.trim().length === 0) {
        container.innerHTML = '';
        return;
      }

      container.innerHTML = `<div class="empty-state"><div class="empty-state-icon"><i data-lucide="loader-2" class="spin"></i></div><div>Searching Scripture...</div></div>`;
      if (window.lucide) window.lucide.createIcons();

      try {
        const response = await window.BibleProvider.searchScripture(query);
        container.innerHTML = '';

        if (!response.results || response.results.length === 0) {
          container.innerHTML = `
            <div class="empty-state">
              <div class="empty-state-title">No verses found</div>
              <div class="empty-state-desc">Try searching for a reference like "John 3:16" or a term like "shepherd" or "peace".</div>
            </div>
          `;
          return;
        }

        response.results.forEach(res => {
          const item = document.createElement('div');
          item.className = 'search-result-item';
          item.innerHTML = `
            <div class="search-result-ref">${res.reference}</div>
            <div class="search-result-text">"${res.text}"</div>
          `;
          item.onclick = () => {
            AppUI.navigateToVerse(res.book, res.chapter, res.verse);
          };
          container.appendChild(item);
        });

      } catch (e) {
        container.innerHTML = `<div class="empty-state"><div class="empty-state-desc">Search error: ${e.message}</div></div>`;
      }
    },

    // -------------------------------------------------------------------------
    // SETTINGS & ACCOUNT
    // -------------------------------------------------------------------------
    renderSettings() {
      const statusContainer = document.getElementById('account-status-details');
      const user = window.AuthService.getUser();

      if (statusContainer) {
        if (user) {
          statusContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong>Signed In:</strong> ${user.email}
                <div style="font-size: 0.8rem; color: var(--text-primary); font-weight: 600;">Cloud Synchronization Active</div>
              </div>
              <button class="btn btn-secondary btn-sm" id="btn-settings-signout">Sign Out</button>
            </div>
          `;
          document.getElementById('btn-settings-signout').onclick = () => window.AuthService.signOut();
        } else {
          statusContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong>Guest Mode Active</strong>
                <div style="font-size: 0.8rem; color: var(--text-muted);">Data saved locally on this browser. Create an account to sync across devices.</div>
              </div>
              <button class="btn btn-primary btn-sm" onclick="AppUI.openAuthModal('signup')">Sign Up / Sign In</button>
            </div>
          `;
        }
      }

      // Populate config inputs
      const providerSel = document.getElementById('setting-scripture-provider');
      if (providerSel) providerSel.value = window.AppConfig?.scriptureProvider || 'github';

      const supUrl = document.getElementById('setting-supabase-url');
      if (supUrl) supUrl.value = window.AppConfig?.supabaseUrl || '';

      const supKey = document.getElementById('setting-supabase-key');
      if (supKey) supKey.value = window.AppConfig?.supabaseAnonKey || '';
    },

    // -------------------------------------------------------------------------
    // AUTH MODAL & LOGIC
    // -------------------------------------------------------------------------
    openAuthModal(mode = 'signin') {
      this.authMode = mode;
      const title = document.getElementById('auth-modal-title');
      const submitBtn = document.getElementById('btn-submit-auth');
      const question = document.getElementById('auth-toggle-question');
      const toggleBtn = document.getElementById('btn-toggle-auth-mode');
      const nameGroup = document.getElementById('group-display-name');
      const errorDiv = document.getElementById('auth-error-msg');

      if (errorDiv) errorDiv.style.display = 'none';

      if (mode === 'signup') {
        if (title) title.textContent = 'Create Account';
        if (submitBtn) submitBtn.textContent = 'Sign Up';
        if (question) question.textContent = 'Already have an account?';
        if (toggleBtn) toggleBtn.textContent = 'Sign In';
        if (nameGroup) nameGroup.style.display = 'block';
      } else {
        if (title) title.textContent = 'Sign In';
        if (submitBtn) submitBtn.textContent = 'Sign In';
        if (question) question.textContent = "Don't have an account?";
        if (toggleBtn) toggleBtn.textContent = 'Create One';
        if (nameGroup) nameGroup.style.display = 'none';
      }

      this.openModal('modal-auth');
    },

    initAuthListeners() {
      window.AuthService.onAuthStateChange((user) => {
        const label = document.getElementById('auth-status-label');
        if (label) {
          label.textContent = user ? (user.user_metadata?.full_name || user.email.split('@')[0]) : 'Guest';
        }
        AppUI.renderSettings();
      });
    },

    async handleAuthSubmit() {
      const email = document.getElementById('auth-email-input').value.trim();
      const password = document.getElementById('auth-password-input').value;
      const name = document.getElementById('auth-name-input').value.trim();
      const errorDiv = document.getElementById('auth-error-msg');

      if (errorDiv) errorDiv.style.display = 'none';

      try {
        if (this.authMode === 'signup') {
          await window.AuthService.signUp(email, password, name);
          this.showToast('Account created successfully!');
        } else {
          await window.AuthService.signIn(email, password);
          this.showToast('Signed in successfully!');
        }
        this.closeModal('modal-auth');
      } catch (err) {
        if (errorDiv) {
          errorDiv.textContent = err.message;
          errorDiv.style.display = 'block';
        }
      }
    },

    // -------------------------------------------------------------------------
    // GENERAL MODAL & TOAST HELPERS
    // -------------------------------------------------------------------------
    openModal(id) {
      const el = document.getElementById(id);
      if (el) {
        el.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    },

    closeModal(id) {
      const el = document.getElementById(id);
      if (el) {
        el.classList.remove('active');
        document.body.style.overflow = '';
      }
    },

    showToast(message, type = 'info') {
      const container = document.getElementById('toast-container');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = `toast ${type === 'error' ? 'toast-error' : ''}`;
      const icon = type === 'error' ? 'alert-circle' : 'check';
      toast.innerHTML = `<i data-lucide="${icon}" style="width: 16px; height: 16px; flex-shrink: 0;"></i><span>${message}</span>`;
      container.appendChild(toast);
      if (window.lucide) window.lucide.createIcons();

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(12px)';
        setTimeout(() => toast.remove(), 250);
      }, 3500);
    },

    // -------------------------------------------------------------------------
    // EVENT LISTENERS INITIALIZATION
    // -------------------------------------------------------------------------
    initEventListeners() {
      // Theme toggle
      document.getElementById('theme-toggle-btn')?.addEventListener('click', () => this.toggleTheme());

      // Search modal
      document.getElementById('search-modal-btn')?.addEventListener('click', () => this.openSearchModal());
      let searchTimeout;
      document.getElementById('search-input')?.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => this.performSearch(e.target.value), 350);
      });

      // Book picker modal trigger
      document.getElementById('btn-open-picker')?.addEventListener('click', () => this.openBookPicker());
      document.getElementById('btn-back-to-books')?.addEventListener('click', () => {
        document.getElementById('picker-books-step').style.display = 'block';
        document.getElementById('picker-chapters-step').style.display = 'none';
      });

      // Font size toggles
      document.querySelectorAll('.font-size-btn').forEach(btn => {
        btn.addEventListener('click', () => this.setFontSize(btn.getAttribute('data-size')));
      });

      // Layout toggle
      document.getElementById('btn-toggle-layout')?.addEventListener('click', () => this.toggleLayout());

      // Section Headings toggle
      document.getElementById('btn-toggle-headings')?.addEventListener('click', () => this.toggleSectionHeadings());

      // Floating action bar buttons
      document.querySelectorAll('.color-dot').forEach(dot => {
        dot.addEventListener('click', () => this.applyHighlight(dot.getAttribute('data-color')));
      });
      document.getElementById('action-btn-custom-title')?.addEventListener('click', () => this.openCustomTitleModal());
      document.getElementById('action-btn-bookmark')?.addEventListener('click', () => this.bookmarkSelectedVerse());
      document.getElementById('action-btn-copy')?.addEventListener('click', () => this.copySelectedVerse());
      document.getElementById('action-btn-study')?.addEventListener('click', () => this.studySelectedVerse());
      document.getElementById('action-btn-close')?.addEventListener('click', () => this.hideVerseActionBar());
      document.getElementById('action-btn-note')?.addEventListener('click', () => {
        this.openNoteEditor(this.reader.selectedVerse, this.reader.selectedVerseText);
      });

      // Save custom title from modal
      document.getElementById('btn-save-custom-title')?.addEventListener('click', () => this.saveCustomTitleFromModal());

      // Note modal save
      document.getElementById('btn-save-note')?.addEventListener('click', () => this.saveNoteFromModal());

      // Reader Study quick link
      document.getElementById('btn-reader-open-study')?.addEventListener('click', () => {
        this.selectedStudyBook = this.reader.book;
        AppRouter.navigate('study');
      });

      // Prayer tabs
      document.querySelectorAll('.prayer-tab-btn[data-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.prayer-tab-btn[data-filter]').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.renderPrayers(btn.getAttribute('data-filter'));
        });
      });

      // Saved items tabs
      document.getElementById('tab-btn-bookmarks')?.addEventListener('click', () => this.renderSavedItems('bookmarks'));
      document.getElementById('tab-btn-notes')?.addEventListener('click', () => this.renderSavedItems('notes'));
      document.getElementById('tab-btn-highlights')?.addEventListener('click', () => this.renderSavedItems('highlights'));

      // Prayer modal triggers
      document.getElementById('btn-open-add-prayer')?.addEventListener('click', () => this.openNewPrayerModal());
      document.getElementById('btn-save-prayer-entry')?.addEventListener('click', () => this.savePrayerFromModal());
      document.getElementById('btn-confirm-answered-prayer')?.addEventListener('click', () => this.confirmAnsweredPrayer());

      // Auth modal triggers
      document.getElementById('auth-status-btn')?.addEventListener('click', () => {
        if (window.AuthService.isLoggedIn()) {
          AppRouter.navigate('settings');
        } else {
          this.openAuthModal('signin');
        }
      });
      document.getElementById('btn-toggle-auth-mode')?.addEventListener('click', () => {
        this.openAuthModal(this.authMode === 'signin' ? 'signup' : 'signin');
      });
      document.getElementById('btn-submit-auth')?.addEventListener('click', () => this.handleAuthSubmit());

      // Settings saves
      document.getElementById('btn-save-provider-settings')?.addEventListener('click', () => {
        const val = document.getElementById('setting-scripture-provider').value;
        localStorage.setItem('bv_scripture_provider', val);
        window.BibleProvider.setProvider(val);
        this.showToast('Scripture provider updated');
      });

      document.getElementById('btn-save-supabase-config')?.addEventListener('click', () => {
        const url = document.getElementById('setting-supabase-url').value.trim();
        const key = document.getElementById('setting-supabase-key').value.trim();
        localStorage.setItem('bv_supabase_url', url);
        localStorage.setItem('bv_supabase_anon_key', key);
        window.AppConfig.supabaseUrl = url;
        window.AppConfig.supabaseAnonKey = key;
        window.AppDB.initSupabaseClient();
        this.showToast('Supabase settings saved and initialized');
      });

      document.getElementById('btn-clear-supabase-config')?.addEventListener('click', () => {
        localStorage.removeItem('bv_supabase_url');
        localStorage.removeItem('bv_supabase_anon_key');
        window.AppConfig.supabaseUrl = '';
        window.AppConfig.supabaseAnonKey = '';
        window.AppDB.initSupabaseClient();
        document.getElementById('setting-supabase-url').value = '';
        document.getElementById('setting-supabase-key').value = '';
        this.showToast('Cleared Supabase credentials. Returned to Guest Mode.');
      });

      document.getElementById('btn-save-reading-prefs')?.addEventListener('click', () => {
        const fs = document.getElementById('setting-default-font-size').value;
        const ly = document.getElementById('setting-default-layout').value;
        this.setFontSize(fs);
        if (this.reader.layout !== ly) this.toggleLayout();
        this.showToast('Reading preferences updated');
      });

      // Close modal on backdrop click
      document.querySelectorAll('.modal-backdrop').forEach(modal => {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            this.closeModal(modal.id);
          }
        });
      });
    }
  };

  // Attach globals and bootstrap
  window.AppRouter = AppRouter;
  window.AppUI = AppUI;

  document.addEventListener('DOMContentLoaded', () => {
    AppRouter.init();
    AppUI.init();
  });

})(window);
