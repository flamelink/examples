import { Injectable, Inject } from '@angular/core';
import * as firebase from 'firebase';
import * as flamelink from 'flamelink';
import { FirebaseApp } from 'angularfire2';

@Injectable({
  providedIn: 'root'
})
export class FlamelinkService {

  // GET|SET flApp
  private _flApp: any;
  get flApp(): any {
    return this._flApp;
  }
  set flApp(value: any) {
    this._flApp = value;
  }

  constructor(@Inject(FirebaseApp) private _fb: firebase.app.App) {
    this.flApp = flamelink({
      firebaseApp: this._fb,
      env: 'production',
      locale: 'en-US'
    });
  }

  getApp() {
    return this.flApp;
  }
}
