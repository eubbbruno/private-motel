import {site} from '../src/data/site';
export default function sitemap(){return ['','suites','cortesias','experiencias','estrutura','sobre-nos','promocoes','contato','reservas','politica-privacidade','termos-uso','lgpd','termos-whatsapp'].map(path=>({url:site.url+'/'+path,changeFrequency:path==='suites'||path==='promocoes'?'monthly':'yearly',priority:path===''?1:path==='suites'?.9:.6}));}
