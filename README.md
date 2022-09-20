# Sign Up Form

Okay, so—here we have a form where you can sign up. But, we only want to enable the submit button if the form is valid. This is a pretty unrealistic form, but it's definitely good enough for our purposes.

What does it mean for the form to be valid?

- There should be a first name.
- There should be a last name.
- There should be a password and confirmation.
- The password and confirmation should match.

We have a few more constraints.

- We don't want to show the errors until they've clicked the "Submit" button, lest we start them off in an error state while they are still filling out the form.
- We want to give them a "Clear" button… for reasons.

What would this look like if we did it solely using `useState` and `useEffect`. (In fact, the `useEffect` is mostly optional here. It's mostly allowing the errors to disappear as they fix them and enabling the button once they've caught everything we're validating for.)

### Initial state

For starters, we might end up with something like this monstrousity:

```jsx
const [isValid, setIsValid] = useState(false);
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [errors, setErrors] = useState([]);
const [submitted, setSubmitted] = useState(false);

// Generate a list of errors.
useEffect(() => {
  const errors = [];

  if (!firstName) errors.push('You must provide a first name.');
  if (!lastName) errors.push('You must provide a last name.');
  if (!password) errors.push('You must provide a password.');
  if (!confirmPassword)
    errors.push('You must provide a password confirmation.');
  if (password && confirmPassword && password !== confirmPassword) {
    errors.push('Password and confirmation do not match');
  }

  setErrors(errors);
  setIsValid(!errors.length);
}, [firstName, lastName, password, confirmPassword, setErrors, setIsValid]);

const handleSubmit = (e) => {
  e.preventDefault();
  setSubmitted(true);
};

const handleClear = (e) => {
  e.preventDefault();

  setFirstName('');
  setLastName('');
  setPassword('');
  setConfirmPassword('');
  setSubmitted(false);
  setErrors([]);
};
```

And this is a relatively simple form. Good luck testing this.

## Refactoring using a reducer

Let's start off with the shape of our state.

```js
const defaultState = {
  firstName: '',
  lastName: '',
  password: '',
  confirmPassword: '',
  submitted: false,
};
```

You'll notice that I left out `errors` and `isValid`. This is mostly because they're derived from everything else and _not_ something that the user iteracts with themselves.

### Creating usuable actions

Really, the interaction model looks like this:

1. They can update fields.
2. They can submit the form.
3. They can clear it.

Everything else basically stems from those these actions. I was clever in-so-far that the names of my inputs and the names of the keys in my state are the same. So, I can get away with a reducer that looks like this:

```js
const reducer = (state, action) => {
  if (action.type === 'UPDATE_FIELD') {
    return {
      ...state,
      [action.payload.key]: action.payload.value,
    };
  }

  if (action.type === 'SUBMIT_FORM') {
    return {
      ...state,
      submitted: true,
    };
  }

  if (action.type === 'CLEAR_FORM') {
    return defaultState;
  }

  return state;
};
```

This means that we can get most of the way there with the following:

```js
const [state, dispatch] = useReducer(reducer, defaultState);
const { firstName, lastName, password, confirmPassword, submitted } = state;

const errors = []; // TO BE IMPLEMENTED
const isValid = false; // TO BE IMPLEMENTED

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
```

And then we switch the `onChange` handlers as follows:

```jsx
<FormInput
  label="First Name"
  id="firstName"
  name="firstName"
  value={firstName}
  onChange={updateField}
/>
```

## A naïve approach to deriving state

Now we need to deal with the errors and validity. Let's start with the simplest possible approach. We can just inline it:

```js
const errors = [];

if (!firstName) errors.push('You must provide a first name.');
if (!lastName) errors.push('You must provide a last name.');
if (!password) errors.push('You must provide a password.');
if (!confirmPassword) errors.push('You must provide a password confirmation.');
if (password && confirmPassword && password !== confirmPassword) {
  errors.push('Password and confirmation do not match');
}

const isValid = !errors.length;
```

This will work with one edge case: It'll say submitted whenever you clear the errors—even if you didn't resubmit.

We can fix that real quick with the following logic:

```js
const showErrors = submitted && (!edited || !isValid);
```

## A quick refactor

We can simplify this a bit by pulling out the error logic.

```js
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
```

Now, the logic in our component is a lot simpler:

```js
const [state, dispatch] = useReducer(reducer, defaultState);
const { firstName, lastName, password, confirmPassword, submitted, edited } =
  state;

const errors = checkForErrors(state);
const isValid = !errors.length;
const showErrors = submitted && (!edited || !isValid);

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
```
