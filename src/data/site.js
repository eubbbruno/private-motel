export const site = {
 url: 'https://www.privatemotel.com.br', whatsapp: '5543999936839', phone: '+554331746600',
 phoneLabel: '(43) 3174-6600', whatsappLabel: '(43) 99993-6839', email: 'contato@privatemotel.com.br',
 address: 'Rua Adelino Bianchini, 86 — Cambé, PR', instagram: 'https://instagram.com/private_motel', facebook: 'https://facebook.com/privatemotel',
 maps: 'https://www.google.com/maps/place/Rua+Adelino+Bianchini,+86+-+Camb%C3%A9,+PR',
 waze: 'https://ul.waze.com/ul?ll=-23.2769073,-51.2720431&navigate=yes&address=Rua+Adelino+Bianchini,+86,+Cambe,+PR',
 // Place the real PDF at public/cardapio.pdf. Do not generate menu contents.
 menuPdf: '/cardapio.pdf'
};
export const reservationMessage = 'Olá! Gostaria de fazer uma reserva no Private Motel.';
export function whatsappUrl(message = reservationMessage) { return 'https://wa.me/' + site.whatsapp + '?text=' + encodeURIComponent(message); }
export const navigation = [['Home','/'],['Suítes','/suites'],['Cortesias','/cortesias'],['Experiências','/experiencias'],['Estrutura','/estrutura'],['Contato','/contato']];
