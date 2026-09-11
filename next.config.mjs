/** @type {import('next').NextConfig} */
const nextConfig = {
 reactStrictMode: true, output: 'standalone',
 images: { domains: ['privatemotel.com.br', 'www.privatemotel.com.br'] },
 async redirects() { return [
 {source:'/politica-de-privacidade',destination:'/politica-privacidade',permanent:true},
 {source:'/termos-de-uso',destination:'/termos-uso',permanent:true},
 {source:'/politica-de-cookies',destination:'/lgpd',permanent:true}]; }
};
export default nextConfig;
