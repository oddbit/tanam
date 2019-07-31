import * as models from 'tanam-models';
import { ITanamDocument } from 'tanam-models';
import * as firebase from 'firebase/app';

export class AngularTanamSite extends models.TanamSite {
  toJson(): models.ITanamSite {
    const json = super.toJson();
    json.updated = firebase.firestore.FieldValue.serverTimestamp();
    json.created = !!json.created
      ? firebase.firestore.Timestamp.fromDate(json.created)
      : firebase.firestore.FieldValue.serverTimestamp();
    return json;
  }
}


export class AngularUserInvite extends models.TanamUserInvite {
  toJson(): models.ITanamUserInvite {
    const json = super.toJson();
    json.updated = firebase.firestore.FieldValue.serverTimestamp();
    json.created = !!json.created
      ? firebase.firestore.Timestamp.fromDate(json.created)
      : firebase.firestore.FieldValue.serverTimestamp();
    return json;
  }
}


export class AngularTanamUser extends models.TanamUser {
  toJson(): models.ITanamUser {
    const json = super.toJson();
    json.updated = firebase.firestore.FieldValue.serverTimestamp();
    json.created = !!json.created
      ? firebase.firestore.Timestamp.fromDate(json.created)
      : firebase.firestore.FieldValue.serverTimestamp();
    return json;
  }
}

export class AngularTanamDocumentType extends models.TanamDocumentType {
  toJson(): models.ITanamDocumentType {
    const json = super.toJson();
    json.updated = firebase.firestore.FieldValue.serverTimestamp();
    json.created = !!json.created
      ? firebase.firestore.Timestamp.fromDate(json.created)
      : firebase.firestore.FieldValue.serverTimestamp();
    return json;
  }
}


export class AngularTanamDocument extends models.TanamDocument {
  constructor(json: ITanamDocument) {
    super({
      ...json,
      id: json.id || firebase.firestore().collection('-').doc().id,
    });
  }

  static fromDocumentType(documentType: AngularTanamDocumentType) {
    return new AngularTanamDocument({
      id: firebase.firestore().collection('-').doc().id,
      documentType: documentType.id,
      standalone: documentType.standalone,
      status: documentType.documentStatusDefault,
    } as ITanamDocument);
  }

  toJson(): models.ITanamDocument {
    const json = super.toJson();
    json.revision = firebase.firestore.FieldValue.increment(1);
    json.updated = firebase.firestore.FieldValue.serverTimestamp();
    json.created = !!json.created
      ? firebase.firestore.Timestamp.fromDate(json.created)
      : firebase.firestore.FieldValue.serverTimestamp();
    return json;
  }
}
