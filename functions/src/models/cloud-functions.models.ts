import * as admin from 'firebase-admin';
import { ITanamUser, TanamUser } from './user.models';
import { MD5 } from 'crypto-js';
import { TanamDocumentType, ITanamDocumentType } from './document-type.models';

export class AdminTanamUser extends TanamUser {

  static fromFirebaseUser(firebaseUser: admin.auth.UserRecord) {
    // Use gravatar as default if photoUrl isn't specified in user data
    // https://en.gravatar.com/site/implement/images/
    const gravatarHash = MD5(firebaseUser.email || firebaseUser.uid)
      .toString()
      .toLowerCase();

    const gravatar = `https://www.gravatar.com/avatar/${gravatarHash}.jpg?s=1024&d=identicon`;
    return new AdminTanamUser({
      id: firebaseUser.uid,
      name: firebaseUser.displayName || firebaseUser.email,
      email: firebaseUser.email,
      photoUrl: firebaseUser.photoURL || gravatar,
    } as ITanamUser);
  }

  toJson(): ITanamUser {
    const json = super.toJson();
    json.updated = admin.firestore.FieldValue.serverTimestamp();
    json.created = !!json.created
      ? admin.firestore.Timestamp.fromDate(json.created)
      : admin.firestore.FieldValue.serverTimestamp();
    return json;
  }
}

export class AdminTanamDocumentType extends TanamDocumentType {
  toJson(): ITanamDocumentType {
    const json = super.toJson();
    json.updated = admin.firestore.FieldValue.serverTimestamp();
    json.created = !!json.created
      ? admin.firestore.Timestamp.fromDate(json.created)
      : admin.firestore.FieldValue.serverTimestamp();
    return json;
  }
}

export interface IAdminCreateSiteRequest {
  /**
   * The site's firestore id
   * This id will never be publicly visible, so it has no significance
   * other than mnemonic value for debugging or database inspection.
   */
  id: string;

  /**
   * The name of the site (will also be used in HTML title attribute)
   */
  name: string;

  /**
   * The primary domain to associate with this site
   */
  domain: string;

  /**
   * Mandatory to have an initial super admin email to invite.
   * Value must be a valid email.
   */
  superAdmin: string;

  /**
   * The default language to use for content that is being created by user
   * This is not the CMS UI language.
   */
  language: string;

  /**
   * Warning, setting this to true will overwrite any potentially already existing
   * site that has the provided ID. Omit this if you are creating a new site.
   */
  force: boolean;
}

export class AdminCreateSiteRequest implements IAdminCreateSiteRequest {
  readonly id: string;
  readonly name: string;
  readonly domain: string;
  readonly superAdmin: string;
  readonly language: string;
  readonly force: boolean;

  constructor(json: IAdminCreateSiteRequest) {
    this.id = (json.id || json.name).replace(/[^A-Za-z0-9_-]/g, '');
    this.name = json.name || json.id;
    this.domain = json.domain;
    this.superAdmin = json.superAdmin;
    this.language = json.language || 'en';
    this.force = json.force === true;
  }
}
