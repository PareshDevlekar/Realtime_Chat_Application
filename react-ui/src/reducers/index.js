import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
// reducers
import rooms from './rooms'
import user from './user'
import currRoom from './currRoom';
import isFetching from './isFetching';
const rootReducer = combineReducers({rooms, user, currRoom, isFetching, routing: routerReducer });

export default rootReducer;
