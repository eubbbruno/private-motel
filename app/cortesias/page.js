import { pageMetadata } from '../../src/data/metadata';
import CortesiasContent from './CortesiasContent';

export const metadata = pageMetadata("Cortesias", "Confira café da manhã, almoço executivo e chá da tarde do Private Motel em Cambé, com horários e condições de cada cortesia.", "/cortesias");

export default function CortesiasPage() {
  return <CortesiasContent />;
}
