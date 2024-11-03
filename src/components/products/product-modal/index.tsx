import React, { useState } from 'react';

const ProductModal: React.FC = ({ isOpen, onClose, product }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    // Implement your logic to save the edited product data
    setIsEditing(false);
  };

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Product Details</h2>
          <button className="close-button" onClick={onClose}>
            X
          </button>
        </div>
        <div className="modal-body">
          {isEditing ? (
            <form>
              {/* Input fields for editing product data */}
              <input type="text" name="name" />
              <input type="text" name="description" />
              <button type="button" onClick={handleSaveClick}>
                Save
              </button>
            </form>
          ) : (
            <div>
              <p><strong>Name:</strong></p>
              <p><strong>Description:</strong></p>
              <button type="button" onClick={handleEditClick}>
                Edit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;