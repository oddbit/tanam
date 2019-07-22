import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { TanamSite } from 'tanam-models/settings.models';
import { take } from 'rxjs/operators';
import { SiteService } from './site.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private readonly angularFireDatabase: AngularFireDatabase,
    private readonly siteService: SiteService,
  ) {
  }

  async updateCache(documentUrl: string) {
    const tanamSite = await this._currentSite;
    this.angularFireDatabase.database
      .ref('tanam')
      .child(tanamSite.id)
      .child('tasks/cache/update')
      .push(`${documentUrl}`);
  }


  get _currentSite(): Promise<TanamSite> {
    return this.siteService.getCurrentSite().pipe(take(1)).toPromise();
  }
}
