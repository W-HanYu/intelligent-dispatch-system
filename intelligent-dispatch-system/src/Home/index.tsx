import { UserOutlined } from "@ant-design/icons";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./index.scss";
import { Avatar, Dropdown, Menu, Space, Switch, Input } from "antd";
import { useEffect, useRef, useState } from "react";
import imgUrl from "../logo.png";
import lzqPng from "../Assets/lzq.png"
import * as echarts from "echarts";
import UploadFile from "../components/UploadFile";
import SelectAlgorithms from "../components/SelectAlgorithms";
import MultiTextInput from "../components/MultiTextInput";
import { debounce } from "../utils";

const SchedulerSystem = () => {
  const [isManualInput, setIsManualInput] = useState(false);
  const [geneticsData, setGeneticsData] = useState<number>(8200);
  const chart1Ref = useRef(null);
  const chart2Ref = useRef(null);
  const handleInputChange = (values: string[]) => {
    console.log("Manual input values:", values);
    // 处理手动输入的数据
  };

  const handleFileUpload = (file: File) => {
    console.log("Uploaded file:", file);
    // 处理上传的文件
  };

  const handleOnFileTypeCheck = (fileType: File): boolean => {
    console.log("File type:", fileType);
    return true;
    // 处理文件类型的选择
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

  const initEChart1 = () => {
    const myChart = echarts.init(chart1Ref.current);
    myChart.clear();
    let option;
    option = {
      xAxis: {
        data: ["遗传", "禁忌", "粒子群优化", "模拟退火"],
      },
      yAxis: {},
      series: [
        {
          type: "bar",
          data: [
            {
              value: 42,
              // 设置单个柱子的样式
              itemStyle: {
                color: "#132cff",
                shadowColor: "#91cc75",
                borderType: "dashed",
                // opacity: 0.5,
              },
            },
            {
              value: 45,
              // 设置单个柱子的样式
              itemStyle: {
                color: "#ff131f",
                shadowColor: "#91cc75",
                borderType: "dashed",
                // opacity: 0.5,
              },
            },
            {
              value: 51,
              // 设置单个柱子的样式
              itemStyle: {
                color: "#91cc75",
                shadowColor: "#91cc75",
                borderType: "dashed",
                opacity: 0.5,
              },
            },
            {
              value: 48,
              // 设置单个柱子的样式
              itemStyle: {
                color: "#f00726",
                shadowColor: "#91cc75",
                borderType: "dashed",
                opacity: 0.5,
              },
            },
            49,
          ],
          itemStyle: {
            barBorderRadius: 5,
            borderWidth: 1,
            borderType: "solid",
            borderColor: "#73c0de",
            shadowColor: "#5470c6",
            shadowBlur: 3,
          },
        },
      ],
      title: {
        text: "最优解柱状图",
        top: "top",
      },
    };
    option && myChart.setOption(option);
  };
  const initEChart2 = () => {
    const myChart = echarts.init(chart2Ref.current);
    myChart.clear();
    let option;
    option = {
      xAxis: {
        data: ["遗传", "禁忌", "粒子群优化", "模拟退火"],
      },
      yAxis: {},
      series: [
        {
          type: "bar",
          data: [
            {
              value: 6800,
              // 设置单个柱子的样式
              itemStyle: {
                color: "#132cff",
                shadowColor: "#91cc75",
                borderType: "dashed",
                // opacity: 0.5,
              },
            },
            {
              value: 2200,
              // 设置单个柱子的样式
              itemStyle: {
                color: "#ff131f",
                shadowColor: "#91cc75",
                borderType: "dashed",
                // opacity: 0.5,
              },
            },
            {
              value: 2500,
              // 设置单个柱子的样式
              itemStyle: {
                color: "#91cc75",
                shadowColor: "#91cc75",
                borderType: "dashed",
                opacity: 0.5,
              },
            },
            {
              value: 2350,
              // 设置单个柱子的样式
              itemStyle: {
                color: "#f00726",
                shadowColor: "#91cc75",
                borderType: "dashed",
                opacity: 0.5,
              },
            },
            49,
          ],
          itemStyle: {
            barBorderRadius: 5,
            borderWidth: 1,
            borderType: "solid",
            borderColor: "#73c0de",
            shadowColor: "#5470c6",
            shadowBlur: 3,
          },
        },
      ],
      title: {
        text: "算法计算时间 单位/ms",
        top: "top",
      },
    };
    option && myChart.setOption(option);
  };
  useEffect(() => {
    initEChart1();
    initEChart2();
  }, []);
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
              {isManualInput ? (
                <MultiTextInput
                  label="请输入数据（每行一条）"
                  onChange={debounce(handleInputChange, 500)}
                />
              ) : (
                <UploadFile
                  onFileTypeCheck={handleOnFileTypeCheck}
                  onUpdateFileList={(fileList) => {
                    console.log("fileList:", fileList);
                  }}
                />
              )}
            </Space>
          </div>
          <div className="select_algorithm">
            <SelectAlgorithms />
          </div>
        </div>
        <div className="right">
          <h1>算法效果展示与比较</h1>
          <div className="algorithm_compare">
            <div
              id="chart1"
              style={{ width: "50%", height: "100%" }}
              ref={chart1Ref}
            ></div>
            <div
              id="chart2"
              style={{ width: "50%", height: "100%" }}
              ref={chart2Ref}
            ></div>
          </div>
          <div className="gantt_chart">获取甘特图</div>
          <img src={lzqPng} alt="" width={900}/>
        </div>
      </div>
    </div>
  );
};

export default SchedulerSystem;
