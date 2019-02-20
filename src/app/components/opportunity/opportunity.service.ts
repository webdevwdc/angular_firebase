import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { sortBy } from 'lodash';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { DatePipe } from '@angular/common';


export interface OpportunityItem {
  category: string;
  jobTitle: string;
  portal: string;
  profile: string;
  project: string;
  status: string;
  isDeleted: boolean;
  insertedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class OpportunityService {

  opportunityCollection: AngularFirestoreCollection<any>;
  private portalCollection: AngularFirestoreCollection<any>;
  private profileCollection: AngularFirestoreCollection<any>;
  private categoryCollection: AngularFirestoreCollection<any>;
  private projectTypeCollection: AngularFirestoreCollection<any>;
  private associateCollection: AngularFirestoreCollection<any>;


  constructor(
    private _afs: AngularFirestore,
    public datepipe: DatePipe
  ) {
    this.opportunityCollection = this._afs.collection('opportunity', x => x.orderBy('key', 'desc'));
    this.portalCollection = _afs.collection<any>('portal');
    this.profileCollection = _afs.collection<any>('profile');
    this.categoryCollection = _afs.collection<any>('category');
    this.projectTypeCollection = _afs.collection<any>('projectType');
    this.associateCollection = _afs.collection<any>('user');

  }

  getData(): Promise<any> {
    let responseData: any = [];
    return new Promise((resolve, reject) => {
      this._afs.collection('opportunity', x => x
        .where('isDeleted', '==', false)
        .where('closer_name', '==', '')
      )
        .snapshotChanges().subscribe(res => {
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

            responseData.push(response);
          });
          responseData = sortBy(responseData, 'data.insertedAt.seconds').reverse();
          resolve(responseData);
        }, error => {
          reject(error);
        });
    });
  }

  getDataClosedProject(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._afs.collection('opportunity', x => x
        .where('isDeleted', '==', false))
        .snapshotChanges()
        .subscribe(res => {
          let responseData: any = [];
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


            if (element.payload.doc.data()['closer_name'] !== '') {
              this.associateCollection.doc(element.payload.doc.data()['closer_name']).valueChanges().subscribe(res_closer_name => {
                response['closer_name'] = res_closer_name;
                responseData.push(response);
              }, error => {
                reject(error);
              });
            }

          });
          setTimeout(() => {
            responseData = sortBy(responseData, 'data.insertedAt.seconds').reverse();
            resolve(responseData);
            // console.log(responseData);
          }, 2000);
        }, error => {
          reject(error);
        });
    });
  }


  save(data: any): Promise<firebase.firestore.DocumentReference> {
    return new Promise((resolve, reject) => {
      this._afs.collection(
        'opportunity', x => x
          .where('job_title', '==', data['job_title'])
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
            this.opportunityCollection.doc(updatedId).update(data).then(() => {
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
            this.opportunityCollection.add(data).then((response) => {
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
      this.opportunityCollection.doc(id).snapshotChanges().subscribe(res => {
        const response: any = {};
        response['id'] = res.payload.id;
        response['data'] = res.payload.data();
        const created_date = this.datepipe.transform(response.data.insertedAt.toDate(), 'yyyy-MM-dd');
        response.data.created_date = created_date;
        resolve(response);
      }, error => {
        reject(error);
      });
    });
  }

  delete(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.opportunityCollection.doc(id).update({ isDeleted: true }).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  // depedency method
  getCategories(): Promise<any> {
    return new Promise((resolve, reject) => {
      let responseData: any = [];
      this._afs.collection(
        'category', x =>
          x.where('isDeleted', '==', false)
      ).snapshotChanges().subscribe(res => {
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

  getProtrals(): Promise<any> {
    return new Promise((resolve, reject) => {
      let responseData: any = [];
      this._afs.collection(
        'portal', x =>
          x.where('isDeleted', '==', false)
      ).snapshotChanges().subscribe(res => {
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

  getProfiles(): Promise<any> {
    return new Promise((resolve, reject) => {
      let responseData: any = [];
      this._afs.collection(
        'profile', x =>
          x.where('isDeleted', '==', false)
      ).snapshotChanges().subscribe(res => {
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

  getProjectTypes(): Promise<any> {
    return new Promise((resolve, reject) => {
      let responseData: any = [];
      this._afs.collection(
        'projectType', x =>
          x.where('isDeleted', '==', false)
      ).snapshotChanges().subscribe(res => {
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

  getAssociatesManagers(): Promise<any> {
    return new Promise((resolve, reject) => {
      let responseData: any = [];
      this._afs.collection(
        'user', x =>
          x.where('isDeleted', '==', false)
            .where('isManager', '==', true)
      ).snapshotChanges().subscribe(res => {
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

  getAll(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._afs.collection('user', x => x
        .where('isDeleted', '==', false))
        .snapshotChanges()
        .subscribe(res => {
          let responseData: any = [];
          res.forEach(element => {
            if (element.payload.doc.data()['role'].indexOf('superadmin') < 0) {
              const response: any = {};
              response['id'] = element.payload.doc.id;
              response['data'] = element.payload.doc.data();
              if (element.payload.doc.data()['manager'] !== '') {
                this.associateCollection.doc(element.payload.doc.data()['manager']).valueChanges().subscribe(res_manager => {
                  response['manager'] = res_manager;
                  responseData.push(response);
                }, error => {
                  reject(error);
                });
              } else {
                responseData.push(response);
              }
            }
          });

          setTimeout(() => {
            responseData = sortBy(responseData, 'data.insertedAt.seconds').reverse();
            resolve(responseData);
          }, 2000);
        }, error => {
          reject(error);
        });
    });
  }


  getAllAssociate(): Promise<any> {
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
          resolve(responseData);
          // console.log(responseData);
        }, error => {
          reject(error);
        });
    });
  }

  getAllClosers(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._afs.collection('user', x => x
        .where('isDeleted', '==', false)
        .where('isCloser', '==', true))
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



  getManager(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._afs.collection('user', x => x
        .where('isDeleted', '==', false)
        .where('role', 'array-contains', 'manager'))
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


  getManagerById(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.associateCollection.doc(id).snapshotChanges().subscribe(res => {
        const response: any = {};
        response['id'] = res.payload.id;
        response['data'] = res.payload.data();
        resolve(response);
      }, error => {
        reject(error);
      });
    });
  }

  getAssociateById(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.associateCollection.doc(id).snapshotChanges().subscribe(res => {
        const response: any = {};
        response['id'] = res.payload.id;
        response['data'] = res.payload.data();
        resolve(response);
      }, error => {
        reject(error);
      });
    });
  }

  getProfileById(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.profileCollection.doc(id)
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

}
