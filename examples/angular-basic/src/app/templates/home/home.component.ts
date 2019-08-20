import { Component, OnInit } from '@angular/core';
import { FlamelinkService } from '../../shared/services/flamelink.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  content: any;
  posts: any[];

  constructor(private _fl: FlamelinkService) { }

  ngOnInit() {
    this._fl.getApp().content.subscribe({
      schemaKey: 'schemaDemo',
      populate: ['banner'],
      callback: (error, data) => {
        if (error) {
          return console.error(error);
        }

        this.content = data;
      }
    });

    this._fl.getApp().content.subscribe({
      schemaKey: 'collectionDemo',
      callback: (error, data) => {
        if (error) {
          return console.error(error);
        }

        this.posts = Object.values(data);
      }
    });
  }
}
