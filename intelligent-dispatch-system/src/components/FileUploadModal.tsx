// src/FileUpload.tsx
import React, { useState } from "react";
import { Modal, Input, Button, Space, message, Tooltip } from "antd";
import { uploadCustomAlgorithm } from "../interface";
import { QuestionCircleOutlined } from "@ant-design/icons";

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
        title={
          <>
            上传用户自定义算法文件
            <Tooltip
              title="算法文件要求：
              1. 目前仅支持c++(.cc)文件代码，如gwo.cc; 其他语言的上传无法识别；
              2. 代码主函数命名必须是main(),因为后续调度会从这个入口开始；
              3. 代码运行输出为output.txt文件，输出格式如下：
              /1111145066001220777002005555599300AAA030006666/333333222222444444555555888888555555666666/AAAA6666111121000047777444447009999/0000000000000002222229991110AAAAAA888888999999/555001119999900AAA000007/988888888AAAAAA788888666666A3344333333555555/*46*328#30#20#20#50*
              解释：1.两个//之间代表是某个机器上加工过的工件以及时间，总共用//隔开了6段数据，代表机器1-6；2.最后面的**之间代表的是最优解、计算时间以及后面#隔开的是输入参数，这里46是最优解、328是计算时间、#30#20#20#50输入参数；
              "
            >
              <QuestionCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
            </Tooltip>
          </>
        }
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
