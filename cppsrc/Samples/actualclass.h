/*
NAPI-Node.JS Addon Example
Author: Chris Johnson (chrisjohn404)
July 2022
License: GPLv2
*/

#pragma once

#include<string>
#include<iostream>
#include<fstream>
#include<sstream>
#include<vector>
#include<utility>
#include<vector>
#include<unordered_map>
#include<stdlib.h>
#include<time.h>
#include<memory>
#include<new>
#include<list>
#include<algorithm>
#include<queue>
#include <math.h>
// #include<Windows.h>
using namespace std;




struct __declspec(dllexport) Instance {
public:
	vector<vector<unordered_map<int, int>>> message;
	int work_num;
	int machine_num;
	int avg_ma;


	vector<int> works;
	vector<double> start_times;
	vector<double> finish_times;
	vector<int> machines;

	Instance() :work_num(0), machine_num(0), avg_ma(0) {};
	Instance(const string& filename);
	void print_Instance();
};

struct __declspec(dllexport) Node
{
public:
	int work;
	int job;
	int machine;
	double start_time;
	double finish_time;
	std::weak_ptr<Node> jPre;
	std::weak_ptr<Node> mPre;
	std::weak_ptr<Node> jNext;
	std::weak_ptr<Node> mNext;

	Node() : work(0), job(0), machine(0), start_time(0), finish_time(0) {}
	Node(int work_n, int job_n, int machine_n) :
		work(work_n), job(job_n), machine(machine_n), start_time(0), finish_time(0) {}
	Node(int work_n, int job_n, int machine_n, double start, double finish) :
		work(work_n), job(job_n), machine(machine_n), start_time(start), finish_time(finish) {}
};

struct __declspec(dllexport) RandomNumber
{
public:
	RandomNumber();
	double getRandomD(double a, double b);
	int getRandomI(int a, int b);
	vector<int> get_n_diff(int a, int b, int n);
};


class __declspec(dllexport) Solution
{
public:
	Solution() :makespan(0.0), fitness(0.0) {}
	Solution(vector<int>& job_s, vector<vector<int>>& machine_s);

	void set_makespan();
	void set_fitness();
	void set_job_gene(vector<int>& job_s) { job_gene = job_s; }
	void set_machine_gene(vector<vector<int>>& machine_s) { machine_gene = machine_s; }
	void set_instance(Instance i) { ins1 = i; }
	void get_gantt(vector<int>& job_s, vector<vector<int>>& machine_s);

	void show_gantt(int mode);
	void show_job_gene();
	void show_machine_gene();
	void set_arg(vector<int>& job_s, vector<vector<int>>& machine_s);

	void print_gantt(string file_name);
	void print_gene(string file_name);
	void print_all(string file_name);

	void greed_initialize(int stand_cycle, int job_num, int mac_num);
	vector<Solution> search_neighborhood(int job_num, int mac_num);
	Solution search_job_neigh(int work1, int job1, int work2, int job2);
	Solution search_mac_neigh(int work, int job, int machine);

	const vector<int>& get_job_gene() const { return job_gene; }
	const vector<vector<int>>& get_machine_gene() const { return machine_gene; }
	double get_makespan()const { return makespan; }
	double get_fitness()const { return fitness; }


    static Instance ins1 ;
	static RandomNumber r ;
	//static Instance ins;
	//static RandomNumber r;
	//static
	vector<int> jobPos;
	vector<int> machinePos;
private:
	double makespan;
	double fitness;
	vector<int> job_gene;
	vector<vector<int>> machine_gene;
	vector<list<shared_ptr<Node>>> gantt;
};




inline bool operator<(const Solution& left, const Solution& right)
{
	return left.get_makespan() < right.get_makespan();
}
inline bool operator>(const Solution& left, const Solution& right)
{
	return left.get_makespan() > right.get_makespan();
}
inline bool operator==(const Solution& left, const Solution& right)
{
	return (left.get_job_gene() == right.get_job_gene()) && (left.get_machine_gene() == right.get_machine_gene());
}


class __declspec(dllexport) GA
{
public:

	GA() :PS(0), maxCycle(0), PB(0.0), PC(0.0), PM(0.0), PY(0.0), R(0) {}
	GA(Instance _Ins, int _MaxCycle, double _PB, double _PC, double _PM, double _PY, int _R) :
		ins(_Ins), PS((_Ins.work_num + _Ins.machine_num) * 10), maxCycle(_MaxCycle), PB(_PB), PC(_PC), PM(_PM), PY(_PY), R(_R) {}
	GA(Instance _Ins, int _PS, int _MaxCycle, double _PB, double _PC, double _PM, double _PY, int _R) :
		ins(_Ins), PS(_PS), maxCycle(_MaxCycle), PB(_PB), PC(_PC), PM(_PM), PY(_PY), R(_R) {}
	GA(Instance _Ins, int _MaxCycle);
	GA(string _Filename, int _MaxCycle);

	void initialize_mode1();
	void initialize_mode2();
	void initialize_mode2(int _PS);
	void initialize_mode3(int stand_cycle, int job_num, int mac_num);
	void initialize_mode3(int _PS, int stand_cycle, int job_num, int mac_num);
	void run_mode1();
	void run_mode1(int cycle);
	void run_mode2(double time);
	double get_makespan() const { return best_Individual.get_makespan(); }
	void show_best(int mode0);


	int get_PS() const { return PS; }
	int get_maxCycle() const { return maxCycle; }
	double get_PB() const { return PB; }
	double get_PC() const { return PC; }
	double get_PM() const { return PM; }
	double get_PY()const { return PY; }
	int get_R() const { return R; }
	const vector<Solution>& get_population() const { return population; }
	const Solution& get_best_Individual() const { return best_Individual; }

private:

	void searchBestSource();
	vector<Solution> get_best_n(int n);
	vector<Solution> get_best_n(vector<Solution>& population, int n);
	vector<Solution> get_worst_n(int n);
	void select();
	void cross(Solution& sol1, Solution& sol2);
	void mutate(Solution& sol);
	void evolve();
	bool oddCheck();


	int PS = 0;
	int maxCycle = 30;
	double PB = 0.05;
	double PC = 0.75;
	double PM = 0.1;
	double PY = 0.02;
	int R = 4;

	Instance ins;
	RandomNumber r;

	vector<Solution> population;
	Solution best_Individual;
};


class __declspec(dllexport) PSO
{
public:

	PSO() {}
	PSO(double _PM, int _PN) :PM(_PM), PN(_PN) {}

	void initialize(Instance _ins);
	void initialize(int _PS, Instance _ins);
	void run_mode1(int cycle);
	void run_mode1();
	void run_mode2(int cycle);
	void run_mode2();
	void run_mode3(double time);
	void run_mode3();
	void show_best(int mode0);


	const Solution& get_best()const { return best1; }
	int get_ps()const { return PS; }
	double get_pm()const { return PM; }
	int get_pn()const { return PN; }
	int get_max_cycle()const { return maxCycle; }
	int get_max_stand_cycle()const { return maxStandCycle; }
	double get_max_run_time()const { return maxRunTime; }

private:

	void run_step(Solution& sol, int pn);
	void run_step(Solution& sol, Solution& best_one, int pn);
	void search_best();


	int PS = 50;
	double PM = 0.2;
	int PN = 2;
	int maxCycle = 100;
	int maxStandCycle = 25;
	double maxRunTime = 20.0;
	vector<Solution> population;
	Solution best1;
	Solution best2;
	Solution best3;
	Instance ins;
	RandomNumber r;
};


class __declspec(dllexport) SAA
{
public:

	SAA() { NowT = StartT; }
	SAA(double _StartT, double _EndT, double _K, int _L) :StartT(_StartT), EndT(_EndT), K(_K), L(_L) { NowT = StartT; }

	void initialize(Instance ins);
	void initialize(Instance ins, double _K, int _L, double _k);
	void run_mode1();
	void run_mode2(double time);
	void show_best(int mode0);


	const Solution& getBest()const { return best; }
	double get_NowT()const { return NowT; }
	double get_StartT()const { return StartT; }
	double get_EndT()const { return EndT; }
	double get_K()const { return K; }
	int get_L()const { return L; }
	double get_k()const { return k; }
	int get_MinStep()const { return MinStep; }

private:

	int stepLength();
	void run_step(Solution& sol, int pn);


	Solution best;
	Solution s;
	double NowT;
	double StartT = 10000;
	double EndT = 1;
	double K = 0.95;
	int L = 100;
	double k = 0.3;
	int MinStep = 1;

	RandomNumber r;
	const double e = 2.7183;
};


class __declspec(dllexport) TS
{
public:

	TS() :tabuLength(10), job_num(10), mac_num(10) {}
	TS(int _tabuLength, int _job_num, int _mac_num) :
		tabuLength(_tabuLength), job_num(_job_num), mac_num(_mac_num) {}

	void initialize(Instance ins);
	void run_mode1(int maxCycle);
	void run_mode1();
	void run_mode2(int maxStandCycle);
	void run_mode2();
	void run_mode3(double maxRunTime);
	void run_mode3();
	void show_best(int mode0);


	Solution get_best()const { return best; }
	Solution get_current()const { return current; }
	const vector<Solution>& get_tabuTable()const { return tabuTable; }
	int get_tabuLength()const { return tabuLength; }
	int get_job_num()const { return job_num; }
	int get_mac_num()const { return mac_num; }
	int get_max_cycle()const { return max_cycle; }
	int get_max_stand_cycle()const { return max_stand_cycle; }
	double get_max_run_time()const { return max_run_time; }

private:

	void show_cycle(int i);
	bool is_in_tabuTable(const Solution& sol);


	vector<Solution> tabuTable;
	Solution best;
	Solution current;
	int tabuLength;
	int job_num;
	int mac_num;

	int max_cycle = 100;
	int max_stand_cycle = 20;
	double max_run_time = 100.0;
	RandomNumber r;
};





class ActualClass {
 public:
  ActualClass(double value);
  double getValue();
  double add(double toAdd);
 private:
  double value_;
};





/* Author(s): Chris Johnson (chrisjohn404) */
