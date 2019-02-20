import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { sortBy } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ShiftService {

  private shiftCollection: AngularFirestoreCollection<any>;
  private associateCollection: AngularFirestoreCollection<any>;
  constructor(
    private _afs: AngularFirestore
  ) {
    this.shiftCollection = _afs.collection<any>('shift');
    this.associateCollection = _afs.collection<any>('user');
  }


  getAllAssociate(managerId: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._afs.collection('user', x => x
        .where('isDeleted', '==', false)
        .where('manager', '==', managerId)
        .where('role', 'array-contains', 'associate'))
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

  save(data: any): Promise<firebase.firestore.DocumentReference> {
    return new Promise((resolve, reject) => {
      this._afs.collection('shift', x => x
        .where('associate_id', '==', data.associate_id)
        .where('manager_id', '==', data.manager_id))
        .get()
        .subscribe(res => {
          if (res.empty) {
            data.isDeleted = false;
            data.insertedAt = firebase.firestore.FieldValue.serverTimestamp();
            this.shiftCollection.add(data).then((response) => {
              resolve(response);
            }).catch((err) => {
              reject(err);
            });
          } else {
            data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
            this.shiftCollection.doc(res.docs[0].id).update(data).then(() => {
              resolve();
            }).catch((err) => {
              reject(err);
            });
          }
        });
    });
  }

  getById(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.shiftCollection.doc(id).snapshotChanges().subscribe(res => {
        const response: any = {};
        response['id'] = res.payload.id;
        response['data'] = res.payload.data();
        resolve(response);
      }, error => {
        reject(error);
      });
    });
  }

  getAssociateId(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.associateCollection.doc(id).snapshotChanges().subscribe(res => {
        const response: any = { id: res.payload.id, ...res.payload.data() };
        resolve(response);
      }, error => {
        reject(error);
      });
    });
  }

  getByAssociateAndManager(associate_id: any, manager_id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._afs.collection('shift', x => x
        .where('associate_id', '==', associate_id)
        .where('manager_id', '==', manager_id))
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

  delete(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.shiftCollection.doc(id).update({ isDeleted: true }).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }
}
