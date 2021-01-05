import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { DogWeight } from '../models/dog-weight.interface';
import { Dog } from '../models/dog.interface';
import * as moment from 'moment';
import { DogWeight2 } from '../models/dog-weight2.interface';
import { finalize, map, take, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { GeneralService } from './general.service';
import { Event } from '../models/event.interface';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class DogsService {

  private dogsCollection: AngularFirestoreCollection<Dog>;
  defaultTextColor = '#FFFFFF';
  defaultCssColor = 'dzd-black';
  unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private afStore: AngularFirestore,
    private afStorage: AngularFireStorage,
    private authService: AuthService,
    private generalService: GeneralService
  ) {
    this.dogsCollection = this.afStore.collection('dogs');
  }

  logOut(){
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  addDog(dog: Dog){
    const id = this.afStore.createId();
    dog.isRemoved = false;
    dog.colorText = this.defaultTextColor;
    dog.cssColor = this.defaultCssColor;
    dog.uid = this.authService.getUserId();

    if (dog.color){
      dog.colorText = environment.textColors[dog.color];
      let color = this.generalService.getColor(dog.color);
      if (color){ dog.cssColor = color.cssColor; }
    }

    let age = moment().diff(dog.dob.toDate(), 'years');
    this.addBirthday(id, 
      moment(dog.dob.toDate()).add((age +1 ), 'years').toDate(),
      this.generalService.capitalizeWords(dog.name) + '\'s ' + this.generalService.getOrdinal(age + 1) + ' Birthday',
    ); 

    return this.dogsCollection.doc(id).set(dog);
  }

  getDogs() {
    const uid = this.authService.getUserId();
    return this.afStore.collection('dogs', ref => ref.where('uid', '==', uid).where('isRemoved', '==', false)
    .orderBy('dob')).valueChanges({ idField: 'id' }).pipe(
      takeUntil(this.unsubscribe)
    );
  }

  getDog(dogId: string): Observable<Dog> {
    return this.dogsCollection.doc<Dog>(dogId).valueChanges().pipe(
      take(1), takeUntil(this.unsubscribe), map(dog => {
        dog.id = dogId;
        return dog;
      })
    );
  }

  getAllWeights(dogId: string): AngularFirestoreCollection<DogWeight> {
    return this.afStore.collection('dogs').doc(dogId).collection('weights', ref => ref.orderBy('date', 'desc'));
  }

  getHealthData(dogId: string) {
    return this.afStore.collection('dogs').doc(dogId).collection('health', ref => ref.orderBy('date', 'desc'));
  }

  updateDog(dogId: string, formData: any){
    if (formData.color){
      formData.colorText = environment.textColors[formData.color];
      let color = this.generalService.getColor(formData.color);
      if (color){ formData.cssColor = color.cssColor; }
    }
    else { formData.colorText = this.defaultTextColor; formData.cssColor = this.defaultCssColor; }
    return this.afStore.doc('dogs/' + dogId).update(formData);
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
    return this.afStore.collection('weights', ref => ref.where('uid', '==', uid)
      .where('date', '>=', moment().subtract(6, 'months').toDate()).orderBy('date'));
  }

  /* getChartDataByDog(dogId: string): AngularFirestoreCollection<DogWeight2> {
    return this.afStore.collection('weights', ref => ref.where('dog', '==', dogId)
    .where('date', '>=', moment().subtract(6, 'months').toDate()).orderBy('date'));
  } */

  getChartDataByDog(dogId: string, months: number): AngularFirestoreCollection<DogWeight> {
    return this.afStore.collection('dogs').doc(dogId).collection('weights', 
    ref => ref.where('date', '>=', moment().subtract(months, 'months').toDate()).orderBy('date'));
  }

  addWeightRecord(dogId: string, date: Date, weight: number): Promise<void> {
    const uid = this.authService.getUserId();
    const id = this.afStore.createId();
    this.afStore.collection('weights/').doc(id).set({date, weight, uid, dog: dogId});
    return this.afStore.doc('dogs/' + dogId + '/weights/' + id).set({ date, weight });
  }

  updateWeights(dogId: string) {
    this.dogsCollection.doc(dogId).collection('weights', ref => ref.orderBy('date', 'desc').limit(2))
    .valueChanges().subscribe(data => {
      if (data[0]) { this.afStore.doc('dogs/' + dogId).set({ currWeight: data[0] }, { merge: true }); }
      if (data[1]) { this.afStore.doc('dogs/' + dogId).set({ prevWeight: data[1] }, { merge: true }); }
    });
  }

  completeReminder(id: string){
    return this.afStore.doc('events/' + id).set({ completed: true, dateCompleted: new Date() }, { merge: true });
  }

  undoCompleteReminder(id: string){
    return this.afStore.doc('events/' + id).set({
      completed: false,
      dateCompleted: firebase.firestore.FieldValue.delete()
    }, { merge: true });
  }

  getUpcomingForDog(dogId: string){
    return this.afStore.collection<Event>('events', ref => ref.where('dogs', 'array-contains', dogId)
    .where('date', '>=', moment().toDate())
    // .where('date', '<=', moment().add(12, 'months').toDate())
    .orderBy('date')).valueChanges({ idField: 'id' }).pipe(
      takeUntil(this.unsubscribe)
    );
  }

  getOverdueRemindersForDog(dogId: string){
    // const uid = this.authService.getUserId();
    return this.afStore.collection<Event>('events', ref => ref.where('dogs', 'array-contains', dogId)
    .where('completed', '==', false).where('date', '<', moment().toDate())
    .orderBy('date')).valueChanges({ idField: 'id' }).pipe(
      takeUntil(this.unsubscribe)
    );
  }

  getEvents(){
    const uid = this.authService.getUserId();
    return this.afStore.collection<Event>('events', ref => ref.where('uid', '==', uid).where('date', '>=', moment().toDate()).where('date', '<=', moment().add(12, 'months').toDate())
    .orderBy('date')).valueChanges({ idField: 'id' }).pipe(
      takeUntil(this.unsubscribe)
    );
  }

  getReminders(){
    const uid = this.authService.getUserId();
    return this.afStore.collection<Event>('reminders', ref => ref.where('uid', '==', uid).where('completed', '==', false)
    .orderBy('date')).valueChanges({ idField: 'id' }).pipe(
      takeUntil(this.unsubscribe)
    );
  }

  getOverdueReminders(){
    const uid = this.authService.getUserId();
    return this.afStore.collection<Event>('events', ref => ref.where('uid', '==', uid).where('completed', '==', false).where('date', '<', moment().toDate())
    .orderBy('date')).valueChanges({ idField: 'id' }).pipe(
      takeUntil(this.unsubscribe)
    );
  }

  addBirthday(dogId: string, date: Date, title: string){
    const uid = this.authService.getUserId();
    const type = 'birthday';
    const month = moment(date).format('MMMM');
    // console.log(date, month, title, type, uid, [dogId]);
    this.afStore.collection('events/').add({date, month, title, type, uid, dogs: [dogId]});
  }

  addReminder(dogs: string[], date: Date, title: string){
    const uid = this.authService.getUserId();
    const type = 'reminder';
    const month = moment(date).format('MMMM');
    const completed = false;
    // console.log(date, month, title, type, uid, dogs);
    return this.afStore.collection('reminders/').add({date, month, title, type, uid, dogs, completed});
  }
}
