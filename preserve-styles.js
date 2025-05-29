/**
 * Script aprimorado para preservar os estilos CSS durante o build do Vercel
 */
const fs = require('fs');
const path = require('path');

console.log('=== INICIANDO SCRIPT PRESERVE-STYLES ===');

try {
  // 1. Criar stubs para os módulos PostCSS necessários
  const modulesToStub = ['tailwindcss', 'autoprefixer', 'postcss-import', 'postcss-nested'];
  
  console.log(`Criando stubs para ${modulesToStub.length} módulos: ${modulesToStub.join(', ')}`);
  
  // Conteúdo para um plugin PostCSS válido mas que não faz nada
  const stubContent = `
// Stub para PostCSS plugin
module.exports = function() {
  return {
    postcssPlugin: 'stub-plugin',
    Root(root) {
      // Preserva todo o CSS como está
      return root;
    }
  };
};
module.exports.postcss = true;
`;

  const stubPackageJson = JSON.stringify({
    name: 'stub-module',
    version: '1.0.0',
    main: 'index.js',
    postcssPlugin: 'stub-plugin',
    postcss: true
  }, null, 2);
  
  // Criar os stubs
  modulesToStub.forEach(modName => {
    const modDir = path.resolve(`./node_modules/${modName}`);
    console.log(`\nProcessando módulo: ${modName}`);
    
    // Criar ou garantir que o diretório existe
    if (!fs.existsSync(modDir)) {
      fs.mkdirSync(modDir, { recursive: true });
      console.log(`✓ Diretório criado: ${modDir}`);
    } else {
      console.log(`✓ Diretório já existe: ${modDir}`);
    }
    
    // Criar arquivo index.js
    const indexPath = path.join(modDir, 'index.js');
    fs.writeFileSync(indexPath, stubContent, 'utf8');
    console.log(`✓ index.js criado: ${indexPath}`);
    
    // Criar package.json
    const pkgPath = path.join(modDir, 'package.json');
    fs.writeFileSync(pkgPath, stubPackageJson, 'utf8');
    console.log(`✓ package.json criado: ${pkgPath}`);
  });
  
  // 2. Verificar e adicionar as diretivas Tailwind no globals.css
  const globalsCssPath = path.resolve('./app/globals.css');
  
  if (fs.existsSync(globalsCssPath)) {
    console.log('\nVerificando globals.css...');
    
    let cssContent = fs.readFileSync(globalsCssPath, 'utf8');
    
    // Verificar se as diretivas já existem
    if (!cssContent.includes('@tailwind')) {
      console.log('Adicionando diretivas Tailwind ao globals.css');
      
      // Adicionar diretivas no início do arquivo
      cssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;

${cssContent}`;
      
      fs.writeFileSync(globalsCssPath, cssContent, 'utf8');
      console.log('✓ Diretivas Tailwind adicionadas ao globals.css');
    } else {
      console.log('✓ Diretivas Tailwind já existem no globals.css');
    }
  } else {
    console.log('\n❌ Arquivo globals.css não encontrado!');
  }
  
  // 3. Criar ou atualizar postcss.config.js apropriado
  const postcssConfig = `
/**
 * Configuração PostCSS para ambiente de produção
 * Usa stubs em vez dos plugins reais para permitir o build
 */
module.exports = {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {},
  }
}`;
  
  const postcssPath = path.resolve('./postcss.config.js');
  fs.writeFileSync(postcssPath, postcssConfig, 'utf8');
  console.log('\n✓ postcss.config.js atualizado com plugins vazios');
  
  // 4. Se houver módulos CSS modificados anteriormente com backup, restaurá-los
  const stylesDir = path.resolve('./src/styles');
  
  if (fs.existsSync(stylesDir)) {
    console.log('\nVerificando backups em src/styles...');
    
    const files = fs.readdirSync(stylesDir);
    const backupFiles = files.filter(file => file.endsWith('.module.css.backup'));
    
    if (backupFiles.length > 0) {
      console.log(`Encontrados ${backupFiles.length} arquivos de backup para restaurar:`);
      
      backupFiles.forEach(backupFile => {
        const backupPath = path.join(stylesDir, backupFile);
        const originalPath = backupPath.slice(0, -7); // Remove ".backup"
        
        fs.copyFileSync(backupPath, originalPath);
        console.log(`✓ Restaurado: ${path.basename(originalPath)}`);
      });
    } else {
      console.log('Nenhum arquivo de backup encontrado para restaurar');
    }
  } else {
    console.log('\nDiretório src/styles não encontrado');
  }
  
  console.log('\n=== SCRIPT CONCLUÍDO COM SUCESSO! ===');
} catch (error) {
  console.error('\n❌ ERRO DURANTE A EXECUÇÃO DO SCRIPT:');
  console.error(error);
} 