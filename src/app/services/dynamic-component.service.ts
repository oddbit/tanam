import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

export interface DynamicComponent {
  title: string;
  selector: string;
  template: string;
  styles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class DynamicComponentService {
  constructor(
    private readonly firestore: AngularFirestore,
  ) { }

  getComponent(componentId: string) {
    console.log(`[DynamicComponentService:getComponent] ${componentId}`);
    return this.firestore.collection('tanam-components').doc<DynamicComponent>(componentId).valueChanges();
  }

  getComponents() {
    return this.firestore.collection<DynamicComponent>('tanam-components').valueChanges();
  }
}
