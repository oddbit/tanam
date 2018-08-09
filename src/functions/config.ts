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
  public nuxtConfig: NuxtConfig;

  constructor(baseConfig: BaseConfig) {
    const defaultThemeDir = '../node_modules/tanam/dist/theme';
    this.configuration = {
      isNuxt: true,
      adminDir: '../node_modules/tanam/dist/admin_client/',
      adminUrl: 'admin',
      ...baseConfig
    };

    this.nuxtConfig = {
      dev: false,
      buildDir: defaultThemeDir,
      build: {
        publicPath: '/assets/'
      },
      ...baseConfig.nuxtConfig
    };

  }
}

export default TanamConfig;
