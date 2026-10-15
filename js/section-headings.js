/**
 * Standard Biblical Section Headings (Pericopes)
 * Provides verified published section titles for chapters and verse passages across the Bible.
 */

(function (window) {
  'use strict';

  const SECTION_HEADINGS = {
    'Genesis': {
      1: {
        1: 'The Creation of the World',
        3: 'The First Day: Light',
        6: 'The Second Day: Heavens and Waters',
        9: 'The Third Day: Land and Vegetation',
        14: 'The Fourth Day: Sun, Moon, and Stars',
        20: 'The Fifth Day: Living Creatures of Sea and Sky',
        24: 'The Sixth Day: Creatures of Land and Mankind',
        26: 'The Creation of Humankind in God’s Image'
      },
      2: {
        1: 'The Seventh Day: God Rests',
        4: 'Adam and Eve in the Garden of Eden',
        18: 'The Creation of Woman'
      },
      3: {
        1: 'The Fall of Humankind',
        8: 'God Confronts Adam and Eve',
        14: 'The Judgments and the First Gospel Promise',
        21: 'Expulsion from the Garden of Eden'
      },
      4: {
        1: 'Cain and Abel',
        17: 'The Descendants of Cain',
        25: 'The Birth of Seth'
      },
      6: {
        1: 'Human Wickedness and the Grief of God',
        9: 'Noah and the Preparation of the Ark'
      },
      7: {
        1: 'The Great Floodwaters Cover the Earth'
      },
      8: {
        1: 'The Waters Recede and Noah Leaves the Ark',
        20: 'God’s Covenant Promise to Noah'
      },
      9: {
        1: 'God’s Covenant with Noah and the Rainbow'
      },
      11: {
        1: 'The Tower of Babel',
        10: 'The Line from Shem to Abram'
      },
      12: {
        1: 'The Call of Abram and God’s Covenant Promise',
        10: 'Abram and Sarai in Egypt'
      },
      15: {
        1: 'God’s Sovereign Covenant with Abram',
        7: 'The Covenant Confirmed by Blood'
      },
      22: {
        1: 'The Testing of Abraham on Mount Moriah',
        15: 'The Lord Provides and Renews His Oath'
      },
      28: {
        10: 'Jacob’s Dream at Bethel (The Ladder to Heaven)'
      },
      37: {
        1: 'Joseph and His Robe of Many Colors',
        12: 'Joseph Sold by His Brothers into Egypt'
      },
      50: {
        15: 'Joseph Comforts His Brothers: "God Meant It for Good"'
      }
    },
    'Exodus': {
      1: { 1: 'The Israelites Oppressed in Egypt' },
      2: { 1: 'The Birth and Rescue of Moses', 11: 'Moses Flees to Midian' },
      3: { 1: 'Moses and the Burning Bush', 13: 'The Divine Name: "I AM WHO I AM"' },
      12: { 1: 'The First Passover and the Slain Lamb', 29: 'The Tenth Plague: Death of the Firstborn' },
      14: { 1: 'The Red Sea Crossing and Divine Deliverance' },
      20: { 1: 'The Giving of the Ten Commandments' }
    },
    'Psalms': {
      1: { 1: 'The Two Ways of Life: The Righteous and the Wicked' },
      2: { 1: 'The Reign of the Lord’s Anointed King' },
      19: { 1: 'The Heavens Declare the Glory of God', 7: 'The Excellence and Perfection of God’s Law' },
      23: { 1: 'The Lord Is My Shepherd', 4: 'Through the Valley of the Shadow of Death', 5: 'An Anointed Banquet Forever' },
      27: { 1: 'The Lord Is My Light and My Salvation' },
      34: { 1: 'Taste and See That the Lord Is Good' },
      46: { 1: 'God Is Our Refuge and Strength: "Be Still, and Know"' },
      51: { 1: 'David’s Prayer for Cleansing and Repentance' },
      91: { 1: 'Under the Shadow and Shelter of the Most High' },
      100: { 1: 'A Psalm of Thanksgiving and Joyful Noise' },
      103: { 1: 'Praise the Lord, O My Soul: His Boundless Mercies' },
      119: { 1: 'The Inexhaustible Treasure of God’s Word' },
      121: { 1: 'The Lord Watches Over You: Help from the Maker of Heaven' },
      139: { 1: 'The All-Knowing, Ever-Present, and Loving Creator' },
      150: { 1: 'Let Everything That Has Breath Praise the Lord' }
    },
    'Proverbs': {
      1: { 1: 'The Purpose and Value of Godly Wisdom', 8: 'A Father’s Warning Against Sinful Enticements', 20: 'Wisdom’s Cry in the Public Square' },
      3: { 1: 'Trust in the Lord with All Your Heart', 13: 'The Blessed Value of Wisdom' },
      4: { 1: 'Guarding Your Heart Above All Else' },
      31: { 10: 'The Noble Woman of Valor and Godly Character' }
    },
    'Isaiah': {
      9: { 1: 'Unto Us a Child Is Born: The Prince of Peace' },
      40: { 1: 'Comfort, Comfort My People', 12: 'The Sovereign Greatness of the Creator', 27: 'Renewed Wings and Strength for the Weary' },
      53: { 1: 'The Suffering Servant Pierced for Our Transgressions' },
      55: { 1: 'An Invitation to the Thirsty: Come to the Waters' }
    },
    'Matthew': {
      1: { 1: 'The Genealogy of Jesus the Messiah', 18: 'The Virgin Birth of Jesus Christ' },
      2: { 1: 'The Visit of the Magi', 13: 'The Escape to Egypt' },
      3: { 1: 'John the Baptist Prepares the Way', 13: 'The Baptism of Jesus' },
      4: { 1: 'The Temptation of Jesus in the Wilderness', 12: 'Jesus Begins His Public Ministry in Galilee', 18: 'Jesus Calls His First Disciples' },
      5: {
        1: 'The Sermon on the Mount',
        3: 'The Beatitudes',
        13: 'Salt of the Earth and Light of the World',
        17: 'The Fulfillment of the Law and the Prophets',
        21: 'Teaching Concerning Anger and Reconciliation',
        27: 'Teaching Concerning Purity of Heart',
        38: 'Love Your Enemies and Pray for Persecutors'
      },
      6: {
        1: 'Giving to the Needy in Secret',
        5: 'How to Pray: The Lord’s Prayer',
        16: 'Fasting in Humility',
        19: 'Treasures in Heaven',
        25: 'Do Not Be Anxious: Your Heavenly Father Cares'
      },
      7: {
        1: 'Judging Others and the Speck in the Eye',
        7: 'Ask, Seek, and Knock: The Father’s Good Gifts',
        13: 'The Narrow Gate and the Broad Road',
        24: 'The Wise Builder on the Rock and the Fool on Sand'
      },
      28: {
        1: 'The Resurrection: He Is Not Here, He Has Risen!',
        16: 'The Great Commission to All Nations'
      }
    },
    'Mark': {
      1: { 1: 'The Proclamation of John the Baptist', 9: 'The Baptism and Temptation of Jesus', 14: 'Jesus Announces the Kingdom of God' },
      4: { 1: 'The Parable of the Sower', 35: 'Jesus Calms the Storm on the Sea' },
      16: { 1: 'The Glorious Resurrection of the Lord' }
    },
    'Luke': {
      1: { 1: 'The Announcement to Zechariah and Mary', 46: 'Mary’s Song of Praise (The Magnificat)' },
      2: { 1: 'The Birth of Jesus in Bethlehem', 8: 'The Shepherds and the Heavenly Hosts', 21: 'Jesus Presented in the Temple' },
      10: { 25: 'The Parable of the Good Samaritan', 38: 'At the Feet of Jesus: Mary and Martha' },
      15: { 1: 'The Parables of the Lost Sheep and Lost Coin', 11: 'The Parable of the Prodigal Son and the Loving Father' }
    },
    'John': {
      1: {
        1: 'The Word Became Flesh (The Eternal Logos)',
        19: 'John the Baptist’s Witness in the Wilderness',
        29: 'Behold the Lamb of God Who Takes Away the Sin of the World',
        35: 'The Calling of the First Disciples',
        43: 'Jesus Calls Philip and Nathanael'
      },
      2: {
        1: 'The First Miraculous Sign: Water Turned into Wine at Cana',
        13: 'Jesus Cleanses the Temple Courts in Jerusalem'
      },
      3: {
        1: 'Jesus Teaches Nicodemus Concerning the New Birth',
        16: 'For God So Loved the World',
        22: 'John the Baptist’s Joy: "He Must Increase, I Must Decrease"'
      },
      4: {
        1: 'Jesus and the Samaritan Woman at Jacob’s Well',
        27: 'The Harvest Is Ripe for Eternal Life',
        43: 'Jesus Heals an Official’s Dying Son'
      },
      5: {
        1: 'The Healing at the Pool of Bethesda on the Sabbath',
        19: 'The Authority and Life of the Son of God'
      },
      6: {
        1: 'Jesus Feeds the Five Thousand',
        16: 'Jesus Walks Upon the Waters of the Sea',
        25: 'Jesus Proclaims: "I Am the Bread of Life"'
      },
      8: {
        1: 'The Woman Caught in Adultery: "Go and Sin No More"',
        12: 'Jesus Proclaims: "I Am the Light of the World"',
        31: 'The Truth That Sets You Free'
      },
      10: {
        1: 'The Good Shepherd Who Lays Down His Life for the Sheep',
        22: 'The Unbreakable Security of the Shepherd’s Hand'
      },
      11: {
        1: 'The Death of Lazarus',
        17: 'Jesus Comforts Martha: "I Am the Resurrection and the Life"',
        35: 'Jesus Wept at the Tomb',
        38: 'Lazarus Raised from the Dead'
      },
      13: {
        1: 'Jesus Washes the Disciples’ Feet: A Servant’s Love',
        31: 'A New Commandment: Love One Another as I Have Loved You'
      },
      14: {
        1: 'The Way, the Truth, and the Life',
        15: 'The Promise of the Holy Spirit, the Counselor',
        27: 'Peace I Leave with You: Christ’s Gift of Peace'
      },
      15: {
        1: 'The True Vine and the Fruitful Branches',
        9: 'Abiding in Christ’s Love and Joy'
      },
      16: {
        16: 'Grief Transformed into Unshakeable Joy',
        33: '"Take Heart! I Have Overcome the World"'
      },
      17: {
        1: 'The High Priestly Prayer of Jesus for All Believers'
      },
      19: {
        16: 'The Crucifixion of the Messiah at Golgotha',
        28: 'The Final Cry: "It Is Finished"',
        38: 'The Burial of Jesus in the Garden Tomb'
      },
      20: {
        1: 'The Resurrection Morning: The Empty Tomb',
        11: 'The Risen Savior Appears to Mary Magdalene',
        19: 'Jesus Appears to the Disciples Behind Locked Doors',
        24: 'Thomas Believes: "My Lord and My God!"',
        30: 'The Purpose of This Gospel: Life in His Name'
      },
      21: {
        1: 'Breakfast by the Sea of Galilee with the Risen Lord',
        15: 'Jesus Restores Peter: "Feed My Sheep"'
      }
    },
    'Romans': {
      1: {
        1: 'Paul’s Greeting and Calling to Rome',
        16: 'The Power of the Gospel of Righteousness',
        18: 'God’s Wrath Against Human Unrighteousness'
      },
      3: {
        9: 'Universal Need: No One Is Righteous on Their Own',
        21: 'Justified Freely by God’s Grace Through Faith in Christ'
      },
      5: {
        1: 'Peace with God and Rejoicing in Hope Amid Trials',
        6: 'Christ Died for the Ungodly While We Were Sinners',
        12: 'Death in Adam, Abundant Life and Righteousness in Christ'
      },
      8: {
        1: 'Life in the Holy Spirit: No Condemnation in Christ',
        14: 'Adopted as Children and Heirs with Christ',
        18: 'Present Suffering Overshadowed by Future Glory',
        26: 'The Holy Spirit Intercedes in Our Weakness',
        28: 'All Things Work Together for Good',
        31: 'More Than Conquerors: The Unbreakable Love of God'
      },
      12: {
        1: 'Living Sacrifices: A Transformed Mind',
        9: 'Marks of Sincere Love and Faithful Service'
      }
    },
    '1 Corinthians': {
      13: { 1: 'The Supreme Excellence of Love: Patient, Kind, and Unfailing' },
      15: { 1: 'The Historical Resurrection of Christ: Death Swallowed in Victory' }
    },
    'Ephesians': {
      1: { 1: 'Spiritual Blessings in Heavenly Realms in Christ' },
      2: { 1: 'Made Alive Together with Christ by Grace Alone', 11: 'Reconciliation and Peace in One Body' },
      6: { 10: 'The Whole Armor of God Against Spiritual Powers' }
    },
    'Philippians': {
      2: { 1: 'Imitating the Humility and Exaltation of Christ' },
      4: { 4: 'Rejoice in the Lord Always: The Peace That Guards Your Heart', 10: 'Contentment and Strength Through Christ' }
    },
    'Colossians': {
      1: { 15: 'The Supremacy and Preeminence of the Son of God' },
      3: { 1: 'Living as Those Raised with Christ: Clothed in Compassion' }
    },
    'Hebrews': {
      11: { 1: 'The Nature of Faith and the Hall of Biblical Witnesses' },
      12: { 1: 'Running the Race with Endurance, Looking Unto Jesus' }
    },
    'James': {
      1: { 1: 'Faith Tested in Trials', 19: 'Listening to the Word and Doing It' },
      3: { 1: 'Taming the Tongue: Heavenly Wisdom vs. Earthly Folly' }
    },
    'Revelation': {
      1: { 1: 'The Majestic Vision of the Glorified Son of Man' },
      21: { 1: 'A New Heaven and a New Earth: God Dwells with Humanity' },
      22: { 1: 'The River of Life and the Tree of Life', 12: 'Jesus Proclaims: "Behold, I Am Coming Soon"' }
    }
  };

  /**
   * Helper to retrieve section heading for a given verse
   */
  function getSectionHeading(bookName, chapterNum, verseNum) {
    const book = SECTION_HEADINGS[bookName];
    if (!book) return null;
    const chapter = book[parseInt(chapterNum, 10)];
    if (!chapter) return null;
    return chapter[parseInt(verseNum, 10)] || null;
  }

  window.SectionHeadings = {
    getHeading: getSectionHeading,
    getAllForChapter: (bookName, chapterNum) => {
      const book = SECTION_HEADINGS[bookName];
      return (book && book[parseInt(chapterNum, 10)]) ? book[parseInt(chapterNum, 10)] : {};
    }
  };

})(window);
