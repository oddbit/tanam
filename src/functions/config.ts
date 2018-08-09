interface BuildConfig {
  publicPath: string;
}

interface NuxtConfig {
  dev: boolean;
  buildDir: string;
  build: BuildConfig;
}

export interface BaseConfig {
  isNuxt?: boolean;
  themeDir?: string;
  adminDir?: string;
  adminUrl?: string;
  nuxtConfig?: NuxtConfig;
}

class TanamConfig {
  public configuration: BaseConfig;

  constructor(baseConfig: BaseConfig) {
    const defaultThemeDir = './node_modules/tanam/dist/theme';
    this.configuration = {
      isNuxt: true,
      themeDir: defaultThemeDir,
      adminDir: './node_modules/tanam/dist/admin_client/',
      adminUrl: 'admin',
      nuxtConfig: {
        dev: false,
        buildDir: defaultThemeDir,
        build: {
          publicPath: '/assets/'
        }
      },
      ...baseConfig
    }
  };
}

export default TanamConfig;
