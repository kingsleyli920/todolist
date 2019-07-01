import {createStore, combineReducers, applyMiddleware } from 'redux';
// import { sessionService } from 'redux-react-session';
import Reducer from './reducer';
import thunk from 'redux-thunk';
import logger from 'redux-logger';


export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            Reducer
        }),
        applyMiddleware(thunk, logger)
    );
    // sessionService.initSessionService(store);
    return store;
}