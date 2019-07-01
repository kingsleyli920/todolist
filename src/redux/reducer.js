import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { createForms } from 'react-redux-form';
import { InitialSignUp } from './forms';

const reducers = {

    ...createForms({
        signUp: InitialSignUp,
    })
};
const Reducer = combineReducers(reducers);
export default Reducer;