import Rx from 'rx'
import Cycle from '@cycle/core'
// import {makeHTTPDriver} from '@cycle/http'
import {h, makeDOMDriver} from '@cycle/dom'
import isolate from '@cycle/isolate'

const intent = DOMSource => DOMSource.select('.slider')
  .events('input')
  .map(ev => ev.target.value)

const model = (newValue$, props$) => {
  const initialValue$ = props$.map(props => props.init).first()
  const value$ = initialValue$.concat(newValue$)
  return Rx.Observable.combineLatest(value$, props$, (value, props) => {
    return { ...props, value }
  })
}

const view = state$ => {
  return state$.map(state =>
    h('.labeled-slider', [
      h('label.label', `${state.label} ${state.value + state.unit}`),
      h('input.slider', {type: 'range', ...state})
    ])
  )
}

const LabeledSlider = sources => {
  const change$ = intent(sources.DOM)
  const state$ = model(change$, sources.props)
  const vtree$ = view(state$)
  return {
    DOM: vtree$,
    value: state$.map(state => state.value),
  }
}
const LabeledSliderCx = sources => isolate(LabeledSlider)(sources)

const main = sources => {
  const heightProps$ = Rx.Observable.of({
    label: 'Height',
    unit: 'cm',
    min: 140,
    max: 220,
    init: 170,
  })
  const weightProps$ = Rx.Observable.of({
    label: 'Weight',
    unit: 'kg',
    min: 40,
    max: 150,
    init: 70,
  })
  const heightSinks = LabeledSliderCx({DOM: sources.DOM, props: heightProps$})
  const weightSinks = LabeledSliderCx({DOM: sources.DOM, props: weightProps$})
  const weightValue$ = weightSinks.value
  const heightValue$ = heightSinks.value
  const bmi$ = Rx.Observable.combineLatest(weightValue$, heightValue$,
    (weight, height) => {
      const heightMeters = height * .01
      return Math.round(weight / Math.pow(heightMeters, 2))
    })
  const vtree$ = Rx.Observable.combineLatest(
    bmi$, weightSinks.DOM, heightSinks.DOM,
    (bmi, weightVTree, heightVTree) =>
      h('div', [
        weightVTree,
        heightVTree,
        h('h2', `BMI is ${bmi}`)
      ])
  )
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