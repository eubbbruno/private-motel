import { pageMetadata } from '../../src/data/metadata';
import PoliticaPrivacidadeContent from './PoliticaPrivacidadeContent';

export const metadata = pageMetadata("Política de Privacidade", "Conheça a política de privacidade do Private Motel e as informações sobre o tratamento de dados pessoais.", "/politica-privacidade");

export default function PoliticaPrivacidadePage() {
  return <PoliticaPrivacidadeContent />;
}
