// src/FileUpload.tsx
import React, { useState } from "react";
import { Modal, Input, Button, Space, message } from "antd";
import { uploadCustomAlgorithm } from "../interface";

interface UploadResponseData {
  messageData: string;
}
type Props = {
  show: boolean;
  handleClose: () => void;
  handleFileUpload: () => void;
};

const FileUploadModal = ({ show, handleClose, handleFileUpload }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [algorithmName, setAlgorithmName] = useState<string>("");

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAlgorithmName(event.target.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files ? e.target.files[0] : null);
  };

  const onFileUpload = async () => {
    if (!algorithmName) {
      message.error("请提供算法名称");
      return;
    } else if (!file) {
      message.error("请提供算法文件");
      return;
    } else {
      try {
        console.log(file, algorithmName);
        const response: { data: UploadResponseData } =
          await uploadCustomAlgorithm(file!, algorithmName!);
        handleFileUpload();
        handleClose(); // 隐藏Modal after successful upload
      } catch (error) {
        message.error("算法文件上传失败");
      }
    }
  };

  const modalFooter = (
    <Space>
      <Button onClick={onFileUpload}>确定</Button>
      <Button onClick={handleClose}>取消</Button>
    </Space>
  );

  return (
    <>
      <Modal
        title="上传用户自定义算法文件"
        open={show}
        onOk={onFileUpload}
        onCancel={handleClose}
        footer={modalFooter}
      >
        <div>
          <label>算法名称（必须和主函数一致）:</label>
          <Input
            type="text"
            value={algorithmName}
            onChange={handleNameChange}
            required
          />
        </div>
        <Input type="file" onChange={onFileChange} />
      </Modal>
    </>
  );
};

export default FileUploadModal;
