
/**
 * Configuração PostCSS para ambiente de produção
 * Usa stubs em vez dos plugins reais para permitir o build
 */
module.exports = {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {},
  }
}