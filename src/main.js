import { Observable as Obs } from 'rx'
import Cycle from '@cycle/core'
import { makeHTTPDriver } from '@cycle/http'
import { h, makeDOMDriver } from '@cycle/dom'
import LabeledSlider from './components/LabeledSlider'
import BMI from './components/BMI'
import Hello from './components/Hello'
import Increment from './components/Increment'
import RequestUser from './components/RequestUser'
import Clock from './components/Clock'

const main = sources => {
  const heightSinks = LabeledSlider({
    DOM: sources.DOM,
    props: Obs.of({
      label: 'Height',
      unit: 'cm',
      min: 140,
      max: 220,
      init: 170,
    })
  })
  const weightSinks = LabeledSlider({
    DOM: sources.DOM,
    props: Obs.of({
      label: 'Weight',
      unit: 'kg',
      min: 40,
      max: 150,
      init: 70,
    })
  })
  const bmi = BMI(weightSinks.value, heightSinks.value)
  const hello = Hello(sources)
  const incDec = Increment(sources)
  const clock = Clock(sources)
  const user = RequestUser(sources)
  const vtree$ = Obs.combineLatest(
    bmi.DOM, weightSinks.DOM, heightSinks.DOM,
    hello.DOM, incDec.DOM, clock.DOM, user.DOM,
    (bmiVTree, weightVTree, heightVTree, helloVTree,
      incVTree, clockVTree, userVTree) =>
      h('div', [
        weightVTree,
        heightVTree,
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
