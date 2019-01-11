export interface ContentType {
    title: string;
    slug: string;
    numEntries: { [key: string]: number };
}

export interface ContentTypeEntry {
    title: string;
    url: string;
    urls: string[];
}
