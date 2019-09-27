import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {debounceTime, distinctUntilChanged, map, startWith, switchMap} from 'rxjs/operators';
import {fromEvent, Observable} from 'rxjs';
import {Lesson} from '../model/lesson';
import {createHttpObservable} from '../common/util';
import {debug, RxJsLoggingLevel, setRxJsLoggingLevel} from '../common/debug';


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
    
    this.course$ = createHttpObservable(`/api/courses/${this.courseId}`)
      .pipe(
        debug( RxJsLoggingLevel.INFO, 'course value  ')
      );
    
    setRxJsLoggingLevel(RxJsLoggingLevel.TRACE);
  }
  
  ngAfterViewInit() {
    this.lessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map((event: any) => event.target.value),
        startWith(''),
        debug(RxJsLoggingLevel.TRACE, 'search '),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => this.loadLessons(search)),
        debug(RxJsLoggingLevel.DEBUG, 'lessons value'),
      );
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
