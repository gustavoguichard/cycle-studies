import { Observable as Obs } from 'rx'
import {h} from '@cycle/dom'

const model = (weight$, height$) => {
  return Obs.combineLatest(
    weight$, height$,
    (weight, height) => {
      const heightMeters = height * .01
      return Math.round(weight / Math.pow(heightMeters, 2))
    }
  )
}

const view = bmi$ => bmi$.map(bmi =>
  h('h2', `BMI is ${bmi}`)
)

export default (weight$, height$) => {
  const bmi$ = model(weight$, height$)
  const vtree$ = view(bmi$)
  return {
    DOM: vtree$,
  }
}