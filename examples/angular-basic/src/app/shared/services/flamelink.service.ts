import { Injectable, Inject } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/database'
import 'firebase/storage'
import 'firebase/auth'
import { FirebaseApp } from '@angular/fire';
import flamelink from 'flamelink/app';
import 'flamelink/rtdb/content'
import 'flamelink/rtdb/navigation'
import 'flamelink/rtdb/storage'

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
      dbType: 'rtdb' // dbType should match the imports (rtdb or cf)
    });
  }

  getApp() {
    return this.flApp;
  }
}
