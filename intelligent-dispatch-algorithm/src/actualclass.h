/*
  NAPI-Node.JS Addon 示例
  作者：Chris Johnson (chrisjohn404)
  日期：2022年7月
  许可证：GPLv2
*/

#pragma once

#include <string>
#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <unordered_map>
#include <cstdlib>
#include <ctime>
#include <memory>
#include <list>
#include <algorithm>
#include <queue>
#include <cmath>
#include <mach/mach_time.h>

using namespace std;

// 表示问题实例的结构体
struct  Instance {
public:
    vector<vector<unordered_map<int, int>>> message; // 消息
    int work_num; // 工作数量
    int machine_num; // 机器数量
    int avg_ma; // 平均 MA

    vector<int> works; // 工作列表
    vector<double> start_times; // 开始时间列表
    vector<double> finish_times; // 完成时间列表
    vector<int> machines; // 机器列表

    Instance() : work_num(0), machine_num(0), avg_ma(0) {} // 默认构造函数
    Instance(const string& filename); // 从文件初始化实例
    void print_Instance(); // 打印实例信息
};

// 表示调度节点的结构体
struct  Node {
public:
    int work; // 工作
    int job; // 任务
    int machine; // 机器
    double start_time; // 开始时间
    double finish_time; // 完成时间
    weak_ptr<Node> jPre; // 任务的前一个节点
    weak_ptr<Node> mPre; // 机器的前一个节点
    weak_ptr<Node> jNext; // 任务的后一个节点
    weak_ptr<Node> mNext; // 机器的后一个节点

    Node() : work(0), job(0), machine(0), start_time(0), finish_time(0) {} // 默认构造函数
    Node(int work_n, int job_n, int machine_n) : work(work_n), job(job_n), machine(machine_n), start_time(0), finish_time(0) {} // 带参数的构造函数
    Node(int work_n, int job_n, int machine_n, double start, double finish) : work(work_n), job(job_n), machine(machine_n), start_time(start), finish_time(finish) {} // 带参数的构造函数
};

// 表示随机数的结构体
struct  RandomNumber {
public:
    RandomNumber(); // 默认构造函数
    double getRandomD(double a, double b); // 获取指定范围内的双精度随机数
    int getRandomI(int a, int b); // 获取指定范围内的整数随机数
    vector<int> get_n_diff(int a, int b, int n); // 获取 n 个不同的整数随机数
};

// 表示解决方案的类
class  Solution {
public:
    Solution() : makespan(0.0), fitness(0.0) {} // 默认构造函数
    Solution(vector<int>& job_s, vector<vector<int>>& machine_s); // 从任务序列和机器序列初始化解决方案

    void set_makespan(); // 计算最大完工时间
    void set_fitness(); // 计算适应度
    void set_job_gene(vector<int>& job_s); // 设置任务序列
    void set_machine_gene(vector<vector<int>>& machine_s); // 设置机器序列
    void set_instance(Instance i); // 设置问题实例
    void get_gantt(vector<int>& job_s, vector<vector<int>>& machine_s); // 生成甘特图

    void show_gantt(int mode); // 显示甘特图
    void show_job_gene(); // 显示任务序列
    void show_machine_gene(); // 显示机器序列
    void set_arg(vector<int>& job_s, vector<vector<int>>& machine_s); // 设置参数

    void print_gantt(string file_name); // 将甘特图打印到文件
    void print_gene(string file_name); // 将序列打印到文件
    void print_all(string file_name); // 将全部信息打印到文件

    void greed_initialize(int stand_cycle, int job_num, int mac_num); // 贪婪初始化
    vector<Solution> search_neighborhood(int job_num, int mac_num); // 搜索邻域解
    Solution search_job_neigh(int work1, int job1, int work2, int job2); // 搜索任务邻域解
    Solution search_mac_neigh(int work, int job, int machine); // 搜索机器邻域解

    const vector<int>& get_job_gene() const { return job_gene; } // 获取任务序列
    const vector<vector<int>>& get_machine_gene() const { return machine_gene; } // 获取机器序列
    double get_makespan()const { return makespan; } // 获取最大完工时间
    double get_fitness()const { return fitness; } // 获取适应度

    static Instance ins1; // 静态问题实例
    static RandomNumber r; // 静态随机数生成器

    vector<int> jobPos; // 任务位置
    vector<int> machinePos; // 机器位置

private:
    double makespan; // 最大完工时间
    double fitness; // 适应度
    vector<int> job_gene; // 任务序列
    vector<vector<int>> machine_gene; // 机器序列
    vector<list<shared_ptr<Node>>> gantt; // 甘特图
};

// 解决方案的比较运算符重载
inline bool operator<(const Solution& left, const Solution& right) {
    return left.get_makespan() < right.get_makespan();
}
inline bool operator>(const Solution& left, const Solution& right) {
    return left.get_makespan() > right.get_makespan();
}
inline bool operator==(const Solution& left, const Solution& right) {
    return (left.get_job_gene() == right.get_job_gene()) && (left.get_machine_gene() == right.get_machine_gene());
}

// 遗传算法类
class  GA {
public:
    GA() : PS(0), maxCycle(0), PB(0.0), PC(0.0), PM(0.0), PY(0.0), R(0) {} // 默认构造函数
    GA(Instance _Ins, int _MaxCycle, double _PB, double _PC, double _PM, double _PY, int _R) :
        ins(_Ins), PS((_Ins.work_num + _Ins.machine_num) * 10), maxCycle(_MaxCycle), PB(_PB), PC(_PC), PM(_PM), PY(_PY), R(_R) {} // 带参数的构造函数
    GA(Instance _Ins, int _PS, int _MaxCycle, double _PB, double _PC, double _PM, double _PY, int _R) :
        ins(_Ins), PS(_PS), maxCycle(_MaxCycle), PB(_PB), PC(_PC), PM(_PM), PY(_PY), R(_R) {} // 带参数的构造函数
    GA(Instance _Ins, int _MaxCycle); // 带参数的构造函数
    GA(string _Filename, int _MaxCycle); // 带参数的构造函数

    void initialize_mode1(); // 初始化模式1
    void initialize_mode2(); // 初始化模式2
    void initialize_mode2(int _PS); // 初始化模式2（指定种群大小）
    void initialize_mode3(int stand_cycle, int job_num, int mac_num); // 初始化模式3
    void initialize_mode3(int _PS, int stand_cycle, int job_num, int mac_num); // 初始化模式3（指定种群大小）
    void run_mode1(); // 运行模式1
    void run_mode1(int cycle); // 运行模式1（指定周期）
    void run_mode2(double time); // 运行模式2（指定时间）
    double get_makespan() const { return best_Individual.get_makespan(); } // 获取最佳解的最大完工时间
    void show_best(int mode0); // 显示最佳解

    int get_PS() const { return PS; } // 获取种群大小
    int get_maxCycle() const { return maxCycle; } // 获取最大迭代次数
    double get_PB() const { return PB; } // 获取交叉概率
    double get_PC() const { return PC; } // 获取变异概率
    double get_PM() const { return PM; } // 获取随机重组概率
    double get_PY() const { return PY; } // 获取随机移动概率
    int get_R() const { return R; } // 获取 R 值
    const vector<Solution>& get_population() const { return population; } // 获取种群
    const Solution& get_best_Individual() const { return best_Individual; } // 获取最佳解

private:
    void searchBestSource(); // 搜索最优源
    vector<Solution> get_best_n(int n); // 获取最优的 n 个解
    vector<Solution> get_best_n(vector<Solution>& population, int n); // 获取给定种群中最优的 n 个解
    vector<Solution> get_worst_n(int n); // 获取最差的 n 个解
    void select(); // 选择操作
    void cross(Solution& sol1, Solution& sol2); // 交叉操作
    void mutate(Solution& sol); // 变异操作
    void evolve(); // 进化操作
    bool oddCheck(); // 奇数检查

    int PS = 0; // 种群大小
    int maxCycle = 30; // 最大迭代次数
    double PB = 0.05; // 交叉概率
    double PC = 0.75; // 变异概率
    double PM = 0.1; // 随机重组概率
    double PY = 0.02; // 随机移动概率
    int R = 4; // R 值

    Instance ins; // 问题实例
    RandomNumber r; // 随机数生成器

    vector<Solution> population; // 种群
    Solution best_Individual; // 最佳解
};

// 粒子群算法类
class  PSO {
public:
    PSO() {} // 默认构造函数
    PSO(double _PM, int _PN) : PM(_PM), PN(_PN) {} // 带参数的构造函数

    void initialize(Instance _ins); // 初始化
    void initialize(int _PS, Instance _ins); // 初始化（指定种群大小）
    void run_mode1(int cycle); // 运行模式1（指定周期）
    void run_mode1(); // 运行模式1
    void run_mode2(int cycle); // 运行模式2（指定周期）
    void run_mode2(); // 运行模式2
    void run_mode3(double time); // 运行模式3（指定时间）
    void run_mode3(); // 运行模式3
    void show_best(int mode0); // 显示最佳解

    const Solution& get_best() const { return best1; } // 获取最佳解
    int get_ps() const { return PS; } // 获取种群大小
    double get_pm() const { return PM; } // 获取惯性权重
    int get_pn() const { return PN; } // 获取粒子数
    int get_max_cycle() const { return maxCycle; } // 获取最大迭代次数
    int get_max_stand_cycle() const { return maxStandCycle; } // 获取最大稳定迭代次数
    double get_max_run_time() const { return maxRunTime; } // 获取最大运行时间

private:
    void run_step(Solution& sol, int pn); // 运行一步（单粒子）
    void run_step(Solution& sol, Solution& best_one, int pn); // 运行一步（单粒子，传入全局最佳解）
    void search_best(); // 搜索最佳解

    int PS = 50; // 种群大小
    double PM = 0.2; // 惯性权重
    int PN = 2; // 粒子数
    int maxCycle = 100; // 最大迭代次数
    int maxStandCycle = 25; // 最大稳定迭代次数
    double maxRunTime = 20.0; // 最大运行时间
    vector<Solution> population; // 种群
    Solution best1; // 最佳解
    Solution best2; // 次优解
    Solution best3; // 次次优解
    Instance ins; // 问题实例
    RandomNumber r; // 随机数生成器
};

// 模拟退火算法类
class  SAA {
public:
    SAA() { NowT = StartT; } // 默认构造函数
    SAA(double _StartT, double _EndT, double _K, int _L) : StartT(_StartT), EndT(_EndT), K(_K), L(_L) { NowT = StartT; } // 带参数的构造函数

    void initialize(Instance ins); // 初始化
    void initialize(Instance ins, double _K, int _L, double _k); // 初始化（指定参数）
    void run_mode1(); // 运行模式1
    void run_mode2(double time); // 运行模式2（指定时间）
    void show_best(int mode0); // 显示最佳解

    const Solution& getBest() const { return best; } // 获取最佳解
    double get_NowT() const { return NowT; } // 获取当前温度
    double get_StartT() const { return StartT; } // 获取起始温度
    double get_EndT() const { return EndT; } // 获取结束温度
    double get_K() const { return K; } // 获取降温系数
    int get_L() const { return L; } // 获取内循环迭代次数
    double get_k() const { return k; } // 获取步长系数
    int get_MinStep() const { return MinStep; } // 获取最小步长

private:
    int stepLength(); // 计算步长
    void run_step(Solution& sol, int pn); // 运行一步（单解）

    Solution best; // 最佳解
    Solution s; // 当前解
    double NowT; // 当前温度
    double StartT = 10000; // 起始温度
    double EndT = 1; // 结束温度
    double K = 0.95; // 降温系数
    int L = 100; // 内循环迭代次数
    double k = 0.3; // 步长系数
    int MinStep = 1; // 最小步长

    RandomNumber r; // 随机数生成器
    const double e = 2.7183; // 自然对数的底
};

// 禁忌搜索算法类
class  TS {
public:
    TS() : tabuLength(10), job_num(10), mac_num(10) {} // 默认构造函数
    TS(int _tabuLength, int _job_num, int _mac_num) : tabuLength(_tabuLength), job_num(_job_num), mac_num(_mac_num) {} // 带参数的构造函数

    void initialize(Instance ins); // 初始化
    void run_mode1(int maxCycle); // 运行模式1（指定最大迭代次数）
    void run_mode1(); // 运行模式1
    void run_mode2(int maxStandCycle); // 运行模式2（指定最大稳定迭代次数）
    void run_mode2(); // 运行模式2
    void run_mode3(double maxRunTime); // 运行模式3（指定最大运行时间）
    void run_mode3(); // 运行模式3
    void show_best(int mode0); // 显示最佳解

    Solution get_best() const { return best; } // 获取最佳解
    Solution get_current() const { return current; } // 获取当前解
    const vector<Solution>& get_tabuTable() const { return tabuTable; } // 获取禁忌表
    int get_tabuLength() const { return tabuLength; } // 获取禁忌长度
    int get_job_num() const { return job_num; } // 获取任务数量
    int get_mac_num() const { return mac_num; } // 获取机器数量
    int get_max_cycle() const { return max_cycle; } // 获取最大迭代次数
    int get_max_stand_cycle() const { return max_stand_cycle; } // 获取最大稳定迭代次数
    double get_max_run_time() const { return max_run_time; } // 获取最大运行时间

private:
    void show_cycle(int i); // 显示迭代次数
    bool is_in_tabuTable(const Solution& sol); // 判断解是否在禁忌表中

    vector<Solution> tabuTable; // 禁忌表
    Solution best; // 最佳解
    Solution current; // 当前解
    int tabuLength; // 禁忌长度
    int job_num; // 任务数量
    int mac_num; // 机器数量

    int max_cycle = 100; // 最大迭代次数
    int max_stand_cycle = 20; // 最大稳定迭代次数
    double max_run_time = 100.0; // 最大运行时间
    RandomNumber r; // 随机数生成器
};

// 实际类示例
class ActualClass {
public:
    ActualClass(double value); // 构造函数
    double getValue(); // 获取值
    double add(double toAdd); // 增加值

private:
    double value_; // 值
};
