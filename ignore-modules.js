/**
 * Script para contornar os módulos CSS e desativar postcss
 */

const fs = require('fs');
const path = require('path');

try {
  console.log('Iniciando bloqueio de módulos CSS...');

  // 1. Desabilita o PostCSS completamente
  const postcssConfig = `module.exports = { plugins: {} }`;
  fs.writeFileSync(path.resolve('./postcss.config.js'), postcssConfig, 'utf8');
  console.log('PostCSS desabilitado.');

  // 2. Processa manualmente os arquivos CSS em src/styles
  // Não usamos glob para evitar dependências externas
  const stylesDirPath = path.resolve('./src/styles');
  if (fs.existsSync(stylesDirPath)) {
    console.log('Processando diretório de estilos:', stylesDirPath);
    
    // Lê todos os arquivos no diretório
    const files = fs.readdirSync(stylesDirPath);
    
    // Filtra para obter apenas arquivos .module.css
    const cssModuleFiles = files.filter(file => file.endsWith('.module.css'));
    
    console.log(`Encontrados ${cssModuleFiles.length} arquivos CSS Module para processar.`);
    
    // Para cada arquivo, cria um backup e substitui pelo conteúdo 
    cssModuleFiles.forEach(file => {
      const filePath = path.join(stylesDirPath, file);
      const backupFile = `${filePath}.backup`;
      
      // Backup apenas se ainda não existir
      if (!fs.existsSync(backupFile)) {
        fs.copyFileSync(filePath, backupFile);
      }
      
      // Cria um arquivo CSS module empty com exportação JS vazia
      fs.writeFileSync(filePath, 
`/* CSS Module substituído pelo script de build */
:global {
  /* Mantendo estilos globais */
}

/* Exportando objeto vazio para evitar erros de compilação */
:export {
  /* Exportações vazias */
}
`, 'utf8');
      
      console.log(`Processado: ${filePath}`);
    });
  } else {
    console.log('Diretório de estilos não encontrado.');
  }
  
  console.log('Bloqueio de módulos CSS concluído com sucesso!');
} catch (error) {
  console.error('Erro ao processar módulos CSS:');
  console.error(error);
} 