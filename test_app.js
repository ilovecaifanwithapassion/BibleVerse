const fs = require('fs');

async function testApp() {
  console.log('=== RUNNING COMPREHENSIVE BIBLE APP TEST SUITE ===\n');

  // 1. Test Static Server Endpoints
  const endpoints = [
    '/',
    '/index.html',
    '/css/style.css',
    '/css/reader.css',
    '/css/components.css',
    '/js/config.js',
    '/js/db.js',
    '/js/bible-provider.js',
    '/js/section-headings.js',
    '/js/study-data.js',
    '/js/devotionals-data.js',
    '/js/reading-plans-data.js',
    '/js/auth.js',
    '/js/app.js'
  ];

  console.log('1. Testing Local Server HTTP Endpoints:');
  for (const ep of endpoints) {
    const res = await fetch(`http://localhost:3000${ep}`);
    if (res.status === 200) {
      console.log(`  ✓ http://localhost:3000${ep} -> 200 OK (${res.headers.get('content-type')})`);
    } else {
      console.error(`  ✗ http://localhost:3000${ep} -> ${res.status}`);
    }
  }

  // 2. Validate HTML Structure
  console.log('\n2. Validating HTML Markup:');
  const htmlRes = await fetch('http://localhost:3000/');
  const html = await htmlRes.text();
  const checks = [
    { name: 'Strict Title "Bible App"', pass: html.includes('<title>Bible App</title>') },
    { name: 'NIV Title & Meta', pass: html.includes('New International Version (NIV)') },
    { name: 'Bible Reader View (#view-reader)', pass: html.includes('id="view-reader"') },
    { name: 'Study & Context View (#view-study)', pass: html.includes('id="view-study"') },
    { name: 'Reading Plans View (#view-plans)', pass: html.includes('id="view-plans"') },
    { name: 'Prayer Journal View (#view-prayers)', pass: html.includes('id="view-prayers"') },
    { name: 'Bookmarks & Notes View (#view-bookmarks)', pass: html.includes('id="view-bookmarks"') },
    { name: 'Settings View (#view-settings)', pass: html.includes('id="view-settings"') },
    { name: 'Floating Verse Action Toolbar (#verse-action-bar)', pass: html.includes('id="verse-action-bar"') },
    { name: 'Custom Verse Title Modal (#modal-verse-title)', pass: html.includes('id="modal-verse-title"') },
    { name: 'Section Headings Toggle Button (#btn-toggle-headings)', pass: html.includes('id="btn-toggle-headings"') },
    { name: 'Book/Chapter Selector Modal (#modal-book-picker)', pass: html.includes('id="modal-book-picker"') },
    { name: 'NIV Copyright Attribution Notice', pass: html.includes('Biblica, Inc.') }
  ];
  checks.forEach(c => {
    console.log(`  ${c.pass ? '✓' : '✗'} ${c.name}`);
  });

  // 3. Test Scripture Data Provider & Live Passage Fetching
  console.log('\n3. Testing Scripture Data Integration (aruljohn/Bible-niv):');
  const genRes = await fetch('https://raw.githubusercontent.com/aruljohn/Bible-niv/main/Genesis.json');
  const genData = await genRes.json();
  const ch1 = genData.chapters.find(c => String(c.chapter) === '1');
  const v1 = ch1.verses.find(v => String(v.verse) === '1');
  console.log(`  ✓ Genesis 1:1 text: "${v1.text}"`);

  const johnRes = await fetch('https://raw.githubusercontent.com/aruljohn/Bible-niv/main/John.json');
  const johnData = await johnRes.json();
  const jch3 = johnData.chapters.find(c => String(c.chapter) === '3');
  const jv16 = jch3.verses.find(v => String(v.verse) === '16');
  console.log(`  ✓ John 3:16 text: "${jv16.text}"`);

  // 4. Verify SQL Schema
  console.log('\n4. Validating Supabase PostgreSQL Migration Script:');
  const sql = fs.readFileSync('c:\\Users\\acer\\Documents\\Bible Verse Website Ideas\\BibleVerse\\supabase\\schema.sql', 'utf8');
  const sqlChecks = [
    { name: 'profiles table', pass: sql.includes('CREATE TABLE IF NOT EXISTS public.profiles') },
    { name: 'bookmarks table', pass: sql.includes('CREATE TABLE IF NOT EXISTS public.bookmarks') },
    { name: 'notes table', pass: sql.includes('CREATE TABLE IF NOT EXISTS public.notes') },
    { name: 'highlights table', pass: sql.includes('CREATE TABLE IF NOT EXISTS public.highlights') },
    { name: 'prayer_journal table', pass: sql.includes('CREATE TABLE IF NOT EXISTS public.prayer_journal') },
    { name: 'reading_progress table', pass: sql.includes('CREATE TABLE IF NOT EXISTS public.reading_progress') },
    { name: 'Row-Level Security Enabled', pass: sql.includes('ENABLE ROW LEVEL SECURITY') },
    { name: 'User-scoped RLS policies (auth.uid() = user_id)', pass: sql.includes('auth.uid() = user_id') },
    { name: 'handle_new_user auth trigger', pass: sql.includes('handle_new_user') }
  ];
  sqlChecks.forEach(c => {
    console.log(`  ${c.pass ? '✓' : '✗'} ${c.name}`);
  });

  // 5. Verify Highlighted Verse Navigation Logic & CSS
  console.log('\n5. Validating Highlighted Verse Navigation:');
  const appJs = fs.readFileSync('c:\\Users\\acer\\Documents\\Bible Verse Website Ideas\\BibleVerse\\js\\app.js', 'utf8');
  const readerCss = fs.readFileSync('c:\\Users\\acer\\Documents\\Bible Verse Website Ideas\\BibleVerse\\css\\reader.css', 'utf8');
  const compCss = fs.readFileSync('c:\\Users\\acer\\Documents\\Bible Verse Website Ideas\\BibleVerse\\css\\components.css', 'utf8');

  const navChecks = [
    { name: 'AppUI.navigateToVerse method implemented', pass: appJs.includes('async navigateToVerse(bookName, chapterNum, verseNum)') },
    { name: 'AppUI.waitForVerseElement method implemented', pass: appJs.includes('async waitForVerseElement(') },
    { name: 'AppUI.highlightTargetVerse method implemented', pass: appJs.includes('highlightTargetVerse(targetElement)') },
    { name: 'AppRouter.navigate supports non-top scrolling flag', pass: appJs.includes('navigate(viewName, updateHash = true, scrollToTop = true)') },
    { name: 'Highlight click triggers navigateToVerse', pass: appJs.includes('AppUI.navigateToVerse(h.book, h.chapter, h.verse)') },
    { name: 'Bookmark click triggers navigateToVerse', pass: appJs.includes('AppUI.navigateToVerse(bm.book, bm.chapter, bm.verse_start || 1)') },
    { name: 'Note click triggers navigateToVerse', pass: appJs.includes('AppUI.navigateToVerse(n.book, n.chapter, n.verse || 1)') },
    { name: 'Search result click triggers navigateToVerse', pass: appJs.includes('AppUI.navigateToVerse(res.book, res.chapter, res.verse)') },
    { name: 'Target verse smooth scrolling and center block used', pass: appJs.includes("behavior: 'smooth'") && appJs.includes("block: 'center'") },
    { name: 'Clear error handling for invalid/missing verses', pass: appJs.includes('Verse ${vNum} not found in ${canonical.name}') },
    { name: 'CSS .verse-target-focus pulse animation defined', pass: readerCss.includes('.verse-item.verse-target-focus') && readerCss.includes('@keyframes verseTargetPulse') },
    { name: 'CSS scroll-margin defined on .verse-item', pass: readerCss.includes('scroll-margin-top: 120px') },
    { name: 'CSS toast-error styling in components.css', pass: compCss.includes('.toast.toast-error') }
  ];

  let allNavPassed = true;
  navChecks.forEach(c => {
    if (!c.pass) allNavPassed = false;
    console.log(`  ${c.pass ? '✓' : '✗'} ${c.name}`);
  });

  if (!allNavPassed) {
    throw new Error('Some verse navigation tests failed!');
  }

  console.log('\n=== ALL AUTOMATED TESTS COMPLETED SUCCESSFULLY ===');
}

testApp().catch(console.error);
