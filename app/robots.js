import {site} from '../src/data/site';
export default function robots(){
  if(process.env.DASHBOARD_STANDALONE==='true') return {rules:{userAgent:'*',disallow:'/'}};
  return {rules:{userAgent:'*',allow:'/',disallow:['/admin/','/api/','/confirmacao']},sitemap:site.url+'/sitemap.xml'};
}
