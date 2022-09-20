const StateVisualization = ({ state = {} }) => {
  const entries = [...Object.entries(state)];

  return (
    <table className="bg-indigo-300 border-collapse w-full table-fixed">
      <tbody>
        {entries.map(([key, value]) => (
          <tr key={key} className="border-2">
            <th className="text-left border-2 p-2">{key}</th>
            <td className="text-right border-2 p-2">
              {String(value) || 'undefined'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StateVisualization;
