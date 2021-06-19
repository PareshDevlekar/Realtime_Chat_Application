import { createStore, applyMiddleware } from 'redux';
import { syncHistoryWithStore} from 'react-router-redux';
import { createBrowserHistory } from 'history';
import thunk from 'redux-thunk'
// import the root reducer
import rootReducer from './reducers/index';

// for redux dev tools
// const enhancers = compose(
// 	window.devToolsExtension? window.devToolsExtension(): f=>f,
// 	applyMiddleware(thunk)
// );

// create store
const store = createStore(rootReducer, applyMiddleware(thunk));
window.store = store;
// save store history
export const history = syncHistoryWithStore(createBrowserHistory(), store);

// allows hot refresh for reducers as well
if(module.hot) {
  module.hot.accept('./reducers/',() => {
    const nextRootReducer = require('./reducers/index').default;
    store.replaceReducer(nextRootReducer);
  });
}

export default store;
