import styled from "styled-components";

export const CalendarContainer = styled.div`
  width: 1100px;
  height: 550px;
  margin: auto;
  background-color: #f4f4f9;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: 90%;
    height: auto;
    padding: 10px;
    border-radius: 0;
    box-shadow: none;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    font-size: 1.5em;
    font-weight: bold;
    color: #333;
  }

  button {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #45a049;
    }
  }

  @media (max-width: 768px) {
    h2 {
      font-size: 1.2em;
    }

    button {
      padding: 8px 16px;
      font-size: 0.9em;
    }
  }
`;

export const DaysContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;

  @media (max-width: 768px) {
    height: 300px;
    gap: 5px;
  }
`;

export const DayHeader = styled.div`
  font-weight: bold;
  text-align: center;
  padding: 10px;
  background-color: #dddddd6e;
  border-radius: 5px;

  @media (max-width: 768px) {
    padding: 5px;
    font-size: 0.9em;
  }
`;

export const Day = styled.div<{ selected: boolean; isToday: boolean }>`
  padding: 10px;
  margin: 5px;
  border-radius: 8%;
  text-align: center;
  cursor: pointer;
  background-color: ${({ selected, isToday }) =>
    selected ? "#d9d9d95c" :
    isToday ? "#d9d9d95c" : "white"};
  color: ${({ selected, isToday }) =>
    selected || isToday ? "black" : "inherit"};

  &:hover {
    background-color: #f0f0f0;
  }

  @media (max-width: 768px) {
    padding: 5px;
    margin: 2px;
    font-size: 0.9em;
  }
`;

export const ViewSwitcher = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

  button {
    background-color: #2196f3;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 10px;

    &:hover {
      background-color: #1976d2;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;

    button {
      width: 100%;
      margin-right: 0;
    }
  }
`;

export const Event = styled.div`
  background-color: #5a86b5;
  padding: 2px 5px;
  margin-top: 5px;
  border-radius: 3px;
  font-size: 0.75em;
  color: white;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 0.65em;
    padding: 1px 3px;
  }
`;