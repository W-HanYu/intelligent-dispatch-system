import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";
import React from "react";

// 假设从环境变量或配置文件中获取上传URL
const uploadURL =
  process.env.UPLOAD_API_URL ||
  "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload";

// 自定义文件上传的props类型，增加文件类型校验函数和文件列表更新函数
interface CustomUploadProps<T = any> extends UploadProps<T> {
  onFileTypeCheck: (file: File) => boolean;
  onUpdateFileList: (fileList: FileList) => void;
}

const { Dragger } = Upload;

const props: CustomUploadProps = {
  name: "file",
  multiple: true,
  action: uploadURL,
  maxCount: 1,
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
    // 假设的文件列表更新函数调用
    props.onUpdateFileList(e.dataTransfer.files);
  },
  // 假设的文件类型检查函数调用
  beforeUpload(file) {
    if (!props.onFileTypeCheck(file)) {
      message.error("Unsupported file type. Only txt files are allowed.");
      return false;
    }
    return true;
  },
  onFileTypeCheck(file) {
    const fileType = file.type;
    return fileType === "text/plain";
  },
  onUpdateFileList(fileList) {
    console.log("File list updated:", fileList);
  },
};

// 自定义文件上传组件
const UploadFile: React.FC<CustomUploadProps> = () => (
  <Dragger {...props}>
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p className="ant-upload-text">请上传数据文件</p>
    <p className="ant-upload-hint">
      仅支持txt文件，并且数据之间需要空格隔开！其他情况会报错哦
    </p>
  </Dragger>
);

export default UploadFile;
