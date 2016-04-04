import Rx from 'rx'
import Cycle from '@cycle/core'

const h = (tagName, children) => ({ tagName, children })
const h1 = children => h('H1', children)
const span = children => h('SPAN', children)

const main = sources => {
  const mouseover$ = sources.DOM.selectEvents('span', 'mouseover')
  const sinks = {
    DOM: mouseover$
      .startWith(null)
      .flatMapLatest(() =>
        Rx.Observable.timer(0, 1000)
          .map(i =>
            h1([
              span([`seconds elapsed ${i}`])
            ]))
      ),
    Log: Rx.Observable.timer(0, 2000).map(i => 2*i)
  }
  return sinks
}

const makeDOMDriver = mountSelector => (
  obj$ => {
    const createElement = obj => {
      const element = document.createElement(obj.tagName)
      obj.children
        .filter(c => typeof c === 'object')
        .map(createElement)
        .forEach(c => element.appendChild(c))
      obj.children
        .filter(c => typeof c === 'string')
        .forEach(c => element.innerHTML = c)
      return element
    }
    obj$.subscribe(obj => {
      const container = document.querySelector(mountSelector)
      container.innerHTML = ''
      const element = createElement(obj)
      container.appendChild(element)
    })

    return {
      selectEvents: (tagName, eventType) =>
        Rx.Observable.fromEvent(document, eventType)
          .filter(ev => ev.target.tagName === tagName.toUpperCase())
    }
  }
)

const consoleLogDriver = msg$ =>
  msg$.subscribe(msg => console.log(msg))

const drivers = {
  DOM: makeDOMDriver('#app'),
  Log: consoleLogDriver
}

Cycle.run(main, drivers)