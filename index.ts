import {
  interval,
  fromEvent,
  Subscription,
  Subject,
  ReplaySubject,
  concat,
} from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

let data$ = new Subject<any>();

let buffer$ = new ReplaySubject<any>();
let bs = data$.subscribe(buffer$);

let buffObs = new ReplaySubject<ReplaySubject<any>>(1);

buffObs.next(buffer$);

let repeater$ = concat(
  buffObs.pipe(
    takeUntil(data$),
    switchMap((e) => e)
  ),
  data$
);

// Begin Test
data$.next(1);
data$.next(2);
data$.next(3);

console.log('rep1 sub');
let r1 = repeater$.subscribe((e) => {
  console.log('rep1 ' + e);
});

// Begin Buffer Clear Sequence
bs.unsubscribe();
buffer$.complete();

buffer$ = new ReplaySubject();
bs = data$.subscribe(buffer$);
buffObs.next(buffer$);
// End Buffer Clear Sequence

console.log('rep2 sub');
let r2 = repeater$.subscribe((e) => {
  console.log('rep2 ' + e);
});

data$.next(4);
data$.next(5);
data$.next(6);

r1.unsubscribe();
r2.unsubscribe();

data$.next(7);
data$.next(8);
data$.next(9);

console.log('rep3 sub');
let r3 = repeater$.subscribe((e) => {
  console.log('rep3 ' + e);
});
