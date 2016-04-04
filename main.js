import Rx from 'rx'
import Cycle from '@cycle/core'
import {h, h1, span, makeDOMDriver} from '@cycle/dom'

const main = sources => {
  const mouseover$ = sources.DOM
    .select('span')
    .events('mouseover')
  const sinks = {
    DOM: mouseover$
      .startWith(null)
      .flatMapLatest(() =>
        Rx.Observable.timer(0, 1000)
          .map(i =>
            h1({style: {background: 'red'}}, [
              span(`seconds elapsed ${i}`)
            ]))
      ),
    Log: Rx.Observable.timer(0, 2000).map(i => 2*i)
  }
  return sinks
}

const consoleLogDriver = msg$ =>
  msg$.subscribe(msg => console.log(msg))

const drivers = {
  DOM: makeDOMDriver('#app'),
  Log: consoleLogDriver
}

Cycle.run(main, drivers)