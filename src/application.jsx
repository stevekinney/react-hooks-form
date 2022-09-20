import { useEffect, useState } from 'react';
import Errors from './components/errors';
import FormInput from './components/form-input';
import StateVisualization from './components/state-visualization';

export const Application = () => {
  const [isValid, setIsValid] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [submitted, setSubmitted] = useState(false);

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

  return (
    <main class="flex flex-col md:flex-row mx-8 md:mx-auto my-8 gap-8 w-full lg:max-w-4xl items-start">
      <section className="border-8 border-pink-300 p-4 flex flex-col gap-8 shadow-pink-800 shadow-lg bg-white w-full">
        <header className="p-4 bg-pink-200 border-b-4 border-pink-400">
          <h1 className="text-6xl font-semibold">Sign Up For a Cool Thing</h1>
        </header>
        <Errors errors={errors} visible={submitted} />
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <FormInput
            label="First Name"
            id="firstName"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <FormInput
            label="Last Name"
            id="lastName"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <FormInput
            label="Password"
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormInput
            label="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div className="flex flex-col gap-2">
            <button disabled={!isValid && submitted}>Submit</button>
            <button onClick={handleClear} className="secondary">
              Clear
            </button>
          </div>
        </form>
      </section>
      <StateVisualization
        state={{ firstName, lastName, password, confirmPassword, isValid }}
      />
    </main>
  );
};

export default Application;
