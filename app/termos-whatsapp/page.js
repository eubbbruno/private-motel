import { pageMetadata } from '../../src/data/metadata';
import TermosWhatsappContent from './TermosWhatsappContent';

export const metadata = pageMetadata("Termos do atendimento por WhatsApp", "Consulte os termos do atendimento por WhatsApp do Private Motel e as informações sobre o uso de dados.", "/termos-whatsapp");

export default function TermosWhatsappPage() {
  return <TermosWhatsappContent />;
}

