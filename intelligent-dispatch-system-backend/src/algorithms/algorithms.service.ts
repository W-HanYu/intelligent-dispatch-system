import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Algorithm } from './entities/algorithm.entity';
import { PredefinedParam } from './entities/predefined-param.entity';

@Injectable()
export class AlgorithmsService {
  constructor(
    @InjectRepository(Algorithm)
    private readonly algorithmRepository: Repository<Algorithm>,
    @InjectRepository(PredefinedParam)
    private readonly paramRepository: Repository<PredefinedParam>,
  ) {}

  async onModuleInit() {
    await this.insertInitialData();
  }

  async insertInitialData() {
    const algorithms = [
      { value: 'yichuan', label: '遗传算法' },
      { value: 'jinji', label: '禁忌算法' },
      { value: 'lizi', label: '粒子群优化算法' },
      { value: 'tuihuo', label: '模拟退火算法' },
      { value: 'custom', label: '自定义算法' },
    ];

    const predefinedParams = {
      yichuan: [
        { param_name: '算例规模工件数量X机器数量', param_value: '10*6' },
        { param_name: '终止条件', param_value: '30' },
        { param_name: '最优个体赋值比例', param_value: '0.3' },
        { param_name: '交叉概率', param_value: '0.6' },
        { param_name: '变异概率', param_value: '0.1' },
        { param_name: '最好基因保留概率', param_value: '0.02' },
        { param_name: '交叉对数', param_value: '4' },
      ],
      lizi: [
        { param_name: '算例规模工件数量X机器数量', param_value: '10*6' },
        { param_name: '粒子偏移概率', param_value: '0.3' },
        { param_name: '每次改变点位数', param_value: '1' },
      ],
      tuihuo: [
        { param_name: '算例规模工件数量X机器数量', param_value: '10*6' },
        { param_name: '本次模拟退火由初始温度', param_value: '1000' },
        { param_name: '到终止温度', param_value: '10' },
        { param_name: '温度下降速率', param_value: '0.95' },
        { param_name: '等温过程迭代次数', param_value: '20' },
      ],
      jinji: [
        { param_name: '算例规模工件数量X机器数量', param_value: '10*6' },
        { param_name: '禁忌长度', param_value: '30' },
        { param_name: '单次生成工序邻域数量', param_value: '20' },
        { param_name: '单次生成机器邻域数量', param_value: '20' },
        { param_name: '最大迭代次数', param_value: '50' },
      ],
    };

    // 先清理重复的 value
    const duplicateValues = await this.algorithmRepository
      .createQueryBuilder('algorithm')
      .select('value')
      .addSelect('COUNT(*)', 'count')
      .groupBy('value')
      .having('COUNT(*) > 1')
      .getRawMany();

    for (const { value } of duplicateValues) {
      const duplicates = await this.algorithmRepository.find({
        where: { value },
      });
      for (let i = 1; i < duplicates.length; i++) {
        await this.algorithmRepository.remove(duplicates[i]);
      }
    }

    // 清理空值条目
    await this.algorithmRepository
      .createQueryBuilder('algorithm')
      .delete()
      .where('value IS NULL OR value = ""')
      .execute();

    for (const algorithm of algorithms) {
      const existingAlgorithm = await this.algorithmRepository.findOneBy({
        value: algorithm.value,
      });
      if (!existingAlgorithm) {
        const newAlgorithm = this.algorithmRepository.create(algorithm);
        await this.algorithmRepository.save(newAlgorithm);

        const params = predefinedParams[algorithm.value];
        if (params && Array.isArray(params)) {
          for (const param of params) {
            const newParam = this.paramRepository.create({
              ...param,
              algorithm: newAlgorithm,
            });
            await this.paramRepository.save(newParam);
          }
        }
      }
    }


  }

  async createAlgorithm(algorithm: Partial<Algorithm>): Promise<Algorithm> {
    return this.algorithmRepository.save(algorithm);
  }

  async createParam(param: Partial<PredefinedParam>): Promise<PredefinedParam> {
    return this.paramRepository.save(param);
  }

  async getAllAlgorithms(): Promise<Algorithm[]> {
    return this.algorithmRepository.find({ relations: ['params'] });
  }



  // async getAlgorithmById(id: number): Promise<Algorithm> {
  //   return this.algorithmRepository.findOne(id, { relations: ['params'] });
  // }
}
