import { UserOutlined } from "@ant-design/icons";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./index.scss";
import { Avatar, Dropdown, Menu, Space, Switch, message, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import UploadFile from "../components/UploadFile";
import SelectAlgorithms from "../components/SelectAlgorithms";
import MultiTextInput from "../components/MultiTextInput";
import { debounce } from "../utils";
import { getAllAlgorithms } from "../interface";

interface AlgorithmData {
  name: string;
  optimalSolutionValue: number;
  calculatedTimeValue: number;
  color: string; // 或者使用更具体的类型，比如 `#rrggbb` 的正则表达式校验，但为了简单起见这里使用string
}

const getItemStyle = (opacity = 1) => ({
  barBorderRadius: 5,
  borderWidth: 1,
  borderType: "solid",
  borderColor: "#73c0de",
  shadowColor: "#5470c6",
  shadowBlur: 3,
  opacity,
});

const generateChartOption = (
  chartTitle: string,
  xAxisData: string[],
  data: any
) => ({
  title: { text: chartTitle, top: "top" },
  xAxis: { data: xAxisData },
  yAxis: {},
  series: [
    {
      type: "bar",
      data: data,
      itemStyle: getItemStyle(),
    },
  ],
});

const SchedulerSystem = () => {
  const [isManualInput, setIsManualInput] = useState(true);
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const chart1Ref = useRef(null);
  const chart2Ref = useRef(null);
  const handleInputChange = (values: string[]) => {
    console.log("Manual input values:", values);
    // 处理手动输入的数据
  };
  const [data, setData] = useState<AlgorithmData[]>([]);

  const fetchData = async () => {
    try {
      const res = await getAllAlgorithms();
      const { data } = res.data;
      const alDataArr = data.reduce((acc: any[], item: any) => {
        if (item.value !== "custom") {
          acc.push({
            name: item.label.slice(0, -2),
            optimalSolutionValue: item.optimalSolutionValue,
            calculatedTimeValue: item.calculatedTimeValue,
            color: item.color,
          });
        }
        return acc;
      }, []);
      setData(alDataArr);
    } catch (err) {
      //
    } finally {
      setIsFetched(true);
    }
  };

  const xAxisData = data.map((item) => {
    return item.name;
  });

  const handleFileUpload = (file: File) => {
    console.log("Uploaded file:", file);
    const isTxt = handleOnFileTypeCheck(file);
    if (!isTxt) {
      message.error("文件类型错误,仅支持txt文件");
    } else {
      message.success("文件上传成功");
    }
    // 处理上传的文件
  };

  const handleOnFileTypeCheck = (fileType: File): boolean => {
    console.log("File type:", fileType);
    if (fileType.type === "text/plain") {
      return true;
    } else {
      message.error("文件类型错误,仅支持txt文件");
      return false;
    }
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
            sessionStorage.removeItem("access_token");
          }}
        >
          退出登录
        </Link>
      </Menu.Item>
    </Menu>
  );

  // 初始化图表的函数
  const initChart = (ref: any, option: any) => {
    const myChart = echarts.init(ref.current);
    myChart.clear();
    myChart.setOption(option);
    // 组件卸载时释放资源
    return () => myChart.dispose();
  };

  // 生成两个图表的配置
  const chartOption1 = generateChartOption(
    "最优解柱状图",
    xAxisData,
    data.map((item, index) => {
      return {
        value: item.optimalSolutionValue,
        itemStyle: {
          color: item.color,
          shadowColor: "#91cc75",
          borderType: "dashed",
          opacity: index >= 2 ? 0.5 : 1,
        },
      };
    })
  );
  const chartOption2 = generateChartOption(
    "算法计算时间 单位/ms",
    xAxisData,
    data.map((item, index) => {
      return {
        value: item.calculatedTimeValue,
        itemStyle: {
          color: item.color,
          shadowColor: "#91cc75",
          borderType: "dashed",
          opacity: index >= 2 ? 0.5 : 1,
        },
      };
    })
  );

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    Promise.all([
      initChart(chart1Ref, chartOption1),
      initChart(chart2Ref, chartOption2),
    ]);
  }, [isFetched]);
  return (
    <div id="index-container">
      <div className="header">
        <div className="left">
          <img src={require("../logo.png")} className="logo" />
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
                checkedChildren="切换到文件拖拽上传"
                unCheckedChildren="切换到多文本输入"
              />
              <Tooltip
                title={`参数输入规范：
                1. 每一行代表一种算法和算法参数
                2. 第一个参数为算法名称（必须是10001、10002、10003...这种格式
                3.后续参数为算法参数，参数之间用空格分隔(仅限一个空格)
                4. 多文本输入和txt文件拖拽上传一致`}
                placement="right"
              >
                点击
                <QuestionCircleOutlined />
                查看参数输入规范
              </Tooltip>
              {isManualInput ? (
                <MultiTextInput
                  label="多文本参数输入"
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
          <img src={require("../Assets/lzq.png")} alt="" width={900} />
        </div>
      </div>
    </div>
  );
};

export default SchedulerSystem;
