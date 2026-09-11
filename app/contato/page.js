import { pageMetadata } from '../../src/data/metadata';
import ContatoContent from './ContatoContent';

export const metadata = pageMetadata("Contato e localização", "Encontre o Private Motel na Rua Adelino Bianchini, 86, em Cambé. Veja telefone, WhatsApp e rotas pelo Google Maps e Waze.", "/contato");

export default function ContatoPage() {
  return <ContatoContent />;
}
