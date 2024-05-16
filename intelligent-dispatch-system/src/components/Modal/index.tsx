import React, { useState } from "react";
import "./index.scss";

type Props = {
  show: boolean;
  handleClose: () => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const Modal = ({ show, handleClose, handleFileUpload }: Props) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <h2>Upload your C++ Code</h2>
        <input
          id="cpp-file-input"
          type="file"
          accept=".cpp"
          onChange={handleFileUpload}
        />
        <button onClick={handleClose}>Close</button>
      </section>
    </div>
  );
};

export default Modal;
