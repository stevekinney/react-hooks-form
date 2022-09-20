import { useEffect, useReducer, useState } from 'react';
import Errors from './components/errors';
import FormInput from './components/form-input';
import StateVisualization from './components/state-visualization';

const defaultState = {
  firstName: '',
  lastName: '',
  password: '',
  confirmPassword: '',
  submitted: false,
  edited: false,
};

const reducer = (state, action) => {
  if (action.type === 'UPDATE_FIELD') {
    return {
      ...state,
      [action.payload.key]: action.payload.value,
      edited: true,
    };
  }

  if (action.type === 'SUBMIT_FORM') {
    return {
      ...state,
      edited: false,
      submitted: true,
    };
  }

  if (action.type === 'CLEAR_FORM') {
    return defaultState;
  }

  return state;
};

const checkForErrors = (state) => {
  const errors = [];

  if (!state.firstName) errors.push('You must provide a first name.');
  if (!state.lastName) errors.push('You must provide a last name.');
  if (!state.password) errors.push('You must provide a password.');
  if (!state.confirmPassword)
    errors.push('You must provide a password confirmation.');
  if (
    state.password &&
    state.confirmPassword &&
    state.password !== state.confirmPassword
  ) {
    errors.push('Password and confirmation do not match');
  }

  return errors;
};

export const Application = () => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const { firstName, lastName, password, confirmPassword, submitted, edited } =
    state;

  const errors = checkForErrors(state);
  const showErrors = submitted && (!edited || errors.length);

  const updateField = (event) => {
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        key: event.target.name,
        value: event.target.value,
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: 'SUBMIT_FORM' });
  };

  const handleClear = (e) => {
    e.preventDefault();
    dispatch({ type: 'CLEAR_FORM' });
  };

  return (
    <main class="flex flex-col md:flex-row mx-8 md:mx-auto my-8 gap-8 w-full lg:max-w-4xl items-start">
      <section className="border-8 border-pink-300 p-4 flex flex-col gap-8 shadow-pink-800 shadow-lg bg-white w-full">
        <header className="p-4 bg-pink-200 border-b-4 border-pink-400">
          <h1 className="text-6xl font-semibold">Sign Up For a Cool Thing</h1>
        </header>
        <Errors errors={errors} visible={showErrors} />
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <FormInput
            label="First Name"
            id="firstName"
            name="firstName"
            value={firstName}
            onChange={updateField}
          />
          <FormInput
            label="Last Name"
            id="lastName"
            name="lastName"
            value={lastName}
            onChange={updateField}
          />
          <FormInput
            label="Password"
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={updateField}
          />
          <FormInput
            label="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={updateField}
          />
          <div className="flex flex-col gap-2">
            <button disabled={showErrors}>Submit</button>
            <button onClick={handleClear} className="secondary">
              Clear
            </button>
          </div>
        </form>
      </section>
      <StateVisualization state={state} />
    </main>
  );
};

export default Application;
