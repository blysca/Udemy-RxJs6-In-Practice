import {Component, OnInit} from '@angular/core';
import {concat, interval, merge, of} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  
  constructor() {
  }
  
  ngOnInit() {
    const source1$ = interval(1000);
    const source2$ = source1$.pipe(map(val => 10* val));
    const source3$ = of('a', 'k', 'x');
    const source4$ = of(7, 8, 9);
    
    const result$ = merge(source1$, source2$);
    
    /*result$.subscribe(
      value => console.log('*** value = ', value),
      error => console.log('*** value = ', error),
      () => console.log('*** completed '),
    );*/
    
    result$.subscribe(console.log)
  }
  
}
