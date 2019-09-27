import {Component, OnInit} from '@angular/core';
import {interval, noop, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delayWhen, map, filter, shareReplay, tap, finalize} from 'rxjs/operators';

import {createHttpObservable} from '../common/util';
import {Course} from '../model/course';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  beginnersCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;
  
  ngOnInit() {
    const http$ = createHttpObservable('/api/courses');
    
    const courses$ = http$
      .pipe(
        catchError((err) => {
          console.log('*** Error occurred ', err);
          return throwError(err);
        }),
        finalize( () =>{
          console.log('*** Finalize executed... ');
        }),
        tap(() => console.log('*** Http request executed')),
        map(res => Object.values(res['payload'])),
        shareReplay(),
        
      );
    
    this.beginnersCourses$ = courses$.pipe(
      map((courses: Course[]) => {
          return courses.filter(course => course.category == 'BEGINNER');
        }
      )
    );
    
    this.advancedCourses$ = courses$.pipe(
      map((courses: Course[]) => {
          return courses.filter(course => course.category == 'ADVANCED');
        }
      )
    );
    
    
    courses$.subscribe(
      (courses: Course[]) => {
        console.log('*** courses ', courses);
      },
      noop, // error => console.log('*** error ', error),
      () => console.log('*** completed ')
    );
  }
  
}
