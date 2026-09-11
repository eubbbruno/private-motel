import { pageMetadata } from '../../src/data/metadata';
import ReservasContent from './ReservasContent';

export const metadata = pageMetadata("Planeje sua reserva", "Escolha suíte, data e período no Private Motel em Cambé. Prepare sua mensagem e confirme disponibilidade e tarifa com a equipe pelo WhatsApp.", "/reservas");

export default function ReservasPage() {
  return <ReservasContent />;
}
