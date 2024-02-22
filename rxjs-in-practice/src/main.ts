import { fromFetch } from 'rxjs/fetch';
import './style.css'
import { catchError, map, retry, switchMap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { EMPTY, Subject, fromEvent } from 'rxjs';
import { formatDistance, parse } from 'date-fns';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = ` 
  <div>
    Hello
  </div>
`

//DOMException.jd
export function updateTheDOMHere(res: any) {
}

//api.js
export const mySubject = new Subject();
export const myAPIResponse = mySubject.pipe(switchMap(() => fromFetch('https')));

//main.js
function onCLickHandler(evt: Event) {
  mySubject.next(evt);
}

myAPIResponse.subscribe(res => {
  updateTheDOMHere(res);
})

//Diffrent Example

const observable = fromEvent(document.body, 'click').pipe(
  switchMap(() =>
    fromFetch("https://go-kart-api.onrender.com/runs/SN2780_210722_11H00_NADINE_IDUBE_RACEWAY_16_5554").pipe(
      switchMap(res => fromPromise(res.json())),
      map(json => ({
        summary:`${json.trackName} - ${json.sessionName} - ${json.driver}`,
        dateTime: parse(json.date + ' ' + json.time, 'dd-MM-yyyy HH:mm', new Date()),
      })),
      catchError(err => {
        console.error(err);
        return EMPTY;
      })
    )
  ),
  retry(3),
  catchError(err => {
    console.error(err);
    return EMPTY;
  })
);

observable.subscribe(res => {
  document.body.innerText = `${res.summary} <br/> ${formatDistance(res.dateTime, Date.now(), {addSuffix: true})}`;
});


