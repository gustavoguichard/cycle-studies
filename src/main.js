import Rx from 'rx'
import Cycle from '@cycle/core'
import {h, div, hr, input, label, h1, span, makeDOMDriver} from '@cycle/dom'

const main = sources => {
  const inputEv$ = sources.DOM.select('.field').events('input')
  const name$ = inputEv$
    .map(ev => ev.target.value)
    .startWith('')
  // const mouseover$ = sources.DOM.select('span').events('mouseover')
  return {
    DOM: name$
    // mouseover$
    // .startWith('')
    // .flatMapLatest(() =>
    //   Rx.Observable.timer(0, 1000)
    //     .map(i =>
    //       h1({style: {background: 'blue'}}, [
    //         span(`seconds elapsed ${i}`)
    //       ])
    //     )
    // ),
    .map(name =>
      div([
        label('Name:'),
        input('.field', {type: 'text'}),
        hr(),
        h1(`Hello ${name}!`)
      ])
    )
  };
}

Cycle.run(main, {
  DOM: makeDOMDriver('#app')
})