(function (WB) {
  "use strict";

  // Word tiers by difficulty. Level N draws mostly from tier N, and the last
  // tier is reused once the levels run past it.
  const tiers = [
    // Tier 1: 3-4 letters
    `cat dog run jump play red blue stop fast big tiny eat food hot cold sun
     moon star hat bat rat mat sit fit pig hen cow fox bee ant owl bug cup
     pen box key map net jar ink ice fire wind rain snow leaf tree rock sand
     wave fish bird frog duck goat lamb wolf bear lion deer milk cake rice
     soup egg nut pie tea zoo van bus car jet ship boat road path gate door
     wall roof lamp desk bed rug toy kite ball drum song game book page word
     quiz yarn vest zip oak yak urn`,

    // Tier 2: 5 letters
    `apple beach chair dance eagle flame grape house image juice knife lemon
     music night ocean piano queen river smile table uncle voice water youth
     zebra brave cloud dream earth field ghost heart index jelly koala light
     magic north olive paint quick robot storm tiger ultra vivid whale xenon
     yacht alien blast comet delta ember frost glide hover ivory joker karma
     laser metal nerve orbit pulse quake radar solar track unity vapor wreck
     amber bloom crisp dwarf elbow fable giant honey input jumbo`,

    // Tier 3: 6 letters
    `anchor bridge castle desert engine forest garden hammer island jungle
     kitten ladder market napkin orange planet quartz rocket silver tunnel
     update valley window yellow zipper beacon cosmic dragon 
     falcon galaxy hunter impact jigsaw kernel legend meteor nebula oxygen
     photon quasar rescue signal target urgent vector wizard zenith absorb
     breeze candle escape finger glider harbor insect jacket kidney
     launch magnet nature object pirate rabbit shadow throne unique violet
     walrus yogurt`,

    // Tier 4: 7 letters
    `amazing balance capture diamond elegant fantasy gravity harmony imagine
     journey kingdom lantern machine network obscure pioneer quantum rainbow
     station thunder upgrade venture whisper zealous android blaster captain
     defense element fighter glacier horizon impulse justice kinetic landing
     mission neutron outpost phantom quarter reactor shuttle trigger unknown
     volcano warrior younger academy battery chamber digital
     emerald freedom general habitat insight jackpot keynote library mineral`,

    // Tier 5: 8 letters
    `absolute backbone calendar daylight electric firewall generate hardware
     infinite junction keyboard language magnetic navigate obstacle parallel
     question recharge sequence terminal universe velocity waveform yearbook
     zodiacal abundant blockade cardinal dominion engineer fragment guardian
     heritage ignition jeopardy knockout launcher momentum notebook operator
     particle quadrant radiance teleport umbrella vanguard wormhole
     airborne boundary computer distance exterior frontier graphics hologram`,

    // Tier 6: 9 letters
    `adventure beautiful celebrate dangerous education fantastic generator
     happiness important jellyfish knowledge lightning mechanism necessary
     operation passenger quicksand radiation satellite telescope underline
     vibration waterfall xylophone yesterday zookeeper abduction blueprint
     collision detective elevation firepower gyroscope hurricane intercept
     jailbreak kilometer labyrinth moonlight nightfall overdrive propeller
     quarterly reflector spaceship turbulent ultimatum vengeance wavefront frequency quadruple supernova`,

    // Tier 7: 10-11 letters
    `accelerate background calculator dictionary earthquake foundation
     generation helicopter illuminate journalist leadership
     management navigation observatory particular quarantine revolution
     skateboard technology understand vocabulary watermelon atmosphere
     battleship centrifuge detonation expedition gravitation
     hypothesis instrument jubilation kingfisher locomotive microscope
     nightmarish outlandish projectile resistance 
     trajectory ultraviolet volleyball wilderness yesteryear zoological`,

    // Tier 8: 12+ letters
    `acceleration breakthrough civilization determination electromagnetic
     extraterrestrial fortification gravitational headquarters illumination
     jurisdiction kindergarten laboratories magnification neighborhood
     organization precipitation quantification reconstruction specification
     transformation uncomfortable vulnerability weightlessness astrophysics
     bioluminescence constellation disintegration experimental fluorescence
     geosynchronous hallucination interplanetary knowledgeable manufacturing
     nevertheless overwhelming parallelogram questionnaire refrigerator
     superconductor thermodynamics unpredictable ventriloquist kaleidoscope`,
  ];

  WB.wordLists = tiers.map((tier) => [
    ...new Set(tier.split(/\s+/).filter(Boolean)),
  ]);

  // Typed one word at a time to bring down a boss.
  WB.bossPhrases = [
    "the quick brown fox jumps over the lazy dog",
    "all systems are failing brace for final impact",
    "never underestimate the power of a steady hand",
    "stars burn bright before they collapse into darkness",
    "type fast think faster and hold the line",
    "every word you finish brings the fleet closer home",
    "silence falls across the void as engines ignite",
    "only the calm survive when the sky is falling",
    "gravity always wins unless you are quick enough",
    "defend the earth one letter at a time",
    "the invasion ends when the last planet shatters",
    "courage is typing straight while alarms are screaming",
  ].map((phrase) => phrase.split(" "));
})((window.WordBlast = window.WordBlast || {}));
