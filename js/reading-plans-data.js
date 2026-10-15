/**
 * Structured Bible Reading Plans (Book-based, Topical, and Duration-based)
 * Designed for spiritual growth, tracking completed days, and reading streaks.
 */

(function (window) {
  'use strict';

  const READING_PLANS = [
    {
      id: 'plan-john-21',
      title: 'Gospel of John: 21 Days with Jesus',
      category: 'Book Study',
      durationDays: 21,
      difficulty: 'Accessible',
      description: 'Walk day by day through the Gospel of John. Encounter Jesus’ miraculous signs, intimate teachings in the Upper Room, and His victorious resurrection.',
      icon: 'sparkles',
      days: [
        { day: 1, title: 'The Word Became Flesh', book: 'John', chapter: 1, verseStart: 1, verseEnd: 18, focus: 'Meditate on the eternal divinity and incarnation of Christ.' },
        { day: 2, title: 'Behold the Lamb of God', book: 'John', chapter: 1, verseStart: 19, verseEnd: 51, focus: 'Notice how John the Baptist and the first disciples testify of Jesus.' },
        { day: 3, title: 'The First Sign at Cana', book: 'John', chapter: 2, verseStart: 1, verseEnd: 25, focus: 'Reflect on Jesus transforming water into wine and cleansing the temple.' },
        { day: 4, title: 'Born from Above', book: 'John', chapter: 3, verseStart: 1, verseEnd: 21, focus: 'Jesus explains the necessity of the new birth to Nicodemus.' },
        { day: 5, title: 'Living Water at the Well', book: 'John', chapter: 4, verseStart: 1, verseEnd: 42, focus: 'The transformative conversation with the Samaritan woman.' },
        { day: 6, title: 'Healing at Bethesda', book: 'John', chapter: 5, verseStart: 1, verseEnd: 30, focus: 'Jesus declares His authority alongside the Father.' },
        { day: 7, title: 'The Bread of Life', book: 'John', chapter: 6, verseStart: 25, verseEnd: 59, focus: 'Jesus feeds the five thousand and proclaims Himself the true bread.' },
        { day: 8, title: 'Streams of Living Water', book: 'John', chapter: 7, verseStart: 25, verseEnd: 52, focus: 'Jesus promises the Holy Spirit during the Feast of Booths.' },
        { day: 9, title: 'The Light of the World', book: 'John', chapter: 8, verseStart: 12, verseEnd: 36, focus: 'Jesus frees from condemnation and proclaims the truth that sets us free.' },
        { day: 10, title: 'Sight for the Blind', book: 'John', chapter: 9, verseStart: 1, verseEnd: 41, focus: 'Physical sight versus spiritual discernment.' },
        { day: 11, title: 'The Good Shepherd', book: 'John', chapter: 10, verseStart: 1, verseEnd: 21, focus: 'Jesus lays down His life for His sheep.' },
        { day: 12, title: 'The Resurrection and the Life', book: 'John', chapter: 11, verseStart: 1, verseEnd: 44, focus: 'Jesus weeps with Mary and Martha and raises Lazarus from death.' },
        { day: 13, title: 'Anointing and the Triumphal Entry', book: 'John', chapter: 12, verseStart: 1, verseEnd: 26, focus: 'Mary’s lavish devotion and Jesus predicting His death.' },
        { day: 14, title: 'Washing the Disciples’ Feet', book: 'John', chapter: 13, verseStart: 1, verseEnd: 20, focus: 'The King demonstrates radical servant love.' },
        { day: 15, title: 'The Way, the Truth, the Life', book: 'John', chapter: 14, verseStart: 1, verseEnd: 31, focus: 'Jesus promises the Counselor, the Holy Spirit, and His deep peace.' },
        { day: 16, title: 'The Vine and the Branches', book: 'John', chapter: 15, verseStart: 1, verseEnd: 17, focus: 'Abiding in Christ as the only source of spiritual fruitfulness.' },
        { day: 17, title: 'Overcoming the World', book: 'John', chapter: 16, verseStart: 16, verseEnd: 33, focus: '"In this world you will have trouble. But take heart! I have overcome the world."' },
        { day: 18, title: 'The High Priestly Prayer', book: 'John', chapter: 17, verseStart: 1, verseEnd: 26, focus: 'Jesus prays for His disciples and for all future believers across time.' },
        { day: 19, title: 'The Betrayal and Trials', book: 'John', chapter: 18, verseStart: 1, verseEnd: 40, focus: 'Jesus willingly steps forward in Gethsemane.' },
        { day: 20, title: 'It Is Finished', book: 'John', chapter: 19, verseStart: 16, verseEnd: 42, focus: 'The crucifixion, final words of triumph, and burial of the Messiah.' },
        { day: 21, title: 'He Is Risen: Feed My Sheep', book: 'John', chapter: 20, verseStart: 1, verseEnd: 21, focus: 'The empty tomb, restoration of Peter, and commissioning of believers.' }
      ]
    },
    {
      id: 'plan-peace-7',
      title: 'Finding Peace in Anxiety',
      category: 'Topical: Peace',
      durationDays: 7,
      difficulty: 'Easy',
      description: 'Discover biblical solace and practical spiritual anchors when anxious thoughts, panic, or overwhelm strike.',
      icon: 'feather',
      days: [
        { day: 1, title: 'Cast Your Anxieties Upon Him', book: '1 Peter', chapter: 5, verseStart: 6, verseEnd: 11, focus: 'God deeply cares for you; cast every heavy burden onto His shoulders.' },
        { day: 2, title: 'The Peace That Transcends Understanding', book: 'Philippians', chapter: 4, verseStart: 4, verseEnd: 9, focus: 'Exchange worry for prayer and thanksgiving.' },
        { day: 3, title: 'Do Not Worry About Tomorrow', book: 'Matthew', chapter: 6, verseStart: 25, verseEnd: 34, focus: 'Observe the birds of the air and lilies of the field: your Father provides.' },
        { day: 4, title: 'God Is Our Refuge and Strength', book: 'Psalms', chapter: 46, verseStart: 1, verseEnd: 11, focus: '"Be still, and know that I am God."' },
        { day: 5, title: 'Peace I Leave with You', book: 'John', chapter: 14, verseStart: 25, verseEnd: 27, focus: 'Receive Christ’s distinct gift of peace that the world cannot give.' },
        { day: 6, title: 'Fear Not, for I Am with You', book: 'Isaiah', chapter: 41, verseStart: 8, verseEnd: 13, focus: 'God upholds you with His righteous right hand.' },
        { day: 7, title: 'Rest in the Shadow of the Almighty', book: 'Psalms', chapter: 91, verseStart: 1, verseEnd: 16, focus: 'Dwelling in the secret place of divine protection.' }
      ]
    },
    {
      id: 'plan-grace-7',
      title: 'Walking in Grace & Forgiveness',
      category: 'Topical: Grace',
      durationDays: 7,
      difficulty: 'Reflective',
      description: 'Experience the liberating power of God’s unconditional grace and learn how to release resentment and forgive others.',
      icon: 'heart',
      days: [
        { day: 1, title: 'Saved by Grace Alone', book: 'Ephesians', chapter: 2, verseStart: 1, verseEnd: 10, focus: 'Salvation as God’s unearned gift, leading to good works.' },
        { day: 2, title: 'Forgiving as We Were Forgiven', book: 'Colossians', chapter: 3, verseStart: 12, verseEnd: 17, focus: 'Clothed with compassion, kindness, and patience.' },
        { day: 3, title: 'The Father’s Lavish Welcome', book: 'Luke', chapter: 15, verseStart: 11, verseEnd: 32, focus: 'The Parable of the Prodigal Son and the running father.' },
        { day: 4, title: 'As Far as the East Is from the West', book: 'Psalms', chapter: 103, verseStart: 8, verseEnd: 14, focus: 'God removes our transgressions completely.' },
        { day: 5, title: 'No Condemnation in Christ', book: 'Romans', chapter: 8, verseStart: 1, verseEnd: 4, focus: 'Freedom from the condemning power of the law.' },
        { day: 6, title: 'The Unmerciful Servant', book: 'Matthew', chapter: 18, verseStart: 21, verseEnd: 35, focus: 'Recognizing the massive debt God canceled for us.' },
        { day: 7, title: 'Grace Sufficient in Weakness', book: '2 Corinthians', chapter: 12, verseStart: 7, verseEnd: 10, focus: 'God’s power is made perfect in human weakness.' }
      ]
    },
    {
      id: 'plan-romans-16',
      title: 'Romans: Foundations of Faith',
      category: 'Doctrine & Theology',
      durationDays: 16,
      difficulty: 'Intermediate',
      description: 'A chapter-by-chapter immersion through Paul’s masterpiece on the Gospel, justification by faith, life in the Spirit, and Christian unity.',
      icon: 'book-open',
      days: [
        { day: 1, title: 'Unashamed of the Gospel', book: 'Romans', chapter: 1, verseStart: 1, verseEnd: 32, focus: 'The power of God for salvation to everyone who believes.' },
        { day: 2, title: 'God’s Righteous Judgment', book: 'Romans', chapter: 2, verseStart: 1, verseEnd: 29, focus: 'God judges the secrets of human hearts without partiality.' },
        { day: 3, title: 'Righteousness Through Faith', book: 'Romans', chapter: 3, verseStart: 1, verseEnd: 31, focus: 'All have sinned; all are justified freely by His grace.' },
        { day: 4, title: 'Abraham’s Justifying Faith', book: 'Romans', chapter: 4, verseStart: 1, verseEnd: 25, focus: 'Faith credited as righteousness before the circumcision law.' },
        { day: 5, title: 'Peace with God and Hope in Suffering', book: 'Romans', chapter: 5, verseStart: 1, verseEnd: 21, focus: 'While we were still sinners, Christ died for us.' },
        { day: 6, title: 'Dead to Sin, Alive in Christ', book: 'Romans', chapter: 6, verseStart: 1, verseEnd: 23, focus: 'The wages of sin is death; the gift of God is eternal life.' },
        { day: 7, title: 'Released from the Law', book: 'Romans', chapter: 7, verseStart: 1, verseEnd: 25, focus: 'The internal struggle and thanksgiving through Jesus Christ.' },
        { day: 8, title: 'Life and Assurance in the Spirit', book: 'Romans', chapter: 8, verseStart: 1, verseEnd: 39, focus: 'No condemnation, adoption as children, and unbreakable love.' },
        { day: 9, title: 'God’s Sovereign Choice', book: 'Romans', chapter: 9, verseStart: 1, verseEnd: 33, focus: 'Paul’s grief for Israel and God’s sovereign covenant promise.' },
        { day: 10, title: 'Faith Comes from Hearing', book: 'Romans', chapter: 10, verseStart: 1, verseEnd: 21, focus: 'Confessing with the mouth and believing in the heart.' },
        { day: 11, title: 'The Remnant and the Wild Olive Tree', book: 'Romans', chapter: 11, verseStart: 1, verseEnd: 36, focus: 'God’s mystery of mercy for both Jews and Gentiles.' },
        { day: 12, title: 'Living Sacrifices', book: 'Romans', chapter: 12, verseStart: 1, verseEnd: 21, focus: 'Transformation of mind, spiritual gifts, and sincere love.' },
        { day: 13, title: 'Submission to Authorities and Love', book: 'Romans', chapter: 13, verseStart: 1, verseEnd: 14, focus: 'Love as the fulfillment of the law.' },
        { day: 14, title: 'The Weak and the Strong', book: 'Romans', chapter: 14, verseStart: 1, verseEnd: 23, focus: 'Not passing judgment on disputable matters.' },
        { day: 15, title: 'Paul’s Missionary Heart', book: 'Romans', chapter: 15, verseStart: 1, verseEnd: 33, focus: 'Christ the servant of the circumcised and Gentiles.' },
        { day: 16, title: 'Personal Greetings and Doxology', book: 'Romans', chapter: 16, verseStart: 1, verseEnd: 27, focus: 'Gratitude for fellow workers in the Gospel.' }
      ]
    },
    {
      id: 'plan-prayer-7',
      title: 'The Power of Prayer & Intercession',
      category: 'Topical: Prayer',
      durationDays: 7,
      difficulty: 'Easy',
      description: 'Strengthen your personal prayer life through the teachings of Jesus and the persistent prayers of biblical saints.',
      icon: 'sparkles',
      days: [
        { day: 1, title: 'The Lord’s Pattern for Prayer', book: 'Matthew', chapter: 6, verseStart: 5, verseEnd: 15, focus: 'Praying with reverence, surrender, and forgiveness.' },
        { day: 2, title: 'Ask, Seek, Knock', book: 'Luke', chapter: 11, verseStart: 1, verseEnd: 13, focus: 'Persistence in prayer and the Father giving the Holy Spirit.' },
        { day: 3, title: 'Praying with Passion and Endurance', book: 'James', chapter: 5, verseStart: 13, verseEnd: 18, focus: 'The prayer of a righteous person is powerful and effective.' },
        { day: 4, title: 'Intercession for Spiritual Wisdom', book: 'Ephesians', chapter: 1, verseStart: 15, verseEnd: 23, focus: 'Paul’s model prayer for spiritual enlightenment and power.' },
        { day: 5, title: 'Praying Continually', book: '1 Thessalonians', chapter: 5, verseStart: 16, verseEnd: 18, focus: 'Rejoicing always and giving thanks in all circumstances.' },
        { day: 6, title: 'The Holy Spirit Intercedes for Us', book: 'Romans', chapter: 8, verseStart: 26, verseEnd: 27, focus: 'When we do not know what to pray, the Spirit helps us.' },
        { day: 7, title: 'Boldness at the Throne of Grace', book: 'Hebrews', chapter: 4, verseStart: 14, verseEnd: 16, focus: 'Approaching God’s throne with confidence through our High Priest.' }
      ]
    }
  ];

  window.ReadingPlansData = {
    getAll: () => READING_PLANS,
    getById: (id) => READING_PLANS.find(p => p.id === id)
  };

})(window);
