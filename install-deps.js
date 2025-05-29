const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Função para executar comandos e mostrar output
function runCommand(command) {
  try {
    console.log(`Executando: ${command}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Erro ao executar: ${command}`);
    console.error(error.message);
    return false;
  }
}

// Verificar se o tailwindcss está instalado
try {
  console.log('Verificando instalação do Tailwind CSS...');
  const modulePath = path.resolve('./node_modules/tailwindcss');
  
  if (!fs.existsSync(modulePath)) {
    console.log('Tailwind CSS não encontrado, instalando...');
    runCommand('npm install -D tailwindcss@3.3.0 postcss@8.4.23 autoprefixer@10.4.14 --legacy-peer-deps');
    
    // Verificar se foi instalado corretamente
    if (!fs.existsSync(modulePath)) {
      console.error('Falha ao instalar Tailwind CSS. Tentando método alternativo...');
      runCommand('npx tailwindcss@3.3.0 init -p');
    } else {
      console.log('Tailwind CSS instalado com sucesso!');
    }
  } else {
    console.log('Tailwind CSS já está instalado.');
  }
  
  // Garantir que o arquivo de configuração existe
  const configPath = path.resolve('./tailwind.config.js');
  if (!fs.existsSync(configPath)) {
    console.log('Criando arquivo tailwind.config.js...');
    fs.writeFileSync(
      configPath,
      `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF4B91',
        secondary: '#FFB6C1',
        accent: '#FF1493',
        dark: '#333333',
        light: '#F8F9FA',
        'gray-light': '#E9ECEF',
        'gray-dark': '#6C757D',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 10px 15px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}`
    );
    console.log('Arquivo tailwind.config.js criado com sucesso!');
  }
  
  // Garantir que o arquivo postcss.config.js existe
  const postcssPath = path.resolve('./postcss.config.js');
  if (!fs.existsSync(postcssPath)) {
    console.log('Criando arquivo postcss.config.js...');
    fs.writeFileSync(
      postcssPath,
      `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`
    );
    console.log('Arquivo postcss.config.js criado com sucesso!');
  }
  
  console.log('Tudo pronto para o build!');
  
} catch (error) {
  console.error('Erro ao verificar/instalar dependências:');
  console.error(error);
  process.exit(1);
} 