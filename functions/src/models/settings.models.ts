import { ITanamBase, TanamBase } from './base';

export interface ITanamSite extends ITanamBase {
  title: string;
  theme: string;
  defaultLanguage: string;
  languages: string[];
  isCustomDomain?: boolean;
  primaryDomain: string;
  domains: string[];
  analytics: string;
}

export class TanamSite extends TanamBase implements ITanamSite {
  title: string;
  theme: string;
  defaultLanguage: string;
  languages: string[];
  isCustomDomain: boolean;
  primaryDomain: string;
  domains: string[];
  analytics: string;

  constructor(json: ITanamSite) {
    super(json);
    this.title = json.title || json.id;
    this.theme = json.theme || 'default';
    this.defaultLanguage = json.defaultLanguage || 'en';
    this.languages = !!json.languages ? json.languages.slice() : [this.defaultLanguage];
    this.isCustomDomain = json.isCustomDomain === true;
    this.domains = !!json.domains ? json.domains.slice() : [json.primaryDomain];
    this.primaryDomain = json.primaryDomain || this.domains[0];
    this.analytics = json.analytics;
  }

  toJson() {
    return {
      ...super.toJson(),
      title: this.title || null,
      theme: this.theme,
      defaultLanguage: this.defaultLanguage,
      languages: this.languages.slice(),
      primaryDomain: this.primaryDomain || null,
      domains: this.domains.slice().filter(x => !!x),
      analytics: this.analytics || null,
    } as ITanamSite;
  }

  toString() {
    return `${TanamSite.name}(${this.id})`;
  }
}
