import { useState } from "react";
import { FC } from "react";
import { DataSheetGrid, checkboxColumn, keyColumn, textColumn } from "react-datasheet-grid";
import 'react-datasheet-grid/dist/style.css';

type DataRow = {
  active: boolean;
  firstName: string;
  lastName: string;
};

const Example: React.FC = () => {
  const [data, setData] = useState<DataRow[]>([
    { active: true, firstName: 'Elon', lastName: 'Musk' },
    { active: false, firstName: 'Jeff', lastName: 'Bezos' },
  ]);

  const columns = [
    {
      ...keyColumn("active", checkboxColumn as any),
      title: "Active",
    },
    {
      ...keyColumn("firstName", textColumn as any),
      title: "First name",
    },
    {
      ...keyColumn("lastName", textColumn as any),
      title: "Last name",
    },
  ];

  console.log("Columns: ", columns);  // Log columns for debugging
  console.log("Data: ", data);      // Log data for debugging

  return (
    <div>
      {/* Debugging: Render columns and data */}
      <div>
        <h3>Columns:</h3>
        <pre>{JSON.stringify(columns, null, 2)}</pre>
      </div>
      <div>
        <h3>Data:</h3>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>

      {/* DataSheetGrid rendering */}
      <DataSheetGrid<DataRow>
        value={data}
        onChange={setData}
        columns={columns}
      />
    </div>
  );
};

export default Example;
