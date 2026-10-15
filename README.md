# Bible App — Responsive NIV Bible Study Website

A responsive, peaceful, and feature-rich Christian Bible study platform built with **HTML5**, **CSS3**, and **Vanilla JavaScript**, featuring the **New International Version (NIV)** of the Holy Bible, reliable prewritten study tools, structured reading plans, and a personal prayer journal.

---

## 1. Technical Architecture & Tech Stack

- **Frontend**: Semantic HTML5, Vanilla CSS3 (custom design system with CSS custom properties), Vanilla JavaScript (modular ES6+ IIFE structure). Zero bulky frontend frameworks (no React/Vue/Tailwind).
- **Aesthetic**: Strict monochrome minimalist editorial aesthetic with pure black (`#000000`) and pure white (`#FFFFFF`), curated grayscale palette (`#111111`, `#222222`, `#444444`, `#777777`, `#AAAAAA`, `#DDDDDD`), high-contrast inverted buttons, prominent pericope section headings, and distraction-free typography (*Playfair Display* / *Inter*).
- **Backend & Database**: **Supabase Auth** + **PostgreSQL** with Row-Level Security (RLS) enabled on all private tables.
- **Offline / Guest Mode Resilience**: Operates in Guest Mode out of the box using `localStorage`. When the user registers or connects their Supabase credentials, local data (bookmarks, notes, prayers, reading history) is automatically migrated to PostgreSQL.
- **Zero AI Guarantee**: Absolutely **no AI APIs, AI models, AI chatbots, or AI-generated commentaries**. All biblical study resources, lexicons, and commentaries are verified public domain historical scholarship (Matthew Henry, Strong's Concordance, Treasury of Scripture Knowledge).

---

## 2. Scripture Data Source & Licensing Assessment

### Proposed Source: `aruljohn/Bible-niv`
- **Repository Structure**:
  - `Books.json`: Array of all 66 canonical books of the Bible.
  - 66 separate JSON files (e.g. `Genesis.json`, `John.json`, `Revelation.json`).
  - Schema: `{ "book": "Genesis", "count": "50", "chapters": [ { "chapter": 1, "verses": [ { "verse": 1, "text": "..." } ] } ] }`.
- **Completeness Verification**:
  - All 66 books from `Books.json` match existing JSON files in the repository.
  - Representative Old and New Testament passages tested and verified:
    - *Genesis 1:1*: "In the beginning God created the heavens and the earth."
    - *Psalm 23:1*: "The Lord is my shepherd, I lack nothing."
    - *Isaiah 53:5*: "But he was pierced for our transgressions, he was crushed for our iniquities..."
    - *Matthew 1:1*: "This is the genealogy of Jesus the Messiah the son of David, the son of Abraham..."
    - *John 3:16*: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."
    - *Romans 8:1*: "Therefore, there is now no condemnation for those who are in Christ Jesus..."

### Legal & Copyright Analysis:
> [!IMPORTANT]
> **Copyright Notice**: The New International Version (NIV) text is copyright © 1973, 1978, 1984, 2011 by **Biblica, Inc.™** (formerly International Bible Society), published in North America by Zondervan and worldwide under license.
>
> While the code and repository scripts of `aruljohn/Bible-niv` are licensed under the **MIT License**, the MIT license applies **only to the repository code, NOT to the underlying copyrighted text of the NIV Bible**. Biblica's copyright guidelines permit non-commercial quotation of up to 500 verses with appropriate attribution, but **prohibit complete unauthorized redistribution or hosting** of the entire Bible translation without an official commercial or digital license from Biblica/HarperCollins Christian Publishing.
>
> **Architecture Compliance**:
> 1. We display the full official translation name: **New International Version (NIV)** and provide the required Biblica copyright notice in the site footer and reading areas.
> 2. The Scripture data layer (`js/bible-provider.js`) is built as a pluggable adapter (`BibleProvider`). It supports fetching on demand from the repository for development/evaluation, or toggling seamlessly to an authorized licensed API provider (such as API.Bible with authorized NIV credentials) or custom church server endpoint without modifying application logic.
> 3. Verses are never fabricated, altered, or silently substituted.

---

## 3. Key Implemented Features

### 📖 Bible Reader
- **66 Books Navigation**: Fast book & chapter picker with Old Testament (39) and New Testament (27) categorization.
- **Sequential Navigation**: Seamless next/previous chapter switching across book boundaries (e.g., Genesis 50 → Exodus 1).
- **Verse Interaction Palette**: Click any verse to trigger the floating action toolbar:
  - **Highlighting**: 5 pastel colors (*Yellow, Green, Blue, Purple, Rose*) + highlight removal.
  - **Personal Notes**: Attach notes and reflections to specific verses (displays note badges in text).
  - **Bookmarking**: Save passages to personal bookmarks.
  - **Copy & Share**: Copy scripture with clean reference attribution.
  - **Deep-Link to Study Tools**: Immediately view historical context and original language terms.
- **Reading Controls**: 4 adjustable font sizes (`A-`, `A`, `A+`, `A++`) and view modes (Paragraph vs. Verse-by-Verse line mode).
- **Reading Position Memory**: Remembers last read book, chapter, and verse across sessions.

### 🧭 Bible Study & Cross-References (NO AI)
- **Book Backgrounds**: Author, Date of Writing, Historical Audience, Literary Genre, Central Purpose, and Major Theological Themes for all 66 books.
- **Strong's Greek & Hebrew Lexicon**: Detailed linguistic definitions for key biblical terms:
  - Hebrew: *Bara* (H1254), *Hesed* (H2617), *Shalom* (H7965), *Ruach* (H7307).
  - Greek: *Logos* (G3056), *Agape* (G26), *Charis* (G5485), *Pistis* (G4102), *Metanoia* (G3341).
- **Treasury of Scripture Knowledge (TSK)**: Authentic cross-references linking Old Testament prophetic promises to New Testament fulfillments.
- **Historical Commentaries**: Verified insights from Matthew Henry’s Concise Commentary (1706, Public Domain) with clear attribution.
- **Perspectives on Christian Interpretation**: Fair, balanced presentations of historical theological interpretations (e.g., Reformed vs. Arminian views on Sovereignty & Responsibility; Eschatological frameworks in Revelation).

### ☀️ Daily Verse & Devotionals
- Rotating daily NIV Scripture with human-authored devotional reflections.
- Spiritual growth topics: *Peace & Anxiety*, *Grace & Forgiveness*, *Knowing God*, *Temptation & Spiritual Armor*, and *Steadfast Faith*.
- Reading streaks counter and quick resume button.

### 📅 Structured Reading Plans
- Multi-day reading plans with daily passage links, focus questions, and progress tracking:
  - *Gospel of John: 21 Days with Jesus*
  - *Finding Peace in Anxiety (7 Days)*
  - *Walking in Grace & Forgiveness (7 Days)*
  - *Romans: Foundations of Faith (16 Days)*
  - *The Power of Prayer & Intercession (7 Days)*

### 🕊️ Personal Prayer Journal
- Complete Create, Read, Update, Delete (CRUD) prayer journal.
- Categorization: *Petition*, *Intercession*, *Thanksgiving*, *Praise*, *Confession*.
- "Celebrate Answered Prayer" modal with testimony recording.
- Filters: All Prayers, Active Petitions, and Answered Prayers.

### 🔐 User Accounts & Database Security
- Supabase Auth: Email sign-up, sign-in, and password recovery.
- Guest Mode with complete local persistence.
- Automatic guest data migration to Supabase PostgreSQL upon registration.
- PostgreSQL schema with Row-Level Security (RLS) guaranteeing users only access their own private data.

---

## 4. Supabase Database Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste and run the migration script located in [`supabase/schema.sql`](file:///c:/Users/acer/Documents/Bible%20Verse%20Website%20Ideas/BibleVerse/supabase/schema.sql).
4. Copy your **Project URL** and **Anon (Public) Key** from **Project Settings > API**.
5. You can enter these credentials either in `.env` (for local server) or directly inside the website's **Settings & Account** page!

---

## 5. Running the Website Locally

You can run the included zero-dependency server:

```bash
# Start local server on port 3000
node server.js
```

Then open your browser to:
```
http://localhost:3000
```

To run the automated test suite:
```bash
node test_app.js
```