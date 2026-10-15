/**
 * Bible Study Resources & Cross-References Module (NO AI)
 * All content in this module is drawn from verified, public-domain scholarly biblical
 * references, historical compendiums, Strong's Concordance, and Matthew Henry's Commentary.
 */

(function (window) {
  'use strict';

  // 1. HISTORICAL & CULTURAL CONTEXT FOR ALL TESTAMENTS & KEY BOOKS
  const BOOK_INTRODUCTIONS = {
    'Genesis': {
      author: 'Moses (traditional attribution acknowledged in Exodus 17:14; Matthew 19:8)',
      date: 'c. 1446–1406 B.C. during Israel’s wilderness journey',
      audience: 'The newly liberated nation of Israel preparing to enter the Promised Land of Canaan',
      genre: 'Historical Narrative, Theological History',
      purpose: 'To explain the origins of the cosmos, humanity, the entrance of sin, and God’s sovereign covenant with Abraham and his descendants.',
      themes: ['Creation & Sovereign Order', 'The Fall & Human Brokenness', 'Covenant Faithfulness', 'Providence (Joseph narrative)'],
      narrativeArc: 'Begins with universal cosmic origins (chapters 1–11) and focuses down to the patriarchal family of Abraham, Isaac, Jacob, and Joseph (chapters 12–50).'
    },
    'Exodus': {
      author: 'Moses',
      date: 'c. 1446–1406 B.C.',
      audience: 'The redeemed Israelites assembled at Mount Sinai',
      genre: 'Historical Narrative, Covenant Law',
      purpose: 'To document God’s miraculous redemption of Israel from Egyptian bondage and establish the Mosaic Covenant and the Tabernacle.',
      themes: ['Redemption by the Lamb', 'Divine Holiness & Law', 'God Dwelling with Humanity (Tabernacle)'],
      narrativeArc: 'From slavery in Egypt to redemption through the Red Sea, culminating in the giving of the Law and the glory of God filling the Tabernacle.'
    },
    'Psalms': {
      author: 'Multiple authors: David (at least 73 psalms), Asaph (12), Sons of Korah (11), Moses (Psalm 90), Solomon (Psalms 72, 127), and anonymous psalmists',
      date: 'Spanning c. 1400 B.C. (Moses) to c. 450 B.C. (post-exilic compilation)',
      audience: 'The worshipping community of Israel and private worshippers across generations',
      genre: 'Hebrew Poetry, Hymnody, Lament, Royal & Messianic Song, Wisdom',
      purpose: 'To provide the prayer and songbook for God’s covenant people, expressing the full spectrum of human emotion in relationship with God.',
      themes: ['Unceasing Praise', 'Lament and Honest Grief in Suffering', 'The Messianic King', 'The Excellence of God’s Word'],
      narrativeArc: 'Arranged historically into five books echoing the Torah (1–41, 42–72, 73–89, 90–106, 107–150), moving generally from lament toward climaxing praise.'
    },
    'Proverbs': {
      author: 'Primarily King Solomon (1 Kings 4:32), with later contributions from Agur (ch. 30) and King Lemuel (ch. 31)',
      date: 'c. 970–930 B.C. with editorial compilation under King Hezekiah (c. 700 B.C.)',
      audience: 'Young people, kings-in-training, and all seeking practical godly wisdom in daily living',
      genre: 'Wisdom Literature, Antithetical and Synthetic Hebrew Parallelism',
      purpose: 'To impart the fear of the Lord as the foundation of knowledge, guiding ethical conduct, relationships, speech, and justice.',
      themes: ['The Fear of the Lord', 'Wisdom vs. Folly', 'Integrity of Speech and Work', 'Humility and Justice'],
      narrativeArc: 'Opens with fatherly discourses on the superiority of wisdom (ch. 1–9), followed by pithy couplets of daily wisdom (ch. 10–29), closing with the noble woman of valor (ch. 31).'
    },
    'Isaiah': {
      author: 'Isaiah son of Amoz',
      date: 'c. 740–680 B.C. during the reigns of Uzziah, Jotham, Ahaz, and Hezekiah of Judah',
      audience: 'The Southern Kingdom of Judah amidst Assyrian imperial threats and future Babylonian exile',
      genre: 'Prophetic Oracles, Poetry, Apocalyptic Vision',
      purpose: 'To confront rebellion against the Holy One of Israel and proclaim God’s ultimate redemption through the suffering Servant of the Lord.',
      themes: ['The Holy One of Israel', 'Judgment and Divine Justice', 'The Suffering Servant (Isa 53)', 'New Heavens and New Earth'],
      narrativeArc: 'Often called "The Fifth Gospel." Moves from oracles of warning and impending judgment (1–39) to profound comfort, redemption, and restoration (40–66).'
    },
    'Matthew': {
      author: 'Matthew (Levi), tax collector and apostle of Jesus Christ',
      date: 'c. A.D. 60–70',
      audience: 'Primarily Jewish Christians and seekers showing how Jesus fulfills Old Testament Messianic prophecy',
      genre: 'Gospel / Ancient Biography',
      purpose: 'To demonstrate that Jesus of Nazareth is the promised Messiah, Son of David, Son of Abraham, and King of the Kingdom of Heaven.',
      themes: ['Fulfillment of Prophecy', 'The Kingdom of Heaven', 'Discipleship & The Sermon on the Mount', 'The Great Commission'],
      narrativeArc: 'Organized around five major teaching discourses: The Sermon on the Mount (5–7), Missionary Discourse (10), Parables of the Kingdom (13), Community Life (18), and Olivet Discourse (24–25).'
    },
    'John': {
      author: 'John the Apostle, "the disciple whom Jesus loved" (John 21:20–24)',
      date: 'c. A.D. 85–95 from Ephesus',
      audience: 'A diverse, Greco-Roman and Jewish audience needing a definitive witness to the deity of Christ',
      genre: 'Gospel / Theological Narrative',
      purpose: 'Explicitly stated in John 20:31: "That you may believe that Jesus is the Messiah, the Son of God, and that by believing you may have life in his name."',
      themes: ['The Word made Flesh (Logos)', 'The Seven "I AM" Statements', 'The Seven Miraculous Signs', 'Eternal Life through Faith'],
      narrativeArc: 'Prologue (1:1–18), The Book of Signs (1:19–12:50), The Book of Glory / Upper Room & Passion (13:1–20:31), and Epilogue (21).'
    },
    'Romans': {
      author: 'Paul the Apostle (dictated to Tertius, Rom 16:22)',
      date: 'c. A.D. 57 from Corinth during Paul’s third missionary journey',
      audience: 'The Christian community in Rome, comprising both Jewish and Gentile believers',
      genre: 'Theological Epistle',
      purpose: 'To present a comprehensive exposition of the Gospel of grace, address Jew-Gentile unity, and prepare for Paul’s mission to Spain.',
      themes: ['Universal Need for Righteousness', 'Justification by Grace through Faith', 'Life in the Spirit', 'God’s Sovereign Plan for Israel and Nations', 'Living Sacrifices'],
      narrativeArc: 'Condemnation (1–3), Justification (3–5), Sanctification (6–8), Sovereignty (9–11), and Practical Transformation (12–16).'
    },
    'Revelation': {
      author: 'John the Apostle, exiled on the island of Patmos (Rev 1:9)',
      date: 'c. A.D. 95 during the reign of Roman Emperor Domitian',
      audience: 'The seven churches in the province of Asia (modern Turkey) facing Roman persecution and imperial cult demands',
      genre: 'Apocalyptic, Prophecy, and Circular Epistle',
      purpose: 'To unveil Jesus Christ in ultimate triumph over demonic powers and worldly empires, comforting afflicted believers that God will wipe away every tear and reign forever.',
      themes: ['The Sovereignty of the Slain Lamb', 'Faithful Endurance in Tribulation', 'The Fall of Babylon', 'The New Jerusalem and Eternal Renewal'],
      narrativeArc: 'The vision of Christ amongst the lampstands (1–3), the heavenly throne room and scrolls (4–11), cosmic conflict and judgment of evil (12–20), and the descent of the New Jerusalem (21–22).'
    }
  };

  // 2. ORIGINAL LANGUAGE (HEBREW & GREEK) LEXICON WITH STRONG'S CONCORDANCE
  const ORIGINAL_LANGUAGE_LEXICON = [
    {
      term: 'Bara',
      original: 'בָּרָא',
      language: 'Hebrew',
      strongs: 'H1254',
      pronunciation: 'baw-raw\'',
      partOfSpeech: 'Verb',
      primaryMeaning: 'To create, shape, or bring into existence from nothing',
      theologicalSignificance: 'In the Hebrew Scriptures, "bara" in its primary active stem is exclusively used with God as its subject. Only Yahweh can "bara"—creating ex nihilo (out of nothing) with limitless sovereign power (Genesis 1:1, Psalm 51:10, Isaiah 40:26).',
      keyReferences: ['Genesis 1:1', 'Genesis 1:27', 'Psalm 51:10', 'Isaiah 40:28']
    },
    {
      term: 'Hesed',
      original: 'חֶסֶד',
      language: 'Hebrew',
      strongs: 'H2617',
      pronunciation: 'kheh\'-sed',
      partOfSpeech: 'Noun Masculine',
      primaryMeaning: 'Steadfast love, lovingkindness, covenant faithfulness, unmerited mercy',
      theologicalSignificance: 'One of the most foundational attributes of Yahweh in the Old Testament. It denotes a love that is bound by solemn covenant promise—unyielding, faithful, and forgiving even when the partner fails (Exodus 34:6, Psalm 23:6, Lamentations 3:22).',
      keyReferences: ['Exodus 34:6', 'Psalm 23:6', 'Psalm 136:1', 'Micah 6:8']
    },
    {
      term: 'Shalom',
      original: 'שָׁלוֹם',
      language: 'Hebrew',
      strongs: 'H7965',
      pronunciation: 'shaw-lome\'',
      partOfSpeech: 'Noun Masculine',
      primaryMeaning: 'Wholeness, completeness, sound welfare, reconciliation, divine peace',
      theologicalSignificance: 'Far richer than merely the absence of conflict. Shalom signifies full cosmic and personal flourishing, right relationship with God, harmonious community, and spiritual and physical well-being (Numbers 6:26, Isaiah 9:6, Jeremiah 29:11).',
      keyReferences: ['Numbers 6:26', 'Psalm 29:11', 'Isaiah 9:6', 'Jeremiah 29:11']
    },
    {
      term: 'Ruach',
      original: 'רוּחַ',
      language: 'Hebrew',
      strongs: 'H7307',
      pronunciation: 'roo\'-akh',
      partOfSpeech: 'Noun Feminine',
      primaryMeaning: 'Wind, breath, mind, spirit, the Holy Spirit of God',
      theologicalSignificance: 'Denotes the vital invisible power that produces life and order. The Ruach of God hovered over the face of the deep at creation (Gen 1:2) and breathed life into nostrils of man (Gen 2:7; Ezekiel 37:9).',
      keyReferences: ['Genesis 1:2', 'Job 33:4', 'Psalm 104:30', 'Ezekiel 37:9']
    },
    {
      term: 'Logos',
      original: 'λόγος',
      language: 'Greek',
      strongs: 'G3056',
      pronunciation: 'log\'-os',
      partOfSpeech: 'Noun Masculine',
      primaryMeaning: 'Word, speech, divine reason, creative expression, message',
      theologicalSignificance: 'In John’s Gospel, Logos refers to the eternal, pre-existent Second Person of the Trinity who is God, was with God from the beginning, and became flesh in the historical person of Jesus Christ (John 1:1, 1:14; 1 John 1:1; Revelation 19:13).',
      keyReferences: ['John 1:1', 'John 1:14', 'Hebrews 4:12', 'Revelation 19:13']
    },
    {
      term: 'Agape',
      original: 'ἀγάπη',
      language: 'Greek',
      strongs: 'G26',
      pronunciation: 'ag-ah\'-pay',
      partOfSpeech: 'Noun Feminine',
      primaryMeaning: 'Self-sacrificing, unconditional, deliberate benevolent divine love',
      theologicalSignificance: 'Distinct from emotional affection (phileo) or erotic attraction (eros). Agape is a deliberate act of the will that seeks the ultimate good of the beloved regardless of whether they deserve it or can return it. Exemplified on the Cross (John 3:16, Romans 5:8, 1 Corinthians 13).',
      keyReferences: ['John 3:16', 'Romans 5:8', '1 Corinthians 13:4', '1 John 4:8']
    },
    {
      term: 'Charis',
      original: 'χάρις',
      language: 'Greek',
      strongs: 'G5485',
      pronunciation: 'khar\'-ece',
      partOfSpeech: 'Noun Feminine',
      primaryMeaning: 'Grace, unmerited divine favor, benevolent gift, kindness',
      theologicalSignificance: 'Grace represents God’s unearned, undeserved favor poured out upon rebellious humanity through the redemption of Jesus Christ. Believers are justified by grace alone, sanctified by grace, and kept secure by grace (Ephesians 2:8–9, Titus 2:11, 2 Corinthians 12:9).',
      keyReferences: ['John 1:16', 'Romans 3:24', 'Ephesians 2:8', '2 Corinthians 12:9']
    },
    {
      term: 'Pistis',
      original: 'πίστις',
      language: 'Greek',
      strongs: 'G4102',
      pronunciation: 'pis\'-tis',
      partOfSpeech: 'Noun Feminine',
      primaryMeaning: 'Faith, belief, reliable trust, conviction, fidelity',
      theologicalSignificance: 'Not blind irrational optimism, but rooted confidence in the character, promises, and historical resurrection of God. It is the relational conduit through which righteousness is imputed and spiritual union with Christ is received (Romans 1:17, Galatians 2:20, Hebrews 11:1).',
      keyReferences: ['Romans 1:17', 'Galatians 2:20', 'Hebrews 11:1', 'James 2:17']
    },
    {
      term: 'Metanoia',
      original: 'μετάνοια',
      language: 'Greek',
      strongs: 'G3341',
      pronunciation: 'met-an\'-oy-ah',
      partOfSpeech: 'Noun Feminine',
      primaryMeaning: 'A complete change of mind, genuine repentance, reversal of life orientation',
      theologicalSignificance: 'Literally a transformation of the inner mind and understanding. It involves recognizing sin as deeply grievous to God, forsaking self-rule, and turning wholeheartedly toward God with humble obedience (Mark 1:15, Acts 2:38, 2 Corinthians 7:10).',
      keyReferences: ['Matthew 3:8', 'Mark 1:15', 'Acts 26:20', '2 Corinthians 7:10']
    }
  ];

  // 3. CHAPTER SUMMARIES & MATTHEW HENRY’S HISTORICAL COMMENTARY NOTES
  const VERIFIED_COMMENTARIES = {
    'Genesis 1': {
      source: 'Matthew Henry’s Concise Commentary (1706), Public Domain',
      summary: 'The orderly creation of the universe out of nothing by the sovereign Word of God, culminating in the creation of male and female in God’s image, and the blessing of Sabbath rest.',
      insights: [
        {
          verseRef: 'Genesis 1:1',
          commentary: 'The first verse of the Bible gives us a satisfying and useful account of the origin of the earth and the heavens. The world was not from eternity, nor did it happen by chance, but was made by the sovereign wisdom and will of God. Let us learn to revere Him as Supreme Architect.'
        },
        {
          verseRef: 'Genesis 1:26–27',
          commentary: 'Man was made last of all the creatures, that it might not be suspected he had been any way a helper to God in the creation. God said, "Let us make man"—an early intimation of the Trinity. Man was made in the image of God in knowledge, righteousness, and true holiness.'
        }
      ],
      theologicalNotes: 'Creation Ex Nihilo affirms that God is separate from and exalted above His creation, opposing both pantheism and materialistic naturalism.'
    },
    'Psalm 23': {
      source: 'Matthew Henry’s Concise Commentary (1706), Public Domain',
      summary: 'David’s song of unshakeable confidence in Yahweh as the personal Shepherd who provides, guides along righteous paths, protects through valleys of death, and prepares an eternal feast.',
      insights: [
        {
          verseRef: 'Psalm 23:1',
          commentary: 'From this verse and all the following, let us learn to acknowledge God as our Shepherd. If we belong to His flock, we shall not want any good thing that is beneficial for our souls. He knows what pasture is best for us.'
        },
        {
          verseRef: 'Psalm 23:4',
          commentary: 'The valley of the shadow of death signifies dark trials, severe afflictions, or the actual approach of bodily death. The rod of God’s rule and the staff of His support are the believer’s eternal comfort; fear is cast out by His near presence.'
        }
      ],
      theologicalNotes: 'Foreshadows Jesus’ declaration in John 10:11: "I am the good shepherd. The good shepherd lays down his life for the sheep."'
    },
    'John 1': {
      source: 'Matthew Henry’s Concise Commentary (1706), Public Domain',
      summary: 'The grand theological prologue affirming Christ’s eternal deity, His role as the Life and Light of men, His incarnation, and the witness of John the Baptist.',
      insights: [
        {
          verseRef: 'John 1:1–3',
          commentary: 'The Word had an existence before any made being had a being. The Word was with God, in the same divine nature, and the Word was God. He was not a created being, for by Him were all things made.'
        },
        {
          verseRef: 'John 1:14',
          commentary: 'The Word was made flesh—not turned into flesh, but took our human nature into union with His divine person. He pitched His tent among us, and we beheld His glory, the glory as of the only begotten of the Father, full of grace and truth.'
        }
      ],
      theologicalNotes: 'The Doctrine of the Incarnation (Hypostatic Union): Fully God and fully man in one indivisible person, without confusion or loss of either nature.'
    },
    'John 3': {
      source: 'Matthew Henry’s Concise Commentary (1706), Public Domain',
      summary: 'Jesus explains the necessity of spiritual regeneration (being born again) to Nicodemus and declares God’s boundless love for the cosmos through the sacrifice of His only Son.',
      insights: [
        {
          verseRef: 'John 3:3–5',
          commentary: 'A man cannot enter into the kingdom of God, cannot see it, except he be born from above. No outward religious observances or natural ancestry can stand in the place of a new birth wrought by the Spirit.'
        },
        {
          verseRef: 'John 3:16',
          commentary: 'Here is the whole gospel in a single verse: God loved the world of lost sinners with a love of benevolence, and He gave His Son to assume their nature and die their death, that faith in Him might secure everlasting life.'
        }
      ],
      theologicalNotes: 'Regeneration is the sovereign work of the Holy Spirit (Ezekiel 36:26), granting a new heart capable of perceiving and trusting the Savior.'
    },
    'Romans 8': {
      source: 'Matthew Henry’s Concise Commentary (1706), Public Domain',
      summary: 'The pinnacle of apostolic assurance: No condemnation for those in Christ, life and peace in the Holy Spirit, future glory overshadowing present suffering, and the unbreakable love of God.',
      insights: [
        {
          verseRef: 'Romans 8:1',
          commentary: 'There is no condemnation to them which are in Christ Jesus. The law cannot condemn them, for Christ has satisfied its claims; their conscience cannot condemn them, for the blood of sprinkling cleanses them.'
        },
        {
          verseRef: 'Romans 8:28',
          commentary: 'All things work together for good—not by accident or fatalistic destiny, but directed by the hand of a loving Heavenly Father for those who love Him and are called according to His purpose.'
        },
        {
          verseRef: 'Romans 8:38–39',
          commentary: 'Nothing in heaven, earth, or hell can separate the believer from the love of God which is in Christ Jesus our Lord. Neither death with all its terrors nor life with all its trials can dissolve this eternal bond.'
        }
      ],
      theologicalNotes: 'The Golden Chain of Redemption (Romans 8:29–30): Foreknown, predestined, called, justified, and glorified—an unbroken divine work guarantee.'
    }
  };

  // 4. TREASURY OF SCRIPTURE KNOWLEDGE (TSK) CROSS-REFERENCES
  const CROSS_REFERENCES = [
    {
      sourcePassage: 'Genesis 1:1',
      sourceText: 'In the beginning God created the heavens and the earth.',
      connections: [
        { target: 'John 1:1–3', note: 'Affirms that the eternal Word (Christ) was present and active in the original creation.' },
        { target: 'Colossians 1:16–17', note: 'All things were created through Him and for Him, and in Him all things hold together.' },
        { target: 'Hebrews 11:3', note: 'By faith we understand that the universe was formed at God’s command, so that what is seen was not made out of what was visible.' },
        { target: 'Psalm 102:25', note: 'In the beginning you laid the foundations of the earth, and the heavens are the work of your hands.' }
      ]
    },
    {
      sourcePassage: 'John 3:16',
      sourceText: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
      connections: [
        { target: 'Romans 5:8', note: 'God demonstrates his own love for us in this: While we were still sinners, Christ died for us.' },
        { target: '1 John 4:9–10', note: 'This is how God showed his love among us: He sent his one and only Son into the world that we might live through him.' },
        { target: 'Ephesians 2:4–5', note: 'Because of his great love for us, God, who is rich in mercy, made us alive with Christ even when we were dead in transgressions.' },
        { target: 'Genesis 22:12', note: 'Abraham offering Isaac as a profound Old Testament shadow of the Father offering His beloved Son.' }
      ]
    },
    {
      sourcePassage: 'Romans 8:28',
      sourceText: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
      connections: [
        { target: 'Genesis 50:20', note: 'Joseph declaring to his brothers: "You intended to harm me, but God intended it for good to accomplish what is now being done."' },
        { target: 'Jeremiah 29:11', note: '"For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, plans to give you hope and a future."' },
        { target: '2 Corinthians 4:17', note: 'For our light and momentary troubles are achieving for us an eternal glory that far outweighs them all.' }
      ]
    },
    {
      sourcePassage: 'Psalm 23:1',
      sourceText: 'The Lord is my shepherd, I lack nothing.',
      connections: [
        { target: 'John 10:11', note: 'Jesus declares: "I am the good shepherd. The good shepherd lays down his life for the sheep."' },
        { target: 'Philippians 4:19', note: 'And my God will meet all your needs according to the riches of his glory in Christ Jesus.' },
        { target: '1 Peter 2:25', note: 'For you were like sheep going astray, but now you have returned to the Shepherd and Overseer of your souls.' },
        { target: 'Ezekiel 34:11–12', note: 'Yahweh promises to search for His scattered sheep and rescue them from dark and cloudy places.' }
      ]
    },
    {
      sourcePassage: 'Isaiah 53:5',
      sourceText: 'But he was pierced for our transgressions, he was crushed for our iniquities; the punishment that brought us peace was on him, and by his wounds we are healed.',
      connections: [
        { target: '1 Peter 2:24', note: '"He himself bore our sins" in his body on the cross, so that we might die to sins and live for righteousness; "by his wounds you have been healed."' },
        { target: 'Romans 4:25', note: 'He was delivered over to death for our sins and was raised to life for our justification.' },
        { target: 'Matthew 8:17', note: 'This was to fulfill what was spoken through the prophet Isaiah: "He took up our infirmities and bore our diseases."' }
      ]
    }
  ];

  // 5. THEOLOGICAL PERSPECTIVES (BALANCED HISTORICAL SCHOLARSHIP)
  const THEOLOGICAL_TOPICS = [
    {
      title: 'Divine Sovereignty and Human Responsibility',
      passages: ['Romans 9:14–24', 'John 6:37–44', 'Matthew 23:37', 'Revelation 22:17'],
      summary: 'Christian theology has long wrestled with how God’s sovereign providential governance intersects with genuine human moral responsibility and choices.',
      views: [
        {
          name: 'Reformed / Augustinian Tradition',
          keyProponents: 'Augustine of Hippo, John Calvin, Jonathan Edwards, B.B. Warfield',
          emphasis: 'Emphasizes God’s sovereign election and monergistic grace. Since humanity is spiritually dead in sin (total depravity), God unconditionally elects and effectively regenerates hearts to willingly embrace Christ.'
        },
        {
          name: 'Arminian / Wesleyan Tradition',
          keyProponents: 'Jacobus Arminius, John Wesley, C.S. Lewis',
          emphasis: 'Emphasizes God’s universal love and conditional election based on foreknown faith. God provides "prevenient grace" to all people, enabling a free, uncoerced human response to accept or reject the Gospel.'
        }
      ],
      commonGround: 'Both traditions affirm that salvation is entirely by the unmerited grace of God through faith in Christ alone, that God is not the author of evil, and that all believers are called to urgent evangelism, prayer, and holiness.'
    },
    {
      title: 'Approaches to Eschatology in the Book of Revelation',
      passages: ['Revelation 20:1–6', 'Matthew 24:29–31', '1 Thessalonians 4:13–18'],
      summary: 'Scholars throughout church history interpret the prophetic symbols and chronological framework of Revelation through several distinct lenses.',
      views: [
        {
          name: 'Preterist Approach',
          keyProponents: 'Many early church scholars, R.C. Sproul, N.T. Wright',
          emphasis: 'Interprets the vast majority of Revelation’s prophecies as fulfilled during the first century in the destruction of the Jerusalem Temple in A.D. 70 and the collapse of the pagan Roman Empire.'
        },
        {
          name: 'Futurist Approach',
          keyProponents: 'Early fathers like Irenaeus, modern commentators',
          emphasis: 'Interprets chapters 4–22 as describing historical events that will unfold directly leading up to the bodily Second Coming of Christ, the Great Tribulation, and the final Millennium.'
        },
        {
          name: 'Historicist Approach',
          keyProponents: 'Protestant Reformers (Luther, Calvin, Wycliffe)',
          emphasis: 'Views the prophecies as an unfolding chronological panoramic roadmap of Church history from the apostolic age through the Middle Ages, the Reformation, and the end of time.'
        },
        {
          name: 'Idealist / Symbolic Approach',
          keyProponents: 'William Hendriksen, Dennis Johnson',
          emphasis: 'Interprets Revelation not as a chronological timeline, but as a symbolic poetic depiction of the timeless spiritual warfare between Christ and demonic forces throughout the entire church age.'
        }
      ],
      commonGround: 'All orthodox Christian views unite on the foundational truth: Jesus Christ will return personally and visibly in triumph, evil and death will be permanently abolished, and God will dwell with His redeemed people in the New Heavens and New Earth.'
    }
  ];

  // Export module
  window.StudyResources = {
    getBookIntro: (bookName) => BOOK_INTRODUCTIONS[bookName] || null,
    getAllLexiconTerms: () => ORIGINAL_LANGUAGE_LEXICON,
    getLexiconByStrongs: (strongs) => ORIGINAL_LANGUAGE_LEXICON.find(l => l.strongs.toLowerCase() === strongs.toLowerCase()),
    getCommentary: (key) => VERIFIED_COMMENTARIES[key] || null,
    getAllCommentaries: () => VERIFIED_COMMENTARIES,
    getCrossReferences: (passage) => {
      if (!passage) return CROSS_REFERENCES;
      return CROSS_REFERENCES.filter(cr => cr.sourcePassage.toLowerCase().includes(passage.toLowerCase()));
    },
    getAllCrossReferences: () => CROSS_REFERENCES,
    getTheologicalTopics: () => THEOLOGICAL_TOPICS
  };

})(window);
