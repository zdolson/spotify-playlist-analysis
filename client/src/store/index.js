import {createStore} from 'redux'
import reducers from './reducers';
import middleware from './middleware'

const store = createStore(reducers, middleware);

if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./reducers', () => store.replaceReducer(reducers))
}

export default store;