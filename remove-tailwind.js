const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Remover arquivos de configuração do Tailwind
try {
  console.log('Removendo configurações do Tailwind...');
  
  const files = [
    'tailwind.config.js',
    'postcss.config.js'
  ];
  
  files.forEach(file => {
    const filePath = path.resolve(file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Arquivo ${file} removido com sucesso.`);
    } else {
      console.log(`Arquivo ${file} não encontrado.`);
    }
  });
  
  // Remover referências ao Tailwind no CSS global
  const globalCssPath = path.resolve('./app/globals.css');
  if (fs.existsSync(globalCssPath)) {
    let content = fs.readFileSync(globalCssPath, 'utf8');
    
    // Remover diretivas do Tailwind
    content = content.replace(/@tailwind.*?;/g, '');
    content = content.replace(/@layer.*?}/gs, '');
    
    fs.writeFileSync(globalCssPath, content, 'utf8');
    console.log('Referências ao Tailwind removidas do CSS global.');
  }
  
  // Desinstalar pacotes do Tailwind
  console.log('Desinstalando pacotes do Tailwind...');
  execSync('npm uninstall tailwindcss postcss autoprefixer', { stdio: 'inherit' });
  
  console.log('Tailwind removido com sucesso!');
  
} catch (error) {
  console.error('Erro ao remover o Tailwind:');
  console.error(error);
} 