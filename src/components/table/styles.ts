import styled from "styled-components";

export const TableCustomer = styled.table`
  width: 100%;
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

export const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 16px 0;
`;

export const DataCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  min-width: 260px;
  cursor: pointer;
  flex: 1;
`;

export const CardField = styled.div`
  margin-bottom: 8px;
  word-wrap: break-word;
`;

export const CardLabel = styled.span`
  font-weight: 600;
  margin-right: 6px;
`;