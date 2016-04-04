import Rx from 'rx'
import Cycle from '@cycle/core'
import {h, h1, span, makeDOMDriver} from '@cycle/dom'

const main = sources => {
  const mouseover$ = sources.DOM
    .select('span')
    .events('mouseover')
  return {
    DOM: mouseover$
      .startWith('')
      .flatMapLatest(() =>
        Rx.Observable.timer(0, 1000)
          .map(i =>
            h1({style: {background: 'blue'}}, [
              span(`seconds elapsed ${i}`)
            ]))
      ),
  }
}

Cycle.run(main, {
  DOM: makeDOMDriver('#app')
})