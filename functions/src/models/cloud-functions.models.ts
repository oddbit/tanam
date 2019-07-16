import { ITanamDocumentType, TanamDocumentType } from './document-type.models';
import * as admin from 'firebase-admin';
import { ITanamUser, ITanamUserRole, TanamUser, TanamUserRole } from './user.models';

export class AdminTanamUser extends TanamUser {
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

export class AdminTanamUserRole extends TanamUserRole {
  toJson(): ITanamUserRole {
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
   * A key/value map of roles as keys and email addresses as values
   *
   * e.g.
   * {
   *     'superAdmin': 'jane.deer@example.com',
   *     'admin': 'john.doe@example.com',
   * }
   */
  roles: { [key: string]: string };

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
  readonly roles: { [key: string]: string };
  readonly language: string;
  readonly force: boolean;

  constructor(json: IAdminCreateSiteRequest) {
    this.id = (json.id || json.name).replace(/[^A-Za-z0-9_-]/g, '');
    this.name = json.name || json.id;
    this.domain = json.domain;
    this.roles = {...json.roles};
    this.language = json.language || 'en';
    this.force = json.force === true;
  }
}
