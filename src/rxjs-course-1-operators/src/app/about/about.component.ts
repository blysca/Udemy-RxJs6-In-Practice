import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {fromEvent, interval, Observable, timer} from 'rxjs';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const http$ = new Observable( observer => {
      fetch('/api/courses')
        .then( response => {
          return response.json();
        })
        .then( body => {
          observer.next(body);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        })
    });
    
    
    http$.subscribe(
      courses => console.log('*** courses ', courses),
      error => console.log('*** error ', error), // noop,
      () => console.log('*** completed ')
      
    )
  }

}
