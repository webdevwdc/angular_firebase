import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { sortBy } from 'lodash';
import { DatePipe } from '@angular/common';

export interface FilterData {
  key: string;
  val: string;
}
@Injectable({
  providedIn: 'root'
})

export class TeamOpportunityService {

  private opportunityCollection: AngularFirestoreCollection<any>;
  private associateCollection: AngularFirestoreCollection<any>;
  private portalCollection: AngularFirestoreCollection<any>;
  private profileCollection: AngularFirestoreCollection<any>;
  private categoryCollection: AngularFirestoreCollection<any>;
  private projectTypeCollection: AngularFirestoreCollection<any>;



  items: Observable<any[]>;

  constructor(
    private _afs: AngularFirestore,
    public datepipe: DatePipe
  ) {
    this.opportunityCollection = _afs.collection<any>('opportunity');
    this.associateCollection = _afs.collection<any>('user');
    this.portalCollection = _afs.collection<any>('portal');
    this.profileCollection = _afs.collection<any>('profile');
    this.categoryCollection = _afs.collection<any>('category');
    this.projectTypeCollection = _afs.collection<any>('projectType');
  }

  getData(value: FilterData, managerId): Promise<any> {
    let responseData: any = [];
    return new Promise((resolve, reject) => {
      this._afs.collection('opportunity', x => x
        .where('isDeleted', '==', false)
        .where('closer_name', '==', '')
        .where(value.key, '==', value.val)).snapshotChanges().subscribe(res => {
          res.forEach(element => {
            const response: any = {};
            response['id'] = element.payload.doc.id;
            response['data'] = element.payload.doc.data();

            this._afs.doc('category/' + element.payload.doc.data()['category']).valueChanges().subscribe(data => {
              response['category'] = data;
            });
            this._afs.doc('portal/' + element.payload.doc.data()['portal']).valueChanges().subscribe(data => {
              response['portal'] = data;
            });
            this._afs.doc('profile/' + element.payload.doc.data()['profile']).valueChanges().subscribe(data => {
              response['profile'] = data;
            });
            this._afs.doc('projectType/' + element.payload.doc.data()['project_type']).valueChanges().subscribe(data => {
              response['project_type'] = data;
            });
            const created_date = this.datepipe.transform(response.data.insertedAt.toDate(), 'yyyy-MM-dd');
            response.data.created_date = created_date;
            responseData.push(response);
          });
          responseData = sortBy(responseData, 'data.insertedAt.seconds').reverse();
          resolve(responseData);
        }, error => {
          reject(error);
        });
    });
  }

  getDataWithDate(value, managerId): Promise<any> {
    let responseData: any = [];
    return new Promise((resolve, reject) => {
      this._afs.collection('opportunity', x => x
        .where('isDeleted', '==', false)
        .where('closer_name', '==', '')
      ).snapshotChanges().subscribe(res => {
        res.forEach(element => {
          const response: any = {};
          response['id'] = element.payload.doc.id;
          response['data'] = element.payload.doc.data();

          this._afs.doc('category/' + element.payload.doc.data()['category']).valueChanges().subscribe(data => {
            response['category'] = data;
          });
          this._afs.doc('portal/' + element.payload.doc.data()['portal']).valueChanges().subscribe(data => {
            response['portal'] = data;
          });
          this._afs.doc('profile/' + element.payload.doc.data()['profile']).valueChanges().subscribe(data => {
            response['profile'] = data;
          });
          this._afs.doc('projectType/' + element.payload.doc.data()['project_type']).valueChanges().subscribe(data => {
            response['project_type'] = data;
          });
          if (response.data.insertedAt) {
            response.data.created_date = this.datepipe.transform(response.data.insertedAt.toDate(), 'yyyy-MM-dd');
          }
          responseData.push(response);
        });
        responseData = sortBy(responseData).reverse();
        resolve(responseData);
      }, error => {
        reject(error);
      });
    });
  }



  getSuperadmin(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._afs.collection('user', x => x
        .where('isDeleted', '==', false)
        .where('role', 'array-contains', 'superadmin'))
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


  getAllAssociate(managerId): Promise<any> {
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

  getAllAssociates(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._afs.collection('user', x => x
        .where('isDeleted', '==', false)
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
          // console.log(responseData);
          resolve(responseData);
        }, error => {
          reject(error);
        });
    });
  }

  save(data: any): Promise<firebase.firestore.DocumentReference> {
    return new Promise((resolve, reject) => {
      this._afs.collection('opportunity', x => x
        .where('created_by', '==', data.prev_associate))
        .get()
        .subscribe(res => {

          if (res.empty) {
            data.isDeleted = false;
            data.insertedAt = firebase.firestore.FieldValue.serverTimestamp();
            this.opportunityCollection.add(data).then((response) => {
              resolve(response);
            }).catch((err) => {
              reject(err);
            });
          } else {
            delete data['prev_associate'];
            data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
            this.opportunityCollection.doc(res.docs[0].id).update(data).then(() => {
              resolve();
            }).catch((err) => {
              reject(err);
            });
            // this.opportunityCollection.doc(res.docs[0].id).snapshotChanges().subscribe(res_opprtunity => {
            //   let arr_note = [];
            //   if (res_opprtunity.payload.data()['note']) {
            //     arr_note = res_opprtunity.payload.data()['note'];
            //   }
            //   data['note'] = arr_note.push(data['new_note']);

            //   delete data['new_note'];

            // }, error => {
            //   reject(error);
            // });
          }
        });
    });
  }

  getById(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.opportunityCollection.doc(id).snapshotChanges().subscribe(res => {
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


  getOpportunityById(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.opportunityCollection.doc(id)
        .snapshotChanges()
        .subscribe(res => {
          const response: any = {};
          response['id'] = res.payload.id;
          response['data'] = res.payload.data();
          resolve(response);
        }, error => {
          reject(error);
        });
    });
  }


  getAllPortal(): Promise<any> {
    let responseData: any = [];
    return new Promise((resolve, reject) => {
      this._afs.collection('portal', x => x
        .where('isDeleted', '==', false))
        .snapshotChanges().subscribe(res => {
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

  getPortalById(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.portalCollection.doc(id).snapshotChanges().subscribe(res => {
        const response: any = {};
        response['id'] = res.payload.id;
        response['data'] = res.payload.data();
        resolve(response);
      }, error => {
        reject(error);
      });
    });
  }

  getAllProfile(): Promise<any> {
    let responseData: any = [];
    return new Promise((resolve, reject) => {
      this._afs.collection('profile', x => x
        .where('isDeleted', '==', false))
        .snapshotChanges().subscribe(res => {
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

  getProfileById(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.profileCollection.doc(id).snapshotChanges().subscribe(res => {
        const response: any = {};
        response['id'] = res.payload.id;
        response['data'] = res.payload.data();
        resolve(response);
      }, error => {
        reject(error);
      });
    });
  }

  getCategoryById(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.categoryCollection.doc(id).snapshotChanges().subscribe(res => {
        const response: any = {};
        response['id'] = res.payload.id;
        response['data'] = res.payload.data();
        resolve(response);
      }, error => {
        reject(error);
      });
    });
  }

  getProjectTypeById(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.projectTypeCollection.doc(id).snapshotChanges().subscribe(res => {
        const response: any = {};
        response['id'] = res.payload.id;
        response['data'] = res.payload.data();
        resolve(response);
      }, error => {
        reject(error);
      });
    });
  }

}
