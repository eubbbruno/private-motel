import { pageMetadata } from '../../src/data/metadata';
import LgpdContent from './LgpdContent';

export const metadata = pageMetadata("LGPD e cookies", "Saiba mais sobre seus direitos, dados pessoais e cookies no site do Private Motel.", "/lgpd");

export default function LgpdPage() {
  return <LgpdContent />;
}
