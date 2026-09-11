import Link from 'next/link';
import {PageShell,PageIntro} from '../src/components/Editorial';
export default function NotFound(){return <PageShell><PageIntro eyebrow="404" title="Vamos encontrar seu caminho." description="Esta página não está disponível. Continue explorando o Private."/><div className="wrap actions" style={{paddingBottom:100}}><Link className="button" href="/">Voltar à Home</Link><Link className="button-secondary" href="/suites">Conheça as suítes</Link></div></PageShell>;}
