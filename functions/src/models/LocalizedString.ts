import { LanguageCode } from "@/definitions/LanguageCode";

export type Translations = { [key in LanguageCode]?: string | null };

export const DEFAULT_LANGUAGE = LanguageCode.English;

/**
 * Implements a class for handling translations of strings from the database.
 * The database should store presentation strings in a map of language => value
 *
 * For backwards compatibility, the class accepts input to be a regular string
 * which will be assumed to be in `DEFAULT_LANGUAGE`.
 */
export class LocalizedString {
  /**
   * Constructor.
   *
   * @param {Translations | string} translation Translation string
   * @param {LanguageCode} [language] Defaults to `DEFAULT_LANGUAGE`
   */
  constructor(translation: Translations | string, language = DEFAULT_LANGUAGE) {
    this.language = language;
    if (typeof translation === "string") {
      this.translations = {
        [DEFAULT_LANGUAGE]: translation,
      };
    } else {
      this.translations = translation;
    }
  }

  readonly language: LanguageCode;
  readonly translations: Translations;

  /**
   * Get the translated string value from the languages that were provided
   */
  get translated(): string {
    return (
      this.translations[this.language] ??
      this.translations[DEFAULT_LANGUAGE] ??
      this.anyTranslation
    );
  }

  /**
   * Loop through the map of translations and try to find any non-empty
   * translation. This method is used to find any fallback value for when there
   * is no matching language otherwise.
   *
   * @return {string} First available translation
   */
  private get anyTranslation(): string {
    const availableLanguages = Object.keys(this.translations) as LanguageCode[];

    if (availableLanguages.length === 0) {
      throw new Error("No translations available");
    }

    const firstAvailableTranslation = availableLanguages
      .map((lang) => this.translations[lang])
      .find((translation) => !!translation);

    if (!firstAvailableTranslation) {
      throw new Error("Only empty translations in all languages");
    }

    return firstAvailableTranslation;
  }

  /**
   * Serialize to JSON for Firestore.
   *
   * @return {Translations} JSON representation of the localized string
   */
  toJson(): Translations {
    return this.translations;
  }
}
