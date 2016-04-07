import { Observable as Obs } from 'rx'
import {h} from '@cycle/dom'
import LabeledSlider from './LabeledSlider'


// Model

const model = (weight$, height$) => {
  return Obs.combineLatest(
    weight$, height$,
    (weight, height) => {
      const heightMeters = height * .01
      return Math.round(weight / Math.pow(heightMeters, 2))
    }
  )
}


// View

const view = bmi$ => bmi$.map(bmi =>
  h('h2', `BMI is ${bmi}`)
)

export default sources => {
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
  const bmi$ = model(weightSinks.value, heightSinks.value)
  const bmiVTree$ = view(bmi$)
  return {
    DOM: Obs.combineLatest(
      weightSinks.DOM, heightSinks.DOM,
    (weightVTree, heightVTree) =>
      h('div', [
        weightVTree,
        heightVTree,
        bmiVTree$,
      ])
    ),
  }
}