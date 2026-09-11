import { pageMetadata } from '../../src/data/metadata';
import SobreNosContent from './SobreNosContent';

export const metadata = pageMetadata("Sobre o Private", "Conheça o Private Motel em Cambé, na região de Londrina: privacidade, conforto e hospitalidade para seus momentos a dois.", "/sobre-nos");

export default function SobreNosPage() {
  return <SobreNosContent />;
}
