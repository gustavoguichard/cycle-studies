import { Observable as Obs } from 'rx'
import {h} from '@cycle/dom'


// Intent

const intent = DOMSources =>
  DOMSources.select('.field').events('input')


// Model

const model = change$ =>
  change$
    .map(ev => ev.target.value)
    .startWith('')


// View

const view = name$ =>
  name$.map(name =>
    h('div', [
      h('label', 'Name:'),
      h('input.field', {type: 'text'}),
      h('hr'),
      h('h1',`Hello ${name}!`)
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