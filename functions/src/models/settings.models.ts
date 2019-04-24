
export interface SiteInformation {
    id: string;
    title: string;
    theme: string;
    defaultLanguage: string;
    languages: string[];
    isCustomDomain: boolean;
    primaryDomain: string;
    domains: string[];
}
