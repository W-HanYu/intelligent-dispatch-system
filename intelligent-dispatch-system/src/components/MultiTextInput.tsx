import { Form, Input, FormInstance, message, Button } from "antd";
import { useState, useEffect } from "react";
import { debounce } from "../utils";

// 新增的验证函数
// const isValidFirstNum = (value: string): boolean =>
//   /^\d{5}$/.test(value);

const isValidFirstNum = (str: string): boolean => {
  if (!str || str.length !== 5 || !/^\d+$/.test(str)) {
    return false;
  }
  const num = parseInt(str, 10);
  return num >= 10001 && num % 10 === 1;
};
const isValidOtherNum = (num: string): boolean => /^\d+(?:\.\d+)?$/.test(num);

const validateInput = (value: string): boolean | string => {
  const parts = value.split(" ");
  if (parts.length <= 1) {
    return "每行至少需要一个数字";
  }

  const firstNum = parts.shift()?.toString().trim();
  if (!firstNum || !isValidFirstNum(firstNum)) {
    return "行首必须是5位数字";
  }

  const invalidParts = parts.filter((num) => !isValidOtherNum(num));
  if (invalidParts.length > 0) {
    return `以下数字不合法：${invalidParts.join(", ")}`;
  }

  return true;
};

interface MultiTextInputProps {
  label: string;
  onChange: (values: string[]) => void;
}

const MultiTextInput: React.FC<MultiTextInputProps> = ({ label, onChange }) => {
  const [values, setValues] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValues(e.target.value.split("\n").filter((v) => v.trim()));
    const isValid = values.every((value) => validateInput(value) === true);
    message.open({
      key: "validateInput",
      type: isValid ? "success" : "error",
      content: isValid ? "输入合法" : "输入不合法，请检查输入格式是否正确",
      duration: 2,
      style: {
        marginTop: "5vh",
      },
    });
  };

  return (
    <Form
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Form.Item style={{ width: "400px" }} name="values">
        <Input.TextArea
          rows={6}
          placeholder="数字之间需要一个空格隔开，例如：
10001 30 0.5 0.5 0.5 0.5 5
10002 0.5 0.5"
          onChange={debounce(handleInputChange, 1000)}
        />
      </Form.Item>
      <Button type="primary">确定</Button>
    </Form>
  );
};

export default MultiTextInput;
