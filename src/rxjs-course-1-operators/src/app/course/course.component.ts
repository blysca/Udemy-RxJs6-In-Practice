import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll, shareReplay, throttle, throttleTime
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat, interval} from 'rxjs';
import {Lesson} from '../model/lesson';
import {createHttpObservable} from '../common/util';


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {
  courseId: string;
  course$: Observable<Course | {}>;
  lessons$: Observable<Lesson[]>;
  
  
  @ViewChild('searchInput', {static: true}) input: ElementRef;
  
  constructor(private route: ActivatedRoute) {
  
  
  }
  
  ngOnInit() {
    this.courseId = this.route.snapshot.params['id'];
    
    this.course$ = createHttpObservable(`/api/courses/${this.courseId}`);
  }
  
  ngAfterViewInit() {
    fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map((event: any) => event.target.value),
        startWith(''),
        throttleTime(500) // debounceTime(400),
        /*distinctUntilChanged(),
        switchMap(search => this.loadLessons(search))*/
      )
      .subscribe(console.log);
  }
  
  loadLessons(search = ''): Observable<Lesson[]> {
    return createHttpObservable(
      `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`
    )
      .pipe(
        map(res => res['payload'])
      );
  }
  
}
