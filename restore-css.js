/**
 * Script para restaurar os arquivos CSS Module a partir dos backups
 */
const fs = require('fs');
const path = require('path');

console.log('Iniciando restauração dos arquivos CSS...');

try {
  // Verificar e restaurar arquivos em src/styles
  const stylesDir = path.resolve('./src/styles');
  
  if (fs.existsSync(stylesDir)) {
    console.log('Verificando backups no diretório:', stylesDir);
    
    // Listar todos os arquivos no diretório
    const files = fs.readdirSync(stylesDir);
    
    // Filtrar apenas os arquivos de backup
    const backupFiles = files.filter(file => file.endsWith('.module.css.backup'));
    
    if (backupFiles.length > 0) {
      console.log(`Encontrados ${backupFiles.length} arquivos de backup para restaurar.`);
      
      // Para cada arquivo de backup, restaurar o original
      backupFiles.forEach(backupFile => {
        // Caminho completo para o arquivo de backup
        const backupPath = path.join(stylesDir, backupFile);
        
        // Caminho para o arquivo original (sem o .backup)
        const originalPath = backupPath.slice(0, -7); // Remove ".backup"
        
        try {
          // Copiar o conteúdo do backup para o original
          fs.copyFileSync(backupPath, originalPath);
          console.log(`Arquivo restaurado: ${path.basename(originalPath)}`);
        } catch (err) {
          console.error(`Erro ao restaurar ${path.basename(originalPath)}:`, err);
        }
      });
    } else {
      console.log('Nenhum arquivo de backup encontrado para restaurar.');
    }
  } else {
    console.log('Diretório de estilos não encontrado:', stylesDir);
  }
  
  console.log('Restauração concluída!');
} catch (error) {
  console.error('Erro durante a restauração dos arquivos CSS:');
  console.error(error);
} 