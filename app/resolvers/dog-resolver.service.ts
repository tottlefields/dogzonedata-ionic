import { switchMap, finalize, take } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { DogsService } from '../services/dogs.service';

@Injectable({
  providedIn: 'root'
})
export class DogResolverService implements Resolve<any> {

  constructor(
    private dogsService: DogsService,
    private loadingCtrl: LoadingController
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    let id = route.paramMap.get('dogId');
    let loading: HTMLIonLoadingElement;

    const loadingPrompt = this.loadingCtrl.create({
      message: 'Fetching details...'
    });

    return from(loadingPrompt).pipe(
      switchMap((loadingElem) => {
        loading = loadingElem;
        return from(loading.present());
      }),
      switchMap(() => {
        return this.dogsService.getDog(id);
      }),
      take(1),
      finalize(() => {
        this.loadingCtrl.dismiss();
      })
    );
  }
}
