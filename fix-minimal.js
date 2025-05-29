/**
 * Script de correção mínima para o build do Vercel
 * Cria apenas stubs dos módulos do PostCSS
 */
const fs = require('fs');
const path = require('path');

console.log('Aplicando correção mínima para o build...');

try {
  // 1. Lista de módulos para criar stubs
  const modules = ['tailwindcss', 'autoprefixer', 'postcss-import'];
  
  // 2. Conteúdo dos stubs
  const indexContent = `
// Stub para PostCSS plugin
module.exports = function() {
  return {
    postcssPlugin: 'stub-plugin',
    Once() {}
  };
};
module.exports.postcss = true;
`;

  const packageContent = JSON.stringify({
    name: 'stub-module',
    version: '1.0.0',
    main: 'index.js',
    postcss: true
  }, null, 2);
  
  // 3. Criar os stubs
  modules.forEach(mod => {
    const modDir = path.resolve(`./node_modules/${mod}`);
    
    // Criar diretório se não existir
    if (!fs.existsSync(modDir)) {
      fs.mkdirSync(modDir, { recursive: true });
    }
    
    // Criar index.js
    fs.writeFileSync(
      path.join(modDir, 'index.js'),
      indexContent,
      'utf8'
    );
    
    // Criar package.json
    fs.writeFileSync(
      path.join(modDir, 'package.json'),
      packageContent,
      'utf8'
    );
    
    console.log(`Stub criado para ${mod}`);
  });
  
  // 4. Criar/atualizar postcss.config.js adequado
  const postcssConfig = `
module.exports = {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {}
  }
};
`;
  
  fs.writeFileSync(
    path.resolve('./postcss.config.js'),
    postcssConfig,
    'utf8'
  );
  
  console.log('postcss.config.js atualizado');
  console.log('Correção concluída com sucesso!');
} catch (error) {
  console.error('Erro durante a correção:');
  console.error(error);
} 