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
    this._fl.getApp().content.subscribe('schemaDemo', { populate: ['banner']}, (error, data) => {
      if (error) {
        console.error(error);
      }

      this.content = data;
    });

    this._fl.getApp().content.subscribe('collectionDemo', (error, data) => {
      if (error) {
        console.error(error);
      }

      this.posts = Object.keys(data).map(key => data[ key ]);
    });
  }
}
