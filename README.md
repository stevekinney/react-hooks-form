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
