/**
 * @type {import('next-i18next').UserConfig}
 */
module.exports = {
  // https://www.i18next.com/overview/configuration-options#logging
  debug: process.env.NODE_ENV === "development",
  i18n: {
    locales: ["en", "id"],
    defaultLocale: "en",
  },
  localePath: require("path").resolve("./locales"),
  reloadOnPrerender: process.env.NODE_ENV === "development",
};
