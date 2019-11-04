import { Injectable, Inject } from '@angular/core';
import * as firebase from 'firebase/app';
// import 'firebase/database' if you're using Realtime Database
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';
import { FirebaseApp } from '@angular/fire';
import flamelink from 'flamelink/app';
// Import all Flamelink modules you're going to use (replace `cf` with `rtdb` if using the Realtime Database)
import 'flamelink/cf/settings';
import 'flamelink/cf/content';
import 'flamelink/cf/navigation';
import 'flamelink/cf/storage';
import 'flamelink/cf/users';

@Injectable({
  providedIn: 'root'
})
export class FlamelinkService {

  // GET|SET flApp
  private _flApp: flamelink.app.App;

  get flApp() {
    return this._flApp;
  }

  set flApp(value) {
    this._flApp = value;
  }

  constructor(@Inject(FirebaseApp) private _fb: firebase.app.App) {
    this.flApp = flamelink({
      firebaseApp: this._fb,
      env: 'production',
      locale: 'en-US',
      dbType: 'cf' // dbType should match the imports (rtdb or cf)
    });
  }

  getApp() {
    return this.flApp;
  }
}
