import { Observable as Obs } from 'rx'
import Cycle from '@cycle/core'
import { makeHTTPDriver } from '@cycle/http'
import { h, makeDOMDriver } from '@cycle/dom'
import BMI from './components/BMI'
import Hello from './components/Hello'
import Counter from './components/Counter'
import User from './components/User'
import Clock from './components/Clock'

const main = sources => {
  const bmi = BMI(sources)
  const hello = Hello(sources)
  const incDec = Counter(sources)
  const clock = Clock(sources)
  const user = User(sources)
  const vtree$ = Obs.combineLatest(
    bmi.DOM, hello.DOM, incDec.DOM, clock.DOM, user.DOM,
    (bmiVTree, helloVTree, incVTree, clockVTree, userVTree) =>
      h('div', [
        bmiVTree,
        h('hr'),
        helloVTree,
        h('hr'),
        incVTree,
        h('hr'),
        clockVTree,
        h('hr'),
        userVTree,
      ])
  )
  return {
    DOM: vtree$,
  }
}

Cycle.run(main, {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver(),
})
