// map_points are polygon coordinates on the plaza map (viewBox 0 0 1000.32 500),
// so the clickable map on the home page is driven entirely by the database.
const locations = [
    {
        slug: 'nebula-arcade',
        name: 'The Nebula Arcade',
        tagline: 'Retro cabinets, esports, and late-night game jams',
        description: 'Twin glass pods on the west side of the plaza packed with arcade cabinets, LAN stations, and a tournament stage.',
        address: '1 Nebula Way',
        city: 'UnityGrid',
        state: 'CA',
        zip: '94010',
        image: '/locations/nebula-arcade.jpg',
        map_points: '2.97,234.52 17.94,198.9 34.45,188.58 52.52,191.68 56.65,196.32 69.03,162.26 84,137.48 103.61,121.48 126.32,109.61 154.71,125.61 175.87,149.87 189.81,176.71 199.61,206.13 205.81,229.35 210.45,243.81 206.84,272.19 214.58,285.1 214.58,302.13 203.74,334.13 194.45,351.68 205.29,366.65 132.52,366.65 159.35,391.42 155.74,399.68 119.61,399.68 86.06,399.68 62.84,399.68 25.16,399.68 0,397.61'
    },
    {
        slug: 'spire-amphitheater',
        name: 'Spire Amphitheater',
        tagline: 'Live music and performances under the tallest tower in the city',
        description: 'The open-air stage at the foot of the Spire hosts concerts, open mics, and festival nights for the whole plaza.',
        address: '100 Spire Plaza',
        city: 'UnityGrid',
        state: 'CA',
        zip: '94011',
        image: '/locations/spire-amphitheater.jpg',
        map_points: '358.58,353.74 376.65,322.77 389.55,314.52 384.39,280.45 407.61,272.19 422.06,220.58 438.58,126.65 449.42,38.39 457.68,16.71 468,35.81 474.19,103.42 491.74,203.03 508.26,261.87 517.03,281.48 517.03,214.9 529.42,194.26 540.77,197.35 540.77,169.48 552.13,167.94 556.77,149.87 566.06,156.06 566.06,193.74 577.42,211.81 577.42,238.65 601.16,254.65 594.45,302.13 575.87,335.68 587.23,353.74 601.16,363.55 358.58,363.55'
    },
    {
        slug: 'verdant-commons',
        name: 'Verdant Commons',
        tagline: 'Sky gardens, wellness classes, and the weekend market',
        description: 'A vertical garden tower on the east side where neighbors grow food, stretch, and trade at the open-air market.',
        address: '250 Garden Terrace',
        city: 'UnityGrid',
        state: 'CA',
        zip: '94012',
        image: '/locations/verdant-commons.jpg',
        map_points: '998.06,83.81 952.65,31.16 914.45,16.71 877.29,43.55 833.94,102.39 811.74,161.23 796.77,241.23 802.97,303.16 833.94,353.23 871.61,385.23 954.71,385.23 1000.32,387.81'
    },
    {
        slug: 'prism-dome',
        name: 'Prism Dome Lab',
        tagline: 'Makers, coders, and stargazers under the geodesic glass',
        description: 'The crystal dome is the plaza\'s makerspace and observatory: hackathons, robotics nights, and astronomy talks.',
        address: '42 Prism Circle',
        city: 'UnityGrid',
        state: 'CA',
        zip: '94013',
        image: '/locations/prism-dome.jpg',
        map_points: '625,291 615,305 608,318 625,338 637,354 622.5,358 673,363.5 751,363.5 793,363.5 769,352 772,347 793,340 806,321 796.8,291 784,269 757,261 730,272 707,281 672,283'
    }
]

export default locations
