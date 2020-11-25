import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { DogWeight } from '../models/dog-weight.interface';
import { Dog } from '../models/dog.interface';
import * as moment from 'moment';
import { DogWeight2 } from '../models/dog-weight2.interface';

@Injectable({
  providedIn: 'root'
})
export class DogsService {

  constructor(public afStore: AngularFirestore) { }

  getDogList(uid: string): AngularFirestoreCollection<Dog> {
    return this.afStore.collection('dogs', ref => ref.where('uid', '==', uid).orderBy('dob'));
  }

  getDog(dogId: string): AngularFirestoreDocument<Dog> {
    return this.afStore.collection('dogs').doc(dogId);
  }

  addWeightRecord(uid: string, dogId: string, date: Date, weight: number, name: string, color: string): Promise<void> {
    const id = this.afStore.createId();
    this.afStore.collection('weights/').add({ date: date, weight: weight, uid: uid, dog: dogId, label: name, borderColor: color });
    return this.afStore.doc('dogs/' + dogId + '/weights/' + id).set({ date, weight });
  }

  getAllWeights(dogId: string): AngularFirestoreCollection<DogWeight> {
    return this.afStore.collection('dogs').doc(dogId).collection('weights', ref => ref.orderBy('date', 'desc'));
  }

  getRecentWeights(dogId: string): AngularFirestoreCollection<DogWeight> {
    return this.afStore.collection('dogs').doc(dogId).collection(
      'weights', ref => ref.where('date', '>=', moment().subtract(6, 'months').toDate()).orderBy('date', 'desc'));
  }

  updateWeights(dogId: string) {
    this.afStore.collection('dogs').doc(dogId).collection('weights', ref => ref.orderBy('date', 'desc').limit(2))
    .valueChanges().subscribe(data => {
      if (data[0]) { this.afStore.doc('dogs/' + dogId).set({ currWeight: data[0] }, { merge: true }); }
      if (data[1]) { this.afStore.doc('dogs/' + dogId).set({ prevWeight: data[1] }, { merge: true }); }
    });
  }

  getChartData(uid: string): AngularFirestoreCollection<DogWeight2> {
    return this.afStore.collection('weights', ref => ref.where('uid', '==', uid)
    .where('date', '>=', moment().subtract(6, 'months').toDate()).orderBy('date'));
  }

  createDog(
    uid: string,
    name: string,
    breed: string,
    color: string,
    // imageUrl: string,
    dob: Date,
    sex: string
  ): Promise<void> {
    const id = this.afStore.createId();
    const colorText = '#FFFFFF';

    console.log(id, name, breed, color, dob, colorText, uid, sex);

    return this.afStore.doc('dogs/' + id).set({
      id, name, breed, color, dob, colorText, uid, sex
    });
  }
}
