import React from 'react';
import {
  TableCustomer,
  TrCustomer,
  ThCustomer,
  TdCustomer,
  CardContainer,
  DataCard,
  CardField,
  CardLabel,
} from './styles.ts';

interface Column {
  header: string;
  accessor: string; // Used to map data fields
}

interface DefaultTableProps {
  columns: Column[];
  data: any[];
  handleRow?: (row: any) => void;
  asCards?: boolean;
}

const DefaultTable: React.FC<DefaultTableProps> = ({ columns, data, handleRow, asCards }) => {
  if (asCards) {
    return (
      <CardContainer>
        {data && data.length > 0 ? (
          data.map((row, rowIndex) => (
            <DataCard key={rowIndex} onClick={() => handleRow && handleRow(row)}>
              {columns.map((col, colIndex) => (
                <CardField key={colIndex}>
                  <CardLabel>{col.header}:</CardLabel>
                  {row[col.accessor]}
                </CardField>
              ))}
            </DataCard>
          ))
        ) : (
          <p>No data available</p>
        )}
      </CardContainer>
    );
  }

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
