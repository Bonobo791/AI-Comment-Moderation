import sharp from 'sharp';
await sharp('public/social-card.svg').png().toFile('public/social-card.png');
console.log('Rendered original social-card SVG to a 1200×630 PNG');
