import { DogWeight } from './dog-weight.interface';

export interface Dog {
    id: string;
    name: string;
    kcName?: string;
    breed: string;
    color: string;
    colorText: string;
    imageUrl: string;
    microchip?: object;
    dateOfBirth: Date;
    dob?: any;
    currWeight?: DogWeight;
    prevWeight?: DogWeight;
    uid: string;
    sex?: string;
    isRemoved: boolean;
    entire?: boolean;
    neuteredDate?: Date;
  }
