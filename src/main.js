import Rx from 'rx'
import Cycle from '@cycle/core'
// import {makeHTTPDriver} from '@cycle/http'
import {h, makeDOMDriver} from '@cycle/dom'

const intent = DOMSource => {
  const changeWeight$ = DOMSource.select('.weight')
    .events('input').map(ev => ev.target.value)
  const changeHeight$ = DOMSource.select('.height')
    .events('input').map(ev => ev.target.value)
  return { changeWeight$, changeHeight$ }
}

const model = (changeWeight$, changeHeight$) =>
  Rx.Observable.combineLatest(
    changeWeight$.startWith(70),
    changeHeight$.startWith(170),
    (weight, height) => {
      const heightMeters = height * .01
      const bmi = Math.round(weight / (heightMeters * heightMeters))
      return { bmi, weight, height }
  })

const view = state$ =>
  state$.map(state =>
    h('div', [
      h('div', [
        h('label', `Weight: ${state.weight}kg`),
        h('input.weight', {type: 'range', min: 40, max: 150, value: state.weight})
      ]),
      h('div', [
        h('label', `Height: ${state.height}cm`),
        h('input.height', {type: 'range', min: 140, max: 220, value: state.height})
      ]),
      h('h2', `BMI is ${state.bmi}`)
    ])
  )

const main = sources => {
  const { changeWeight$, changeHeight$ } = intent(sources.DOM)
  const state$ = model(changeWeight$, changeHeight$)
  const vtree$ = view(state$)
  return {
    DOM: vtree$,
  }
}

Cycle.run(main, {
  DOM: makeDOMDriver('#app'),
})

/* Http
const main = sources => {
  const url = 'http://jsonplaceholder.typicode.com/users/1'
  const clickEvent$ = sources.DOM
    .select('.get-first').events('click')
  const request$ = clickEvent$.map(() => {
    return {
      url,
      method: 'GET',
    }
  })
  const response$$ = sources.HTTP
    .filter(response$ => response$.request.url === url)

  const response$ = response$$.switch()
  const firstUser$ = response$
    .map(response => response.body)
    .startWith({})
  return {
    DOM: firstUser$.map(firstUser =>
      h('div', [
        h('button.get-first', 'Get first user'),
        h('h1.user-name', firstUser.name),
        h('h4.user-email', firstUser.email),
        h('a.user-website', {href: 'google.com'}, firstUser.website)
      ])
    ),
    HTTP: request$,
  }
}

*/

/* Increment, decrement
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

*/

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