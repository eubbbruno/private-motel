import {Playfair_Display,Manrope} from 'next/font/google';
import './globals.css';
const playfair=Playfair_Display({subsets:['latin'],weight:['400','500','600'],style:['normal','italic'],variable:'--font-playfair',display:'swap'});
const manrope=Manrope({subsets:['latin'],variable:'--font-manrope',display:'swap'});
const title='Private Motel 5 Estrelas | Suítes em Londrina e Cambé';
const description='Privacidade, conforto e experiências a dois. Conheça as suítes do Private Motel em Cambé e Londrina, com piscina aquecida, hidromassagem e gastronomia.';
export const metadata={metadataBase:new URL('https://www.privatemotel.com.br'),title:{default:title,template:'%s | Private Motel'},description,robots:{index:true,follow:true},openGraph:{title,description,url:'https://www.privatemotel.com.br',type:'website',locale:'pt_BR',siteName:'Private Motel',images:[{url:'/images/suite-private.jpg',width:2736,height:1824,alt:'Piscina e hidromassagem da Suíte Private'}]},twitter:{card:'summary_large_image',title,description,images:['/images/suite-private.jpg']},icons:{icon:[{url:'/images/logos/favicon.ico'},{url:'/images/logos/favicon-32x32.png',sizes:'32x32',type:'image/png'}],apple:'/images/logos/apple-touch-icon.png'},manifest:'/images/logos/site.webmanifest'};
export const viewport={width:'device-width',initialScale:1,themeColor:'#050505'};
export default function RootLayout({children}){return <html lang="pt-BR"><body className={playfair.variable+' '+manrope.variable}>{children}</body></html>;}
