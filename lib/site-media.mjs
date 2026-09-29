const numbered = (slug, label, count, category) => [
  { path: `/images/${slug}.jpg`, label, category },
  ...Array.from({ length: count }, (_, index) => ({ path: `/images/${slug}-${index + 1}.jpg`, label: `${label} — ${index + 1}`, category })),
];

export const mediaCategories = Object.freeze({
  private: 'Suíte Private', diamante: 'Diamante Luxo', prata: 'Suíte Prata', bronze: 'Suíte Bronze', gastronomia: 'Gastronomia', experiencias: 'Experiências', estrutura: 'Estrutura', promocoes: 'Promoções',
});

export const siteMedia = Object.freeze([
  ...numbered('suite-private', 'Suíte Private', 18, 'private'),
  ...numbered('suite-diamante-luxo', 'Diamante Luxo', 12, 'diamante'),
  ...numbered('suite-prata', 'Suíte Prata', 7, 'prata'),
  ...numbered('suite-bronze', 'Suíte Bronze', 8, 'bronze'),
  { path: '/images/cafe-manha.jpg', label: 'Café da manhã', category: 'gastronomia' },
  { path: '/images/almoco-executivo.jpg', label: 'Almoço executivo', category: 'gastronomia' },
  { path: '/images/cha-tarde.jpg', label: 'Chá da tarde', category: 'gastronomia' },
  { path: '/images/exp-decoracao-romantica.jpg', label: 'Decoração romântica', category: 'experiencias' },
  { path: '/images/exp-gift-card.jpg', label: 'Gift Card', category: 'experiencias' },
  { path: '/images/exp-jantar-romantico.jpg', label: 'Jantar romântico', category: 'experiencias' },
  { path: '/images/motel-entrada.jpg', label: 'Entrada do Private Motel', category: 'estrutura' },
  ...['0143','0148-Edit','0367_8_9','0370_1_2','0373_4_5','0376_7_8','0379_80_81','0386_7_8','0389_90_91','0392_3_4','0395_6_7','0398_399_400'].map((name, index) => ({ path: `/images/IMG_${name}.jpg`, label: `Private Motel — ambiente ${index + 1}`, category: 'estrutura' })),
  { path: '/images/promo-aniversariantes.jpg', label: 'Aniversariantes', category: 'promocoes' },
  { path: '/images/promo-recem-casados.jpg', label: 'Recém-casados', category: 'promocoes' },
  { path: '/images/promo-selinhos.jpg', label: 'Selinhos', category: 'promocoes' },
  { path: '/images/promo-story.jpg', label: 'Marque no Story', category: 'promocoes' },
]);

const sitePaths = new Set(siteMedia.map(item => item.path));
export const isSiteMediaPath = value => typeof value === 'string' && sitePaths.has(value);
