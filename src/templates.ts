export const tanamDefaultTheme = {};

tanamDefaultTheme['header'] = `
<!DOCTYPE html>
<html lang="en">
  <head>
  <title>{{ context.title }}</title>
  <link rel="stylesheet" href="/css/styles.css">
</head>
`;

tanamDefaultTheme['footer'] = `
</html>
`;

tanamDefaultTheme['page'] = `
{% include header.tmpl.html %}
<body>
  {{ context.body }}
<body>
{% include footer.tmpl.html %}
`;

tanamDefaultTheme['blog'] = `
{% include header.tmpl.html %}
<body>
  <h1>{{ context.title }} <h1>
  <p>{{ context.body }}</p>
<body>
{% include footer.tmpl.html %}
`;