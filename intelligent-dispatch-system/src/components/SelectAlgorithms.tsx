import React, { useCallback, useEffect, useState } from "react";
import { Select, Input, Typography, Button, message, Tooltip } from "antd";
import "./index.scss";
import FileUploadModal from "./FileUploadModal";
import { getAllAlgorithms } from "../interface";
import { QuestionCircleOutlined } from "@ant-design/icons";

interface Option {
  value: string;
  label: string;
}

interface AlgorithmParams {
  [key: string]: string | number;
}

// Define a type for predefinedParams with specific keys and their parameter types
type PredefinedAlgorithmParams = {
  yichuan: {
    算例规模工件数量X机器数量: string;
    终止条件: string;
    最优个体赋值比例: string;
    交叉概率: string;
    变异概率: string;
    最好基因保留概率: string;
    交叉对数: string;
  };
  lizi: {
    算例规模工件数量X机器数量: string;
    粒子偏移概率: string;
    每次改变点位数: string;
  };
  tuihuo: {
    算例规模工件数量X机器数量: string;
    本次模拟退火由初始温度: string;
    到终止温度: string;
    温度下降速率: string;
    等温过程迭代次数: string;
  };
  jinji: {
    算例规模工件数量X机器数量: string;
    禁忌长度: string;
    单次生成工序邻域数量: string;
    单次生成机器邻域数量: string;
    最大迭代次数: string;
  };
  [algorithmName: string]: {
    [paramName: string]: any;
  };
};

const SelectAlgorithms: React.FC = (data: any) => {
  const [algorithmParams, setAlgorithmParams] =
    useState<AlgorithmParams | null>(null);
  const [selected, setSelected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [select_algorithm_name, setSelect_algorithm_name] =
    useState<string>("");
  const [customAlgorithmName, setCustomAlgorithmName] = useState<string>("");
  const [al_bref_name, setAl_bref_name] = useState<string>("");
  const [customParameters, setCustomParameters] = useState<
    {
      name: string;
      value: string | number;
    }[]
  >([
    {
      name: "算例规模工件数量X机器数量",
      value: "10*6",
    },
  ]);
  const [options, setOptions] = useState<Option[]>([]);

  const [predefinedParams, setPredefinedParams] =
    useState<PredefinedAlgorithmParams>();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [parametersAdded, setParametersAdded] = useState<boolean>(false);
  const [algorithmFileUploaded, setAlgorithmFileUploaded] =
    useState<boolean>(false);

  const openModal = () => setIsModalVisible(true);

  const handleCloseModal = () => setIsModalVisible(false);

  const handleFileUpload = () => setAlgorithmFileUploaded(true);

  const onChange = (value: string) => {
    setSelected(true);
    setSelect_algorithm_name(value);
    if (value === "custom") {
      setAlgorithmParams(null);
      return;
    } else {
      setAlgorithmParams(
        predefinedParams![value as keyof PredefinedAlgorithmParams]
      );
    }
  };

  const onSearch = async () => {
    setIsLoading(true);
    try {
      const res = await getAllAlgorithms();
      const { data } = res.data;
      const optionsArr = data.reduce((acc: Option[], cur: any) => {
        acc.push({
          value: cur.value,
          label: cur.label,
        });
        return acc;
      }, []);

      const predefinedParams = data.reduce(
        (acc: PredefinedAlgorithmParams, cur: any) => {
          // Initialize an empty object for the current algorithm's parameters
          acc[cur.value] = {};

          // Populate the parameters for the current algorithm
          cur.params.forEach((param: any) => {
            acc[cur.value][param.param_name] = param.param_value;
          });

          return acc;
        },
        {}
      );

      setOptions(optionsArr);
      setPredefinedParams(predefinedParams);
      setAlgorithmParams(predefinedParams);
    } catch (error) {
      console.error("Error fetching algorithms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const handleAddParameter = (): void => {
    setCustomParameters((prevParameters) => [
      ...prevParameters,
      { name: "", value: "" },
    ]);
    setParametersAdded(true);
  };

  const handleCustomParamValueChange = (
    index: number,
    value: string | number | null
  ) => {
    if (value !== null) {
      setCustomParameters((prevParameters) => {
        const updatedParameters = [...prevParameters];
        updatedParameters[index].value = value;
        return updatedParameters;
      });
    }
  };

  const handleAddAlgorithm = (
    value: string,
    label: string,
    params: AlgorithmParams
  ) => {
    const newOption = {
      value: value.toLowerCase().replace(/\s/g, ""),
      label: label,
    };
    const updatedOptions = [newOption, ...options];

    setOptions(updatedOptions);
    setPredefinedParams({
      ...predefinedParams!,
      [value.toLowerCase().replace(/\s/g, "")]: params,
    });
    setCustomAlgorithmName("");
    setAl_bref_name("");
    setCustomParameters([]);
    setSelected(false);
  };

  useEffect(() => {
    onSearch();
  }, []);

  return (
    <div className="algorithm">
      <div className="algorithm_title">请选择调度优化算法</div>
      <Select
        showSearch
        placeholder="点击选择或可自定义算法"
        optionFilterProp="children"
        onChange={onChange}
        filterOption={filterOption}
        // onFocus={onSearch}
        options={options}
        optionRender={(option) => {
          const content = <div>{option.label}</div>;
          if (option.value === "custom") {
            return (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {content}
                <Button type="link" size="small">
                  添加
                </Button>
              </div>
            );
          }
          return content;
        }}
      />
      {selected && (
        <div className="algorithm_params">
          {algorithmParams !== null && (
            <>
              {Object.entries(predefinedParams![select_algorithm_name]).map(
                ([key, value], index) => (
                  <Typography.Paragraph key={index}>
                    <div className="param-row">
                      <span>{key}: </span>
                      <Input type="text" id={key} value={value as string} />
                    </div>
                  </Typography.Paragraph>
                )
              )}
              <div className="btn">
                <Button type="primary" className="upload-data-btn">
                  上传数据
                </Button>
              </div>
            </>
          )}
          {algorithmParams === null && (
            <>
              <div
                className="custom-algorithm-params"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <Input
                  type="text"
                  id="algorithm_name"
                  value={customAlgorithmName}
                  style={{
                    width: "200px",
                    margin: "auto",
                    display: "block",
                    marginBottom: "10px",
                  }}
                  placeholder="请输入自定义算法名称"
                  onChange={(e) => setCustomAlgorithmName(e.target.value)}
                />
                <Input
                  type="text"
                  id="algorithm_name"
                  value={al_bref_name}
                  style={{
                    width: "200px",
                    margin: "auto",
                    marginBottom: "10px",
                  }}
                  placeholder="算法英文简洁名称"
                  onChange={(e) => setAl_bref_name(e.target.value)}
                  suffix={
                    <Tooltip
                      title="设置算法的英文名称简称，为了方便后面的调度显示，例如：
                    遗传算法，可设置为：yiChuan（拼音） 或者 genetics(英文) 都可"
                    >
                      <QuestionCircleOutlined
                        style={{ color: "rgba(0,0,0,.45)" }}
                      />
                    </Tooltip>
                  }
                />

                {customParameters.map((param, index) => (
                  <Typography.Paragraph key={index}>
                    <div className="param-row">
                      <div className="param-name-input">
                        <Input
                          type="text"
                          placeholder="参数名称"
                          value={param.name}
                          onChange={(event) => {
                            const updatedParam = {
                              ...param,
                              name: event.target.value,
                            };
                            setCustomParameters(
                              customParameters.map((p, i) =>
                                i === index ? updatedParam : p
                              )
                            );
                          }}
                        />
                      </div>
                      <div className="param-value-input">
                        <Input
                          type="text"
                          placeholder="参数值"
                          value={param.value.toString()}
                          onChange={(event) =>
                            handleCustomParamValueChange(
                              index,
                              event.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </Typography.Paragraph>
                ))}
              </div>
              <div className="btn">
                <Button type="primary" onClick={handleAddParameter}>
                  添加参数
                </Button>
                <Button type="primary" onClick={openModal}>
                  上传算法文件
                </Button>
                <Button
                  type="primary"
                  className="add-data-btn"
                  onClick={() => {
                    console.log(parametersAdded, algorithmFileUploaded);
                    if (parametersAdded && algorithmFileUploaded) {
                      handleAddAlgorithm(
                        al_bref_name,
                        customAlgorithmName,
                        customParameters.reduce((acc, curr) => {
                          acc[curr.name] = curr.value;
                          return acc;
                        }, {} as AlgorithmParams)
                      );
                    } else {
                      message.warning("请先添加参数并上传算法文件");
                    }
                  }}
                >
                  添加算法
                </Button>
              </div>
            </>
          )}
        </div>
      )}
      <FileUploadModal
        show={isModalVisible}
        handleClose={handleCloseModal}
        handleFileUpload={handleFileUpload}
      />
    </div>
  );
};

export default SelectAlgorithms;
