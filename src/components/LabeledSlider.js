import { Observable as Obs } from 'rx'
import {h} from '@cycle/dom'
import isolate from '@cycle/isolate'

const intent = DOMSource => DOMSource.select('.slider')
  .events('input')
  .map(ev => ev.target.value)

const model = (newValue$, props$) => {
  const initialValue$ = props$.map(props => props.init).first()
  const value$ = initialValue$.concat(newValue$)
  return Obs.combineLatest(value$, props$, (value, props) => {
    return { ...props, value }
  })
}

const view = state$ =>
  state$.map(state =>
    h('.labeled-slider', [
      h('label.label', `${state.label} ${state.value + state.unit}`),
      h('input.slider', {type: 'range', ...state})
    ])
  )

const LabeledSlider = sources => {
  const change$ = intent(sources.DOM)
  const state$ = model(change$, sources.props)
  const vtree$ = view(state$)
  return {
    DOM: vtree$,
    value: state$.map(state => state.value),
  }
}

export default sources => isolate(LabeledSlider)(sources)