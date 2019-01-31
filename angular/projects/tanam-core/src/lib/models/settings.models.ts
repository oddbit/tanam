
export interface SiteInfoSettings {
    title: string;
    theme: string;
    defaultLanguage: string;
    languages: string[];
}

export interface SiteDomainSettings {
    isCustomDomain: boolean;
    primaryDomain: string;
    domains: string[];
}
