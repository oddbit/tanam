import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private database: AngularFireDatabase, private appConfigService: AppConfigService) { }

  updateCache(documentSlug: string) {
    const siteId = this.appConfigService.siteId;
    return this.database
      .list(`tanam/${siteId}/tasks/cache/update`)
      .push(`${documentSlug}`);
  }
}
