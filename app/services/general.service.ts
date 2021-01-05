import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor() { }

  base64toBlob(base64Data, contentType) {
    contentType = contentType || '';
    const sliceSize = 1024;
    const byteCharacters = window.atob(base64Data);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      const begin = sliceIndex * sliceSize;
      const end = Math.min(begin + sliceSize, bytesLength);

      const bytes = new Array(end - begin);
      for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  getOrdinal(num: number) {
    num = Math.round(num);
    let numString = num.toString();
    
    // If the ten's place is 1, the suffix is always "th"
    // (10th, 11th, 12th, 13th, 14th, 111th, 112th, etc.)
    if (Math.floor(num / 10) % 10 === 1) {
      return numString + "th";
    }
    
    // Otherwise, the suffix depends on the one's place as follows
    // (1st, 2nd, 3rd, 4th, 21st, 22nd, etc.)
    switch (num % 10) {
      case 1: return numString + "st";
      case 2: return numString + "nd";
      case 3: return numString + "rd";
      default: return numString + "th";
    }
  }

  capitalizeWords(s: string) {
    return s.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
  }

  getColor(code: string){
    let color = null;
    environment.dogColors.forEach(c => {
      if (c.code == code){
        color = c;
      }
    });
    return color;
  }

}
