import styled from "styled-components";

export const TableCustomer = styled.table`
  width: 1120px;
  border-collapse: collapse;
  margin-left: 3%;
  font-size: 18px;
  text-align: left;
  background-color: #fff;
`;

export const ThCustomer = styled.th`
  background-color: #6c7ae0;
  color: #ffffff;
  padding: 12px 15px;
`;

export const TdCustomer = styled.td`
  padding: 12px 15px;
  color: #333;
  border-bottom: 1px solid #ddd;
  max-width: 300px;
  cursor: pointer;
`;

export const TrCustomer = styled.tr`
  &:nth-of-type(even) {
    background-color: #f9f9f9;
  }
  &:hover {
    background-color: #f1f1f1;
  }
`;

export const TableWrapperCustomer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  margin-top: 2%;
`;