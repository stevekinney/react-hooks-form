const Errors = ({ errors, visible }) => {
  if (!visible) return null;
  if (!errors.length)
    return (
      <div className="px-8 bg-red-100 py-4 border-2 border-green-500 text-green-900">
        Successfully submitted!
      </div>
    );

  return (
    <ul className="list-disc pl-8 bg-red-100 py-4 border-2 border-red-500 text-red-900">
      {errors.map((error) => (
        <li key={error}>{error}</li>
      ))}
    </ul>
  );
};

export default Errors;
