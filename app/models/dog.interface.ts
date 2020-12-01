import { DogWeight } from './dog-weight.interface';

export interface Dog {
    id: string;
    name: string;
    kc_name: string;
    breed: string;
    color: string;
    colorText: string;
    imageUrl: string;
    dob: Date;
    // currWeight: DzdDogWeight;
    currWeight: DogWeight;
    // prevWeight: DogWeight;
    uid: string;
    sex: string;
  }
