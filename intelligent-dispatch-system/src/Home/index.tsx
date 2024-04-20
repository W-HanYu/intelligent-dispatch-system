import { UserOutlined } from "@ant-design/icons";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./index.scss";
import { Avatar, Dropdown, Menu, Space, Switch, Input } from "antd";
import { useState } from "react";
import imgUrl from "../logo.png";
import UploadFile from "../components/UploadFile";
import SelectAlgorithms from "../components/SelectAlgorithms";
import MultiTextInput from "../components/MultiTextInput";

const SchedulerSystem = () => {
  const [isManualInput, setIsManualInput] = useState(false);

  const handleInputChange = (values: string[]) => {
    console.log("Manual input values:", values);
    // 处理手动输入的数据
  };

  const handleFileUpload = (file: File) => {
    console.log("Uploaded file:", file);
    // 处理上传的文件
  };
  const [headPicSrc, setHeadPicSrc] = useState(
    "https://mxm1923893223-ulteh-1302287111.tcloudbaseapp.com/profile/avatar.png"
  );
  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/update_info">修改用户信息</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link
          to="/login"
          onClick={() => {
            localStorage.removeItem("access_token");
          }}
        >
          退出登录
        </Link>
      </Menu.Item>
    </Menu>
  );
  return (
    <div id="index-container">
      <div className="header">
        <div className="left">
          <img src={imgUrl} className="logo" />
          <span className="title_name">智能调度系统</span>
        </div>

        <Space className="right">
          <Dropdown overlay={menu} placement="bottomRight">
            <Avatar
              size={48}
              // src={"http://localhost:3005/" + headPicSrc}
              src={headPicSrc}
              alt="Avatar"
            />
          </Dropdown>
        </Space>
      </div>
      <div className="body">
        <div className="left">
          <div className="upload_file">
            <div className="data_type">请选择数据输入形式</div>
            <Space direction="vertical">
              <Switch
                checked={isManualInput}
                onChange={(checked) => setIsManualInput(checked)}
                checkedChildren="上传文件"
                unCheckedChildren="手动输入"
              />
              {/* 根据用户选择显示相应的输入组件 */}
              {isManualInput ? (
                <MultiTextInput
                  label="请输入数据（每行一条）"
                  onChange={handleInputChange}
                />
              ) : (
                <UploadFile />
              )}
            </Space>
          </div>
          <div className="select_algorithm">
            <SelectAlgorithms />
          </div>
        </div>
        <div className="right">
          <h1>算法效果展示与比较</h1>
        </div>
      </div>
    </div>
  );
};

export default SchedulerSystem;
