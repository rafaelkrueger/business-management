import styled from "styled-components";

export const SidePanelContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 400px;
  background-color: rgba(255, 255, 255, 0.95); // Semi-transparent white background
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.3); // Subtle shadow for depth
  z-index: 1000;
  transform: ${({ isOpen }) => (isOpen ? "translateX(0)" : "translateX(100%)")};
  transition: transform 0.3s ease-in-out;
  padding: 20px;
  overflow-y: auto;
`;


export const EventContainer = styled.div<{ status: string }>`
  display: flex;
  padding: 10px;
  padding-left: 20px;
  padding-right: 20px;
  margin: 10px 0;
  background-color: ${({ status }) => (status === "canceled" ? "#f8d7da" : "#f1f1f16b")};
  border-left: 5px solid ${({ status }) => (status === "canceled" ? "#e74c3c" : "#5a86b5")};
  border-radius: 4px;
  justify-content: space-between;
  cursor:pointer;
`


export const EventTime = styled.div`
  font-size: 14px;
  margin-right: 10px;
  span {
    display: block;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.5);
  }
`;

export const EventDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

export const EventTitle = styled.h4`
  margin: 0;
  font-size: 16px;
  color: ${({ status }) => (status === "canceled" ? "#e74c3c" : "#007bff")};
`;

export const EventDescription = styled.p`
  margin: 0;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
`;

export const EventUser = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
  margin-top: 5px;
  img {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-right: 5px;
  }
`;

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px; // Space between form elements
  margin-top: 20px; // Space above the form
  padding: 20px; // Padding inside the form
  border-radius: 8px; // Rounded corners
  min-height: 80vh; // Ensure the form takes up at least the full height of the viewport

  // Target the second-to-last child element
  & > :nth-last-child(2) {
    flex-grow: 1; // Pushes the last element to the bottom
  }
`;

export const FormLabel = styled.label`
  font-weight: bold; // Bold text for labels
  margin-bottom: 5px; // Space below the label
`;

export const FormInput = styled.input`
  padding: 10px; // Padding inside inputs
  border-radius: 4px; // Rounded corners
  border: 1px solid #ccc; // Light border
  font-size: 14px; // Font size
  width: 94%; // Full width
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1); // Subtle inset shadow

  &:focus {
    outline: none; // Remove default outline
    border-color: #5a86b5; // Change border color on focus
  }
`;

export const FormButton = styled.button`
  background-color: #4CAF50; // Green background
  color: white; // White text
  border: none; // No border
  padding: 10px; // Padding
  border-radius: 5px; // Rounded corners
  cursor: pointer; // Pointer cursor on hover
  font-size: 16px; // Font size
  transition: background-color 0.3s; // Transition effect
  &:hover {
    background-color: #45a049; // Darker green on hover
  }
`;
