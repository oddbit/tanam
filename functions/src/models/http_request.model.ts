class TanamHttpRequest {
  public readonly language;

  constructor(
    public readonly hostname,
    public readonly url,
    public readonly params,
  ) {
    this.language = params.lang || 'en';
  }

  static fromExpressRequest(req) {
    return new TanamHttpRequest(
      req.headers['x-forwarded-host'],
      req.url.replace(/^\//, ''), // Remove leading slash
      {...req.params},
    );
  }

  get fullyQualifiedUrl() {
    return this.hostname + '/' + this.url;
  }

  toString() {
    return `${TanamHttpRequest.name}(${this.hostname}/${this.url})`;
  }
}
