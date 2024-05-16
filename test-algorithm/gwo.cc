#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>
#include <cstdlib>
#include <ctime>
#include <limits>
#include <__numeric/accumulate.h>

const int NUM_WOLVES = 30;       // 灰狼的数量
const int MAX_ITER = 1000;       // 最大迭代次数
const int NUM_JOBS = 10;         // 作业数量
const int NUM_MACHINES = 5;      // 机器数量

struct Job {
    int id;
    std::vector<int> operations;
    // other attributes if necessary
};

struct Wolf {
    std::vector<int> position;
    double fitness;
};

void initializeWolves(std::vector<Wolf>& wolves) {
    for (int i = 0; i < NUM_WOLVES; ++i) {
        Wolf wolf;
        wolf.position = std::vector<int>(NUM_JOBS);
        for (int j = 0; j < NUM_JOBS; ++j) {
            wolf.position[j] = rand() % NUM_MACHINES;
        }
        wolf.fitness = std::numeric_limits<double>::max();
        wolves.push_back(wolf);
    }
}

double calculateFitness(const std::vector<int>& position) {
    // Fitness calculation based on the FJSP specific evaluation function
    double fitness = 0.0;
    // Add your specific fitness calculation logic here
    // This is just a placeholder example
    fitness = std::accumulate(position.begin(), position.end(), 0);
    return fitness;
}

void updatePosition(Wolf& wolf, const Wolf& alpha, const Wolf& beta, const Wolf& delta, int iter) {
    double a = 2.0 - iter * (2.0 / MAX_ITER);
    for (int i = 0; i < NUM_JOBS; ++i) {
        double r1 = ((double) rand() / (RAND_MAX));
        double r2 = ((double) rand() / (RAND_MAX));
        double A1 = 2.0 * a * r1 - a;
        double C1 = 2.0 * r2;
        double D_alpha = fabs(C1 * alpha.position[i] - wolf.position[i]);
        double X1 = alpha.position[i] - A1 * D_alpha;

        r1 = ((double) rand() / (RAND_MAX));
        r2 = ((double) rand() / (RAND_MAX));
        double A2 = 2.0 * a * r1 - a;
        double C2 = 2.0 * r2;
        double D_beta = fabs(C2 * beta.position[i] - wolf.position[i]);
        double X2 = beta.position[i] - A2 * D_beta;

        r1 = ((double) rand() / (RAND_MAX));
        r2 = ((double) rand() / (RAND_MAX));
        double A3 = 2.0 * a * r1 - a;
        double C3 = 2.0 * r2;
        double D_delta = fabs(C3 * delta.position[i] - wolf.position[i]);
        double X3 = delta.position[i] - A3 * D_delta;

        wolf.position[i] = (X1 + X2 + X3) / 3.0;
    }
}

void optimize() {
    std::vector<Wolf> wolves;
    initializeWolves(wolves);

    Wolf alpha, beta, delta;
    alpha.fitness = beta.fitness = delta.fitness = std::numeric_limits<double>::max();

    for (int iter = 0; iter < MAX_ITER; ++iter) {
        for (auto& wolf : wolves) {
            wolf.fitness = calculateFitness(wolf.position);

            if (wolf.fitness < alpha.fitness) {
                delta = beta;
                beta = alpha;
                alpha = wolf;
            } else if (wolf.fitness < beta.fitness) {
                delta = beta;
                beta = wolf;
            } else if (wolf.fitness < delta.fitness) {
                delta = wolf;
            }
        }

        for (auto& wolf : wolves) {
            updatePosition(wolf, alpha, beta, delta, iter);
        }

        std::cout << "Iteration " << iter << " Best Fitness: " << alpha.fitness << std::endl;
    }

    std::cout << "Optimal solution found with fitness: " << alpha.fitness << std::endl;
}

int main() {
    srand(time(0));
    optimize();
    return 0;
}
