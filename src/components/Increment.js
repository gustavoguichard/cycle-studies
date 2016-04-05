import { Observable as Obs } from 'rx'
import {h} from '@cycle/dom'

const intent = DOMSources => {
  return {
    incrementClick$: DOMSources.select('.increment').events('click'),
    decrementClick$: DOMSources.select('.decrement').events('click'),
  }
}

const model = ({ incrementClick$, decrementClick$ }) => {
  const decrementAction$ = decrementClick$.map(ev => -1)
  const incrementAction$ = incrementClick$.map(ev => +1)

  return Obs.of(0)
    .merge(decrementAction$)
    .merge(incrementAction$)
    .scan((prev, curr) => prev + curr)
}

const view = number$ =>
  number$.map(number =>
    h('div', [
      h('button.decrement', 'Decrement'),
      h('button.increment', 'Increment'),
      h('p',
        h('label', String(number))
      )
    ])
  )

export default sources => {
  const change$ = intent(sources.DOM)
  const state$ = model(change$)
  const vtree$ = view(state$)
  return {
    DOM: vtree$,
  }
}