import { Observable as Obs } from 'rx'
import {h} from '@cycle/dom'

const url = 'http://jsonplaceholder.typicode.com/users/1'

const intent = sources => {
  return {
    clickEvent$: sources.DOM.select('.get-first').events('click'),
    response$$: sources.HTTP.filter(response$ => response$.request.url === url)
  }
}

const model = ({ clickEvent$, response$$ }) => {
  const response$ = response$$.switch()
  return {
    state$: response$
      .map(response => response.body)
      .startWith({}),
    request$: clickEvent$.map(() => ({ url, method: 'GET' })),
  }
}

const view = firstUser$ =>
  firstUser$.map(firstUser =>
    h('div', [
      h('button.get-first', 'Get first user'),
      h('h1.user-name', firstUser.name),
      h('h4.user-email', firstUser.email),
      h('a.user-website', {href: 'google.com'}, firstUser.website)
    ])
  )

export default sources => {
  const change$ = intent(sources)
  const model$ = model(change$)
  const vtree$ = view(model$.state$)
  return {
    DOM: vtree$,
    HTTP: model$.request$,
  }
}