import {site} from '../src/data/site';
export default function robots(){return {rules:{userAgent:'*',allow:'/',disallow:['/admin/','/api/','/confirmacao']},sitemap:site.url+'/sitemap.xml'};}
