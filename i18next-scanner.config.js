module.exports = {
    input: ['src/**/*.{js,jsx,ts,tsx}'], // Caminho dos arquivos onde os textos serão detectados
    output: './public/locales', // Onde salvar as traduções
    options: {
      lngs: ['en', 'pt'], // Idiomas suportados
      defaultLng: 'en', // Idioma padrão
      resource: {
        loadPath: './public/locales/{{lng}}/{{ns}}.json',
        savePath: './public/locales/{{lng}}/{{ns}}.json',
      },
      keySeparator: false, // Permitir textos completos como chaves
      nsSeparator: false,
    },
  };
