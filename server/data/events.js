// Event times are stored relative to when the database is reset (days_from_now + hour),
// so a fresh reset always yields a mix of past and upcoming events for the countdowns.
const img = (id) => `https://images.unsplash.com/photo-${id}?w=700&q=70&auto=format&fit=crop`

const events = [
    // The Nebula Arcade
    { location: 'nebula-arcade', title: 'Retro Speedrun Night', category: 'Gaming', days_from_now: -6, hour: 19,
      description: 'Classic cartridges, a big-screen timer, and bragging rights for the fastest any% run.', image: img('1550745165-9bc0b252726f') },
    { location: 'nebula-arcade', title: 'Plaza Esports Cup: Finals', category: 'Esports', days_from_now: 2, hour: 18,
      description: 'The top eight teams from the fall league battle it out live on the main stage.', image: img('1542751371-adc38448a05e') },
    { location: 'nebula-arcade', title: '48-Hour Game Jam Kickoff', category: 'Game Dev', days_from_now: 9, hour: 17,
      description: 'Form a team, get the secret theme, and ship a playable game by Sunday night.', image: img('1511512578047-dfb367046420') },
    { location: 'nebula-arcade', title: 'Couch Co-op Social', category: 'Gaming', days_from_now: 16, hour: 20,
      description: 'Split-screen classics, snacks, and new friends. Controllers provided.', image: img('1493711662062-fa541adb3fc8') },

    // Spire Amphitheater
    { location: 'spire-amphitheater', title: 'Neon Synthwave Showcase', category: 'Music', days_from_now: -3, hour: 21,
      description: 'Four synth acts light up the Spire with retro-future soundscapes.', image: img('1514525253161-7a46d19cd819') },
    { location: 'spire-amphitheater', title: 'Community Open Mic', category: 'Performance', days_from_now: 1, hour: 19,
      description: 'Songs, poems, and stand-up — sign up at the door for a five-minute slot.', image: img('1459749411175-04bf5292ceea') },
    { location: 'spire-amphitheater', title: 'Skyline Summer Fest Preview', category: 'Festival', days_from_now: 12, hour: 16,
      description: 'A sneak peek at next season\'s headliners plus food trucks around the plaza.', image: img('1506157786151-b8491531f063') },
    { location: 'spire-amphitheater', title: 'Lights Over the Spire', category: 'Music', days_from_now: 24, hour: 20,
      description: 'An orchestral night with a choreographed light show on the tower.', image: img('1470229722913-7c0e2dbbafd3') },

    // Verdant Commons
    { location: 'verdant-commons', title: 'Sunrise Sky-Garden Yoga', category: 'Wellness', days_from_now: -1, hour: 7,
      description: 'An all-levels flow on the garden terrace as the sun comes up over the plaza.', image: img('1544367567-0f2fcb009e0b') },
    { location: 'verdant-commons', title: 'Weekend Farmers Market', category: 'Market', days_from_now: 3, hour: 9,
      description: 'Produce grown in the tower gardens, local bakers, and live acoustic sets.', image: img('1488459716781-31db52582fe9') },
    { location: 'verdant-commons', title: 'Seed Swap & Planting Workshop', category: 'Gardening', days_from_now: 7, hour: 11,
      description: 'Bring seeds, take seeds, and learn how to start a balcony herb garden.', image: img('1416879595882-3373a0480b5b') },
    { location: 'verdant-commons', title: 'Mindful Evening Meditation', category: 'Wellness', days_from_now: 14, hour: 18,
      description: 'A guided session in the quiet room on the top garden level.', image: img('1506126613408-eca07ce68773') },

    // Prism Dome Lab
    { location: 'prism-dome', title: 'Intro to Robotics Night', category: 'Maker', days_from_now: -9, hour: 18,
      description: 'Build and program a tiny line-following robot to take home.', image: img('1485827404703-89b55fcc595e') },
    { location: 'prism-dome', title: 'Stargazing Under the Dome', category: 'Astronomy', days_from_now: -2, hour: 21,
      description: 'The dome roof opens for telescope time and a talk on the winter sky.', image: img('1419242902214-272b3f66ee7a') },
    { location: 'prism-dome', title: 'Civic Hackathon', category: 'Tech', days_from_now: 5, hour: 10,
      description: 'Build tools that make UnityGrid better — mentors, prizes, and pizza included.', image: img('1504384308090-c894fdcc538d') },
    { location: 'prism-dome', title: 'Future of Cities Talk', category: 'Talk', days_from_now: 19, hour: 18,
      description: 'Urban designers on how plazas like ours shape the way communities meet.', image: img('1540575467063-178a50c2df87') }
]

export default events
