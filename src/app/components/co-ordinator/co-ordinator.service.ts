import { Injectable, EventEmitter } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { sortBy } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class CoOrdinatorService {

  private CoOrdinatorCollection: AngularFirestoreCollection<any>;
  items: Observable<any[]>;

  constructor(private _afs: AngularFirestore) {
    this.CoOrdinatorCollection = _afs.collection<any>('user');
  }

  isSuperadminCredentialGiven: EventEmitter<boolean> = new EventEmitter();

  setSuperadminCredential(isSet: boolean) {
    this.isSuperadminCredentialGiven.emit(isSet);
  }

  getSuperadminCredential(): Observable<boolean> {
    return this.isSuperadminCredentialGiven;
  }


  getAllCoOrdinator(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._afs.collection('user', x => x
        .where('isDeleted', '==', false)
        .where('role', 'array-contains', 'coordinator'))
        .snapshotChanges()
        .subscribe(res => {
          let responseData: any = [];
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

  save(data: any, uid: any): Promise<firebase.firestore.DocumentReference> {
    return new Promise((resolve, reject) => {
      this._afs.collection('co-ordinator', x => x
        .where('isDeleted', '==', false)
        .where('email', '==', data['email']))
        .get()
        .subscribe(res => {
          if (data['id']) {
            if (!res.empty && res.docs[0].id !== data['id']) {
              reject({ message: 'email already used.' });
            } else {
              const updatedId = data['id'];
              delete data['id'];
              data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
              this.CoOrdinatorCollection.doc(updatedId).update(data).then(() => {
                resolve();
              }).catch((err) => {
                reject(err);
              });
            }
          } else {
            if (!res.empty) {
              reject({ message: 'email already used.' });
            } else {
              data.isDeleted = false;
              data.insertedAt = firebase.firestore.FieldValue.serverTimestamp();
              delete data.password;
              data.uid = uid;
              this.CoOrdinatorCollection.add(data).then((response) => {
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
      this.CoOrdinatorCollection.doc(id).snapshotChanges().subscribe(res => {
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
      this.CoOrdinatorCollection.doc(id).update({ isDeleted: true }).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }
}
