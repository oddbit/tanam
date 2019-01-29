
export interface SiteInfoSettings {
    title: string;
    pageTitleFormat: string;
    theme: string;
    defaultLanguage: string;
    languages: string[];
}

export interface SiteDomainSettings {
    isCustomDomain: boolean;
    primaryDomain: string;
    domains: string[];
}
