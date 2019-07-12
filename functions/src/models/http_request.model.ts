export class TanamHttpRequest {
  public readonly language: string;

  constructor(
    public readonly hostname: string,
    public readonly url: string,
    public readonly query: any,
  ) {
    this.language = query.lang || 'en';
    this.url = `/${url}`.replace(/\/+/g, '/'); // Normalize the URL
  }

  static fromExpressRequest(req) {
    return new TanamHttpRequest(
      req.headers['x-forwarded-host'],
      req.url,
      { ...req.query },
    );
  }

  get fullyQualifiedUrl() {
    return this.hostname + this.url;
  }

  toString() {
    return `${TanamHttpRequest.name}(${this.fullyQualifiedUrl})`;
  }
}
