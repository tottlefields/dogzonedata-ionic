import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { DogWeight } from '../models/dog-weight.interface';
import { Dog } from '../models/dog.interface';
import * as moment from 'moment';
import { DogWeight2 } from '../models/dog-weight2.interface';
import { finalize, map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DogsService {

  private dogsCollection: AngularFirestoreCollection<Dog>;

  constructor(
    private afStore: AngularFirestore,
    private afStorage: AngularFireStorage,
    private authService: AuthService
  ) {
    this.dogsCollection = this.afStore.collection('dogs');
  }

  addDog(dog: Dog){
    dog.isRemoved = false;
    dog.colorText = '#FFFFFF';
    dog.uid = this.authService.getUserId();

    return this.dogsCollection.add(dog);
  }

  getDogs() {
    const uid = this.authService.getUserId();
    return this.afStore.collection('dogs', ref => ref.where('uid', '==', uid).where('isRemoved', '==', false)
    .orderBy('dob')).valueChanges({ idField: 'id' });
  }

  getDog(dogId: string): Observable<Dog> {
    return this.dogsCollection.doc<Dog>(dogId).valueChanges().pipe(
      take(1), map(dog => {
        dog.id = dogId;
        return dog;
      })
    );
  }

  getAllWeights(dogId: string): AngularFirestoreCollection<DogWeight> {
    return this.afStore.collection('dogs').doc(dogId).collection('weights', ref => ref.orderBy('date', 'desc'));
  }

  updateDog(dogId: string, formData: any){
    return this.afStore.doc('dogs/' + dogId).update(formData);
  }

  updateWeightsColor(dogId: string, newColor: string){
    this.afStore.collection('weights', ref => ref.where('dog', '==', dogId))
    .valueChanges({ idField: 'id' }).subscribe(data => {
      data.forEach(weight => {
        this.afStore.doc('weights/' + weight.id).set({ borderColor: newColor }, { merge: true });
      });
      // if (data[0]) { this.afStore.doc('dogs/' + dogId).set({ currWeight: data[0] }, { merge: true }); }
      // if (data[1]) { this.afStore.doc('dogs/' + dogId).set({ prevWeight: data[1] }, { merge: true }); }
    });
  }

  async uploadImage(image: File, uid: string){
    const randomId = Math.random().toString(36).substring(2, 8);
    const filePath = `${uid}/dogs/${new Date().getTime()}_${randomId}`;
    const ref = this.afStorage.ref(filePath);
    const uploadTask = ref.put(image);
    return uploadTask;
  }

  removeImage(url: string){
    return this.afStorage.storage.refFromURL(url).delete();
  }

  getChartData(): AngularFirestoreCollection<DogWeight2> {
    const uid = this.authService.getUserId();
    return this.afStore.collection('weights', ref => ref.where('uid', '==', uid).where('validDog', '==', true)
    .where('date', '>=', moment().subtract(6, 'months').toDate()).orderBy('date'));
  }

  /* getChartDataByDog(dogId: string): AngularFirestoreCollection<DogWeight2> {
    return this.afStore.collection('weights', ref => ref.where('dog', '==', dogId)
    .where('date', '>=', moment().subtract(6, 'months').toDate()).orderBy('date'));
  } */

  getChartDataByDog(dogId: string): AngularFirestoreCollection<DogWeight> {
    return this.afStore.collection('dogs').doc(dogId).collection('weights', 
    ref => ref.where('date', '>=', moment().subtract(6, 'months').toDate()).orderBy('date'));
  }

  addWeightRecord(dogId: string, date: Date, weight: number, name: string, color: string): Promise<void> {
    const uid = this.authService.getUserId();
    const id = this.afStore.createId();
    this.afStore.collection('weights/').add({
      date, weight, uid, dog: dogId, label: name, borderColor: color, validDog: true });
    return this.afStore.doc('dogs/' + dogId + '/weights/' + id).set({ date, weight });
  }

  updateWeights(dogId: string) {
    this.dogsCollection.doc(dogId).collection('weights', ref => ref.orderBy('date', 'desc').limit(2))
    .valueChanges().subscribe(data => {
      if (data[0]) { this.afStore.doc('dogs/' + dogId).set({ currWeight: data[0] }, { merge: true }); }
      if (data[1]) { this.afStore.doc('dogs/' + dogId).set({ prevWeight: data[1] }, { merge: true }); }
    });
  }


  /* getDogList(uid: string): AngularFirestoreCollection<Dog> {
    return this.afStore.collection('dogs', ref => ref.where('uid', '==', uid).where('isRemoved', '==', false).orderBy('dob'));
  }

  getDog(dogId: string): AngularFirestoreDocument<Dog> {
    return this.afStore.collection('dogs').doc(dogId);
  }

  getRecentWeights(dogId: string): AngularFirestoreCollection<DogWeight> {
    return this.afStore.collection('dogs').doc(dogId).collection(
      'weights', ref => ref.where('date', '>=', moment().subtract(6, 'months').toDate()).orderBy('date', 'desc'));
  }


  createDog(
    uid: string,
    name: string,
    kcName: string,
    breed: string,
    color: string,
    imageUrl: string,
    dob: Date,
    sex: string,
    microchip: string
  ): Promise<void> {
    const id = this.afStore.createId();
    const colorText = '#FFFFFF';
    // console.log(environment.textColors);
    const isRemoved = false;

    console.log(id, name, kcName, breed, color, dob, colorText, uid, sex, isRemoved, imageUrl, microchip);

    return this.afStore.doc('dogs/' + id).set({
      id, name, kcName, breed, color, dob, colorText, uid, sex, isRemoved, imageUrl, microchip
    });
  } */
}
