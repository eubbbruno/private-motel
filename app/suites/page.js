import { pageMetadata } from '../../src/data/metadata';
import SuitesContent from './SuitesContent';
import { currentBusinessDate } from '../../src/data/tariffs';

export const metadata = pageMetadata("Suítes em Cambé e Londrina", "Conheça as suítes Private, Diamante Luxo, Prata e Bronze. Veja fotos, comodidades e condições de estadia no Private Motel em Cambé.", "/suites");
export const dynamic = 'force-dynamic';

export default function SuitesPage() {
  return <SuitesContent rateDate={currentBusinessDate()} />;
}
