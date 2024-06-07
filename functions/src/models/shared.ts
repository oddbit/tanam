// A place to register models that will be shared with the frontend.
// Models that can be shared with the frontend are only models that contain DTO (Data Transfer Object), without any dependency packages in them.
// Because it's a bit tricky to handle share model files
// if there are load dependency packages in them and some packages sometimes only support server side.
export * from "./LocalizedString";
export * from "./TanamDocument";
export * from "./TanamDocumentField";
export * from "./TanamDocumentType";
export * from "./GenAiRequest";
export * from "./TanamDocumentData";
