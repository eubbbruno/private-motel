import { site } from './site';
export function pageMetadata(title, description, path) {
  const fullTitle = title + ' | Private Motel';
  return {
    title, description, alternates: { canonical: path },
    openGraph: {
      title: fullTitle, description, url: site.url + path,
      type: 'website', locale: 'pt_BR', siteName: 'Private Motel',
      images: [{ url: '/images/suite-private.jpg', width: 2736, height: 1824, alt: 'Piscina e hidromassagem da Suíte Private' }],
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images: ['/images/suite-private.jpg'] },
  };
}
