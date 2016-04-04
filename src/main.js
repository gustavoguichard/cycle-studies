import Rx from 'rx'
import Cycle from '@cycle/core'
import {h, makeDOMDriver} from '@cycle/dom'

const main = sources => {
  const decrementClick$ = sources.DOM
    .select('.decrement').events('click')
  const incrementClick$ = sources.DOM
    .select('.increment').events('click')
  const decrementAction$ = decrementClick$.map(ev => -1)
  const incrementAction$ = incrementClick$.map(ev => +1)

  const number$ = Rx.Observable.of(0)
    .merge(decrementAction$)
    .merge(incrementAction$)
    .scan((prev, curr) => prev + curr)

  return {
    DOM: number$.map(number =>
      h('div', [
        h('button.decrement', 'Decrement'),
        h('button.increment', 'Increment'),
        h('p',
          h('label', String(number))
        )
      ])
    )
  }
}

Cycle.run(main, {
  DOM: makeDOMDriver('#app')
})

/* Clock
const main = sources => {
  const mouseover$ = sources.DOM.select('span').events('mouseover')
  return {
    mouseover$
    .startWith('')
    .flatMapLatest(() =>
      Rx.Observable.timer(0, 1000)
        .map(i =>
          h('h1', {style: {background: 'blue'}}, [
            h('span', `seconds elapsed ${i}`)
          ])
        )
    ),
  };
}
*/

/* Hello World
const main = sources => {
  const inputEv$ = sources.DOM.select('.field').events('input')
  const name$ = inputEv$
    .map(ev => ev.target.value)
    .startWith('')
  return {
    DOM: name$
    .map(name =>
      h('div', [
        h('label', 'Name:'),
        h('input.field', {type: 'text'}),
        h('hr'),
        h('h1',`Hello ${name}!`)
      ])
    )
  };
}
*/