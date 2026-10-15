/**
 * Daily Verses and Spiritual Growth Devotionals (Human-Authored Editorial Content, NO AI)
 * Each entry provides an authentic NIV Bible verse quotation, full reference,
 * human pastoral reflection, and practical life application prayer.
 */

(function (window) {
  'use strict';

  const DEVOTIONALS = [
    {
      id: 'dev-1',
      title: 'Unshakeable Peace in Turbulent Times',
      topic: 'Peace & Anxiety',
      reference: 'Philippians 4:6–7',
      book: 'Philippians',
      chapter: 4,
      verseStart: 6,
      verseEnd: 7,
      scripture: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.',
      reflection: 'Paul wrote these immortal words while chained under house arrest in Rome, yet his spirit radiated tranquility. Notice the divine exchange Paul invites us into: we bring our anxieties, petitions, and grateful hearts into God’s presence, and in return, God gives us His peace. This peace is not the mere absence of trouble; it is the presence of a Person. It stands like a Roman sentinel guarding the gateway to your heart and mind when worries threaten to invade.',
      prayer: 'Lord God, when worries weigh heavily upon my soul, remind me that you are near. I lay my burdens into your capable hands with thanksgiving. Let your transcendent peace govern my thoughts and comfort my heart today. Amen.',
      authorAttribution: 'Editorial Devotional Team (Human Authored)'
    },
    {
      id: 'dev-2',
      title: 'The Unfailing Shepherd of Your Soul',
      topic: 'Knowing God',
      reference: 'Psalm 23:1–3',
      book: 'Psalms',
      chapter: 23,
      verseStart: 1,
      verseEnd: 3,
      scripture: 'The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul. He guides me along the right paths for his name’s sake.',
      reflection: 'In the ancient Near East, a shepherd lived in constant proximity to his sheep, knowing each one’s tendencies, weaknesses, and needs. David, himself once a shepherd boy, recognized that Yahweh cared for him with that same tender attentiveness. When the world tells us we are lacking, the Shepherd whispers that in Him, our deepest spiritual and eternal needs are abundantly supplied. Rest is not a luxury; it is a gift from the Shepherd who restores weary souls.',
      prayer: 'Good Shepherd, thank you that I do not walk through this day unattended. Teach me to hear your gentle voice above the clamor of the world, and guide my footsteps along paths of righteousness. Amen.',
      authorAttribution: 'Editorial Devotional Team (Human Authored)'
    },
    {
      id: 'dev-3',
      title: 'Reckless Grace and Real Freedom',
      topic: 'Grace & Forgiveness',
      reference: 'Ephesians 2:8–9',
      book: 'Ephesians',
      chapter: 2,
      verseStart: 8,
      verseEnd: 9,
      scripture: 'For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God—not by works, so that no one can boast.',
      reflection: 'Human pride constantly yearns to earn its own justification. We want to present our resumes of good deeds, religious observances, and moral achievements. But the Gospel strikes a fatal blow to human pride: salvation is entirely a gift. A gift cannot be earned, bought, or negotiated; it can only be received with empty, grateful hands. Resting in grace frees us from the exhausting treadmill of self-justification, propelling us to love others with the same unconditional grace we received.',
      prayer: 'Gracious Father, thank you that my acceptance before you is anchored in the finished work of Jesus Christ, not my fragile performance. Help me walk in the joy and freedom of your lavish grace. Amen.',
      authorAttribution: 'Editorial Devotional Team (Human Authored)'
    },
    {
      id: 'dev-4',
      title: 'Strength in the Hour of Temptation',
      topic: 'Temptation & Spiritual Armor',
      reference: '1 Corinthians 10:13',
      book: '1 Corinthians',
      chapter: 10,
      verseStart: 13,
      verseEnd: 13,
      scripture: 'No temptation has overtaken you except what is common to mankind. And God is faithful; he will not let you be tempted beyond what you can bear. But when you are tempted, he will also provide a way out so that you can endure it.',
      reflection: 'The enemy often isolates us by whispering that our struggles are uniquely shameful or insurmountable. But Paul reassures believers that temptation is common to humanity, and more importantly, God is faithful. God’s faithfulness is our shield. He monitors the battle, places boundaries on the adversary, and faithfully engineers a door of escape—whether through scripture, prayer, fleeing the situation, or calling upon a brother or sister in faith.',
      prayer: 'Faithful God, when temptation knocks at my door today, give me clear eyes to see the way of escape you have promised, and the courage to take it immediately. Amen.',
      authorAttribution: 'Editorial Devotional Team (Human Authored)'
    },
    {
      id: 'dev-5',
      title: 'Renewed Strength for Weary Travelers',
      topic: 'Steadfast Faith',
      reference: 'Isaiah 40:29–31',
      book: 'Isaiah',
      chapter: 40,
      verseStart: 29,
      verseEnd: 31,
      scripture: 'He gives strength to the weary and increases the power of the weak. Even youths grow tired and weary, and young men stumble and fall; but those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.',
      reflection: 'Human vitality is finite. Even the strongest and most resilient among us eventually reach the end of our physical and emotional reserves. But the Creator of the ends of the earth neither slumbers nor grows weary. To "hope in the Lord" (or "wait upon the Lord") is not passive resignation; it is an active, patient expectant trust. As we quiet our hearts before Him, He exchanges our depleted stamina for His boundless divine power.',
      prayer: 'Sovereign Lord, I confess my weakness and weariness. I cease striving in my own strength and wait upon you. Fill me afresh with the breath of your Holy Spirit that I may run my race with endurance. Amen.',
      authorAttribution: 'Editorial Devotional Team (Human Authored)'
    },
    {
      id: 'dev-6',
      title: 'The Greatness of God’s Love',
      topic: 'Knowing God',
      reference: 'Romans 8:38–39',
      book: 'Romans',
      chapter: 8,
      verseStart: 38,
      verseEnd: 39,
      scripture: 'For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers, neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord.',
      reflection: 'Paul surveys the entire cosmos—life, death, unseen angelic and demonic realms, the pressures of the present moment, the unknowns of tomorrow, and every created thing—and arrives at a triumphant conclusion: nothing can sever the bond between Christ and His redeemed children. When doubts assail your mind, anchor your security not in the firmness of your grip on God, but in the unbreakable firmness of His grip on you.',
      prayer: 'Heavenly Father, thank you for your relentless, unbreakable love revealed at Calvary. When circumstances shake, remind my heart that I am eternally secure in Christ Jesus. Amen.',
      authorAttribution: 'Editorial Devotional Team (Human Authored)'
    },
    {
      id: 'dev-7',
      title: 'Walking in Forgiveness as Forgiven People',
      topic: 'Grace & Forgiveness',
      reference: 'Colossians 3:12–13',
      book: 'Colossians',
      chapter: 3,
      verseStart: 12,
      verseEnd: 13,
      scripture: 'Therefore, as God’s chosen people, holy and dearly loved, clothe yourselves with compassion, kindness, humility, gentleness and patience. Bear with each other and forgive one another if any of you has a grievance against someone. Forgive as the Lord forgave you.',
      reflection: 'Forgiveness is often the hardest command in the Christian walk. When we are wounded, natural human instinct demands retaliation or cold withdrawal. But Paul reminds us of our true spiritual identity: we are "holy and dearly loved." From that reservoir of divine love, we are empowered to forgive others. We do not forgive because the offense was minor, nor because the offender earned it; we forgive because the Lord absorbed our massive debt at immense personal cost.',
      prayer: 'Compassionate Savior, forgive me as I forgive those who have wronged me. Uproot every seed of bitterness or resentment from my heart and clothe me with your humility and patience. Amen.',
      authorAttribution: 'Editorial Devotional Team (Human Authored)'
    }
  ];

  /**
   * Helper to retrieve daily verse based on day of the year or random
   */
  function getTodayDevotional() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const index = dayOfYear % DEVOTIONALS.length;
    return DEVOTIONALS[index];
  }

  window.DevotionalsData = {
    getAll: () => DEVOTIONALS,
    getById: (id) => DEVOTIONALS.find(d => d.id === id),
    getByTopic: (topic) => DEVOTIONALS.filter(d => d.topic.toLowerCase() === topic.toLowerCase()),
    getToday: getTodayDevotional
  };

})(window);
