import { pageMetadata } from '../../src/data/metadata';
import PromocoesContent from './PromocoesContent';

export const metadata = pageMetadata("Promoções", "Consulte as promoções e condições do Private Motel em Cambé. Fale com nossa equipe para conferir disponibilidade.", "/promocoes");

export default function PromocoesPage() {
  return <PromocoesContent />;
} 
