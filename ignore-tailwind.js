const fs = require('fs');
const path = require('path');

try {
  console.log('Criando arquivos de configuração vazios do Tailwind...');
  
  // Criar arquivo tailwind.config.js vazio
  const tailwindConfig = 
`module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}`;
  
  fs.writeFileSync(path.resolve('./tailwind.config.js'), tailwindConfig, 'utf8');
  console.log('tailwind.config.js criado com sucesso.');
  
  // Criar arquivo postcss.config.js vazio
  const postcssConfig = 
`module.exports = {
  plugins: {},
}`;
  
  fs.writeFileSync(path.resolve('./postcss.config.js'), postcssConfig, 'utf8');
  console.log('postcss.config.js criado com sucesso.');
  
  // Limpar o CSS global
  const globalCssPath = path.resolve('./app/globals.css');
  if (fs.existsSync(globalCssPath)) {
    let content = fs.readFileSync(globalCssPath, 'utf8');
    
    // Remover completamente as diretivas do Tailwind
    content = content.replace(/@tailwind.*?;/g, '');
    
    // Remover completamente o bloco @layer
    content = content.replace(/@layer\s+components\s*{[\s\S]*?}/, '');
    
    // Substituir por CSS normal equivalente
    const basicCss = `
:root {
  --primary-color: #FF4B91;
  --secondary-color: #FFB6C1;
  --accent-color: #FF1493;
  --background-light: #F8F9FA;
  --text-dark: #333333;
  --text-gray: #6C757D;
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
  scroll-behavior: smooth;
}

body {
  color: var(--text-dark);
  background: var(--background-light);
  font-family: 'Montserrat', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

section, div, header, footer, main {
  max-width: 100%;
  overflow-x: hidden;
}

iframe {
  max-width: 100%;
}

/* Estilos de componentes básicos */
.btn-primary {
  background-color: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: opacity 300ms;
}
.btn-primary:hover {
  opacity: 0.9;
}

.btn-secondary {
  background-color: var(--secondary-color);
  color: var(--text-dark);
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: opacity 300ms;
}
.btn-secondary:hover {
  opacity: 0.9;
}

.container-custom {
  width: 100%;
  max-width: 72rem;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}
@media (min-width: 640px) {
  .container-custom {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

.section-padding {
  padding-top: 3rem;
  padding-bottom: 3rem;
}
@media (min-width: 768px) {
  .section-padding {
    padding-top: 4rem;
    padding-bottom: 4rem;
  }
}
@media (min-width: 1024px) {
  .section-padding {
    padding-top: 5rem;
    padding-bottom: 5rem;
  }
}

.card-hover {
  transition: box-shadow 300ms;
}
.card-hover:hover {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
}
`;
    
    // Escrever o CSS limpo no arquivo
    fs.writeFileSync(globalCssPath, basicCss, 'utf8');
    console.log('Arquivo globals.css reescrito com CSS normal.');
  }
  
  console.log('Feito!');
  
} catch (error) {
  console.error('Erro:');
  console.error(error);
} 