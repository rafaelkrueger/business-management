// StyledComponents.ts
import styled from 'styled-components';
import ReactModal from 'react-modal';


export const Header = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    background-color: #e5e5e5dd;
`;

export const Title = styled.h2`
    text-align: left;
    margin-bottom: 10px;
    color: #252525;
    margin-left: 6%;
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
`;

export const FormGroup = styled.div`
    margin-bottom: 15px;
`;

export const Label = styled.label`
    margin-bottom: 5px;
    font-weight: bold;
`;

export const Input = styled.input`
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
    font-size: 16px;
    width: 88%;
    &:focus {
        border-color: #007bff;
        outline: none;
    }
`;

export const TextArea = styled.textarea`
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
    font-size: 16px;
    resize: none;
    &:focus {
        border-color: #007bff;
        outline: none;
    }
`;

export const Select = styled.select`
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
    font-size: 16px;
    &:focus {
        border-color: #007bff;
        outline: none;
    }
`;

export const Button = styled.button`
    padding: 10px;
    border-radius: 5px;
    border: none;
    background-color: #007bff;
    color: white;
    font-size: 16px;
    cursor: pointer;
    margin-top: 10px;
    transition: background-color 0.3s;

    &:hover {
        background-color: #0056b3;
    }
`;

export const CancelButton = styled(Button)`
    background-color: #dc3545;
    &:hover {
        background-color: #c82333;
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
  width: 92%;
  margin-top:30px;
  margin-bottom:30px;
  &:hover {
    background-color: #45a049; // Darker green on hover
  }
`;

export const ImagePreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
`;
export const ImageContainer = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
`;

export const Image = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid #ddd;
`;

export const RemoveButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const UploadButton = styled.label`
  display: inline-block;
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const TrainContainer = styled.div`
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;

    @media (max-width: 768px) {
        padding: 10px;
    }
`;

export const TrainContainerHeader = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 20px;

    .cards-container {
        display: flex;
        gap: 20px;
        flex: 1;

        @media (max-width: 768px) {
            flex-direction: column;
            width: 100%;
        }
    }

    .charts-container {
        display: flex;
        gap: 20px;
        flex: 2;

        @media (max-width: 768px) {
            flex-direction: column;
            width: 100%;
        }
    }
`;

export const TrainContainerRecommendTrainerWideCard = styled.div`
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    text-align: center;
    flex: 1;

    h4 {
        margin: 0;
    }

    @media (max-width: 768px) {
        width: 100%;
    }
`;

export const StreakContainer = styled.div`
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.1);
    flex: 1;

    @media (max-width: 768px) {
        width: 100%;
    }
`;

export const EmptyStateContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 40px;
    background-color: #f9f9f9;
    border-radius: 8px;
    margin: 20px 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    overflow-y: hidden;

    @media (max-width: 768px) {
        padding: 20px;
        width: 260px;
    }
`;

export const EmptyStateTitle = styled.h2`
    font-size: 24px;
    color: #333;
    margin-bottom: 10px;

    @media (max-width: 768px) {
        font-size: 20px;
    }
`;

export const EmptyStateDescription = styled.p`
    font-size: 16px;
    color: #666;
    margin-bottom: 20px;

    @media (max-width: 768px) {
        font-size: 14px;
    }
`;

export const EmptyStateButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
    margin: 10px 0;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #0056b3;
    }

    @media (max-width: 768px) {
        width: 100%;
    }
`;