import format from 'date-fns/format';

const parseTitle = str => str.replace(/\s+/g, '-').toLowerCase();

const generatePermalink = title => {
  return `${format(new Date(), 'YYMMDD')}-${parseTitle(title)}`;
};

const generateFeaturedImageName = title => {
  return `/content/images/featured-${generatePermalink(title)}.jpg`;
};

const generatePaths = (title, template) => [
  `/${template}/${generatePermalink(title)}.html`,
  `/${template}`
];

export default { generatePermalink, generateFeaturedImageName, generatePaths };
