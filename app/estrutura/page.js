import { pageMetadata } from '../../src/data/metadata';
import EstruturaContent from './EstruturaContent';

export const metadata = pageMetadata("Estrutura", "Explore os ambientes e a estrutura do Private Motel em Cambé, na região de Londrina. Veja fotos e conheça os serviços.", "/estrutura");

export default function EstruturaPage() {
  return <EstruturaContent />;
}
