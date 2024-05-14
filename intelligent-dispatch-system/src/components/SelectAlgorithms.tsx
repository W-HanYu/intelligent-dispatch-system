import React, { useState } from "react";
import { Select, Input, Typography, Button, Form, InputNumber } from "antd";
import "./index.scss";

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
};

const SelectAlgorithms: React.FC = () => {
  const [algorithmParams, setAlgorithmParams] =
    useState<AlgorithmParams | null>(null);
  const [selected, setSelected] = useState<boolean>(false);
  const [customAlgorithmName, setCustomAlgorithmName] = useState<string>("");
  const [customParameters, setCustomParameters] = useState<
    {
      name: string;
      value: string | number;
    }[]
  >([{ name: "", value: "" }]);
  const [options, setOptions] = useState<Option[]>([
    {
      value: "yichuan",
      label: "遗传算法",
    },
    {
      value: "jinji",
      label: "禁忌算法",
    },
    {
      value: "lizi",
      label: "粒子群优化算法",
    },
    {
      value: "tuihuo",
      label: "模拟退火算法",
    },
    {
      value: "custom",
      label: "自定义算法",
    },
  ]);

  const [predefinedParams, setPredefinedParams] =
    useState<PredefinedAlgorithmParams>({
      yichuan: {
        算例规模工件数量X机器数量: "10*6",
        终止条件: "30",
        最优个体赋值比例: "0.3",
        交叉概率: "0.6",
        变异概率: "0.1",
        最好基因保留概率: "0.02",
        交叉对数: "4",
      },
      lizi: {
        算例规模工件数量X机器数量: "10*6",
        粒子偏移概率: "0.3",
        每次改变点位数: "1",
      },
      tuihuo: {
        算例规模工件数量X机器数量: "10*6",
        本次模拟退火由初始温度: "1000",
        到终止温度: "10",
        温度下降速率: "0.95",
        等温过程迭代次数: "20",
      },
      jinji: {
        算例规模工件数量X机器数量: "10*6",
        禁忌长度: "30",
        单次生成工序邻域数量: "20",
        单次生成机器邻域数量: "20",
        最大迭代次数: "50",
      },
    });

  const onChange = (value: string) => {
    setSelected(true);

    if (value === "custom") {
      setAlgorithmParams(null);
      return;
    } else {
      setAlgorithmParams(
        predefinedParams[value as keyof PredefinedAlgorithmParams]
      );
      setPredefinedParams(predefinedParams);
    }
  };

  const onSearch = (value: string) => {
    console.log("search:", value);
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const handleCustomAlgorithmNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomAlgorithmName(event.target.value);
  };

  const handleAddParameter = (): void => {
    setCustomParameters((prevParameters) => [
      ...prevParameters,
      // { name: `参数 ${prevParameters.length + 1}`, value: "" },
      { name: "", value: "" },
    ]);
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

  const handleAddAlgorithm = (name: string, params: AlgorithmParams) => {
    setOptions([
      ...options,
      { value: name.toLowerCase().replace(/\s/g, ""), label: name },
    ]);
    setPredefinedParams({
      ...predefinedParams,

      [name.toLowerCase().replace(/\s/g, "")]: params,
    });
    setSelected(false);
  };

  return (
    <div className="algorithm">
      <div className="algorithm_title">请选择调度优化算法</div>
      <Select
        showSearch
        placeholder="请选择算法或者可自定义算法"
        optionFilterProp="children"
        onChange={onChange}
        onSearch={onSearch}
        filterOption={filterOption}
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
              {Object.entries(algorithmParams).map(([key, value], index) => (
                <Typography.Paragraph key={index}>
                  <div className="param-row">
                    <span>{key}: </span>
                    <Input type="text" id={key} value={value as string} />
                  </div>
                </Typography.Paragraph>
              ))}
              <div className="btn">
                <Button type="primary" className="upload-data-btn">
                  上传数据
                </Button>
              </div>
            </>
          )}
          {algorithmParams === null && (
            <>
              <div className="custom-algorithm-params">
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
                <Button
                  type="primary"
                  className="add-data-btn"
                  onClick={() =>
                    handleAddAlgorithm(
                      customAlgorithmName,
                      customParameters.reduce((acc, curr) => {
                        acc[curr.name] = curr.value;
                        return acc;
                      }, {} as AlgorithmParams)
                    )
                  }
                >
                  添加自定义算法
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectAlgorithms;
