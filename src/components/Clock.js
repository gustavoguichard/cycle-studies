import { Observable as Obs } from 'rx'
import {h} from '@cycle/dom'

const intent = DOMSources =>
  DOMSources.select('.clock').events('mouseover')

const model = change$ =>
  change$
    .startWith('')
    .flatMapLatest(() =>
      Rx.Observable.timer(0, 1000))

const view = state$ =>
  state$.map(i =>
    h('h1', {style: {textDecoration: 'line-through'}}, [
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