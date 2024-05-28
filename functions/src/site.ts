import {Timestamp} from "firebase-admin/firestore";
import {logger} from "firebase-functions/v2";
import {onDocumentCreated} from "firebase-functions/v2/firestore";
import {TanamSiteAdmin} from "./models/TanamSiteAdmin";
import {ITanamSite} from "./models/TanamSite";
import {getDocumentTypeArticle, getDocumentTypePerson} from "./utils/documentTypeGenerator";

export const bootstrapNewSite = onDocumentCreated("tanam/{siteId}", async (event) => {
  const promises = [];
  const siteId = event.params.siteId;
  const snapshot = event.data;
  if (!snapshot) {
    logger.error("No snapshot found for new site", {siteId});
    return;
  }
  const data = snapshot.data();
  logger.debug("New site created", {data, siteId});

  // Normalize the site data
  const site = TanamSiteAdmin.fromFirestore(snapshot);
  const siteJson = site.toJson();
  logger.debug("Normalized site data", {siteJson});
  promises.push(snapshot.ref.set(siteJson));
  // Create default content types
  const documentTypes = [getDocumentTypeArticle(), getDocumentTypePerson()];
  const documentTypeCollection = snapshot.ref.collection("document-types");
  for (const documentType of documentTypes) {
    const {data, fields} = documentType;
    const documentTypeRef = documentTypeCollection.doc(data.id);
    logger.debug("Creating typoe", data.toJson());
    promises.push(documentTypeRef.set(data.toJson()));
    for (const field of fields) {
      logger.debug("Creating field", field.toJson());
      promises.push(documentTypeRef.collection("fields").doc(field.id).set(field.toJson()));
    }
  }

  return Promise.all(promises);
});
