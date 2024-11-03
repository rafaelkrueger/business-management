import React from 'react';
import { TableCustomer, TrCustomer, ThCustomer, TdCustomer } from './styles.ts';

interface Column {
  header: string;
  accessor: string; // Used to map data fields
}

interface DefaultTableProps {
  columns: Column[];
  data: any[];
  handleRow?: any;
}

const DefaultTable: React.FC<DefaultTableProps> = ({ columns, data, handleRow }) => {
  return (
    <TableCustomer>
      <thead>
        <TrCustomer>
          {columns.map((col, index) => (
            <ThCustomer key={index}>{col.header}</ThCustomer>
          ))}
        </TrCustomer>
      </thead>
      <tbody>
        {data && data.length > 0 ? (
          data.map((row, rowIndex) => (
            <TrCustomer key={rowIndex}>
              {columns.map((col, colIndex) => (
                <TdCustomer onClick={()=>{handleRow(row)}} key={colIndex}>{row[col.accessor]}</TdCustomer>
              ))}
            </TrCustomer>
          ))
        ) : (
          <TrCustomer>
            <TdCustomer colSpan={columns.length}>No data available</TdCustomer>
          </TrCustomer>
        )}
      </tbody>
    </TableCustomer>
  );
};

export default DefaultTable;
