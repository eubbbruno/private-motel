import { pageMetadata } from '../../src/data/metadata';
import ExperienciasContent from './ExperienciasContent';

export const metadata = pageMetadata("Experiências a dois", "Conheça a decoração romântica, o Gift Card e as experiências do Private Motel em Cambé. Consulte condições com nossa equipe.", "/experiencias");

export default function ExperienciasPage() {
  return <ExperienciasContent />;
}
