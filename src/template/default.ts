export const templateMap = {};

templateMap['header'] = `
<!DOCTYPE html>
<html lang="en">
  <head>
  <title>{{ context.title }}</title>
  <link rel="stylesheet" href="/css/styles.css">
</head>
`;

templateMap['footer'] = `</html>`;

templateMap['page'] = `
{% include header.tmpl.html %}
<body>
  {{ context.body }}
<body>
{% include footer.tmpl.html %}
`;

templateMap['blog'] = `
{% include header.tmpl.html %}
<body>
  <h1>{{ context.title }} <h1>
  <p>{{ context.body }}</p>
<body>
{% include footer.tmpl.html %}
`;