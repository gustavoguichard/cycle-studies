import { Observable as Obs } from 'rx'
import {h} from '@cycle/dom'


// Intent

const intent = DOMSources =>
  DOMSources.select('.clock').events('mouseover')


// Model

const model = change$ =>
  change$
    .startWith('')
    .flatMapLatest(() =>
      Rx.Observable.timer(0, 1000))


// View

const view = state$ =>
  state$.map(i =>
    h('h1', [
      h('span.clock', `seconds elapsed ${i}`)
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