import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { sortBy } from 'lodash';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProjectTypeService {

  projectTypesCollection: AngularFirestoreCollection<any>;
  constructor(private _afs: AngularFirestore) {
    this.projectTypesCollection = this._afs.collection('projectType', x => x.orderBy('key', 'desc'));
  }

  getData(): Promise<any> {
    let responseData: any = [];
    return new Promise((resolve, reject) => {
      this._afs.collection('projectType', x => x.where('isDeleted', '==', false)).snapshotChanges().subscribe(res => {
        res.forEach(element => {
          const response: any = {};
          response['id'] = element.payload.doc.id;
          response['data'] = element.payload.doc.data();
          responseData.push(response);
        });
        responseData = sortBy(responseData, 'data.insertedAt.seconds').reverse();
        resolve(responseData);
      }, error => {
        reject(error);
      });
    });
  }

  save(data: any): Promise<firebase.firestore.DocumentReference> {
    return new Promise((resolve, reject) => {
      this._afs.collection(
        'projectType', x => x
          .where('name', '==', data['name'])
          .where('isDeleted', '==', false)
      ).get().subscribe(res => {
        if (data['id']) {
          if (!res.empty && res.docs[0].id !== data['id']) {
            reject({ message: 'Project Type already exists.' });
          } else {
            const updatedId = data['id'];
            delete data['id'];
            data.isDeleted = false;
            data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
            this.projectTypesCollection.doc(updatedId).update(data).then(() => {
              resolve();
            }).catch((err) => {
              reject(err);
            });
          }
        } else {
          if (!res.empty) {
            reject({ message: 'Project Type already exists..' });
          } else {
            data.isDeleted = false;
            data.insertedAt = firebase.firestore.FieldValue.serverTimestamp();
            this.projectTypesCollection.add(data).then((response) => {
              resolve(response);
            }).catch((err) => {
              reject(err);
            });
          }
        }
      });
    });
  }

  getById(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.projectTypesCollection.doc(id).snapshotChanges().subscribe(res => {
        const response: any = {};
        response['id'] = res.payload.id;
        response['data'] = res.payload.data();
        resolve(response);
      }, error => {
        reject(error);
      });
    });
  }

  delete(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.projectTypesCollection.doc(id).update({ isDeleted: true }).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }
}
