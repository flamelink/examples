import { Injectable, Inject } from '@angular/core';
import * as firebase from 'firebase';
import * as flamelink from 'flamelink';
import { FirebaseApp } from 'angularfire2';

@Injectable({
  providedIn: 'root'
})
export class FlamelinkService {

  // GET|SET flApp
  private _flApp: flamelink.App;
  get flApp(): flamelink.App {
    return this._flApp;
  }
  set flApp(value: flamelink.App) {
    this._flApp = value;
  }

  constructor(@Inject(FirebaseApp) private _fb: firebase.app.App) {
    const config: flamelink.FlamelinkConfig = {
      firebaseApp: this._fb,
      env: 'production',
      locale: 'en-US'
    };
    this.flApp = flamelink(config);
  }

  getApp() {
    return this.flApp;
  }
}
