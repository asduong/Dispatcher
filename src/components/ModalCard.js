import React from "react";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const ModalCard = ({ isOpen, afterOpenModal, closeModal, subtitle }) => {
  return (
    <div>
      <Modal
        isOpen={isOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2>
        <button onClick={closeModal}>close</button>
        <div>I am a modal</div>
        <form>
          <input />
          <button>tab navigation</button>
          <button>stays</button>
          <button>inside</button>
          <button>the modal</button>
        </form>
      </Modal>
    </div>
  );
};

export default ModalCard;

// const SelectTaskCard = ({ onCreate }) => {
//   return (
//     <div class="dropdown">
//       <button onClick={onCreate} class="dropbtn">
//         Dropdown
//       </button>
//       <div id="myDropdown" class="dropdown-content">
//         <a href="#">A</a>
//         <a href="#">B</a>
//         <a href="#">C</a>
//       </div>
//     </div>
//   );
// };
