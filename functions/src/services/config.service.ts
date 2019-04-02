import { TanamConfig } from '../../../models';

let tanamConfig: TanamConfig;
export function setConfig(config: TanamConfig) {
    console.log(`[ConfigService:setConfig] ${JSON.stringify({ config })}`)
    tanamConfig = { ...config };
}

export function getPublicConfig(): TanamConfig {
    return !tanamConfig ? null : {
        firebaseApp: tanamConfig.firebaseApp,
        loginProviders: tanamConfig.loginProviders,
    } as TanamConfig;
}

export function getConfig(): TanamConfig {
    return !!tanamConfig ? { ...tanamConfig } : null;
}
