import { pageMetadata } from '../../src/data/metadata';
import TermosUsoContent from './TermosUsoContent';

export const metadata = pageMetadata("Termos de Uso", "Consulte os termos de uso do site e dos serviços do Private Motel.", "/termos-uso");

export default function TermosUsoPage() {
  return <TermosUsoContent />;
}
