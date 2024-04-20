// MultiTextInput.tsx

import { Input, Space } from "antd";
import React, { ChangeEvent, useState } from "react";

interface MultiTextInputProps {
  label: string;
  onChange: (values: string[]) => void;
}

const MultiTextInput: React.FC<MultiTextInputProps> = ({ label, onChange }) => {
  const [values, setValues] = useState<string[]>([]);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newValues = event.target.value
      .split("\n")
      .filter((value) => value.trim() !== "");
    setValues(newValues);
    onChange(newValues);
  };

  return (
    <>
      <label htmlFor="multi-text-input">{label}</label>
      <Input.TextArea
        id="multi-text-input"
        rows={4}
        onChange={handleInputChange}
        placeholder="数字之间需要一个空格隔开，例如：
10001 30 0.5 0.5 0.5 0.5 5
10002 0.5 0.5"
      />
    </>
  );
};

export default MultiTextInput;
