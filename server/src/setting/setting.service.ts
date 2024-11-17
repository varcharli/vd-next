import { Injectable } from '@nestjs/common';
import { Setting } from './entities/setting.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
  ) { }

  async loadSetting(name: string) {
    const re = await this.settingRepository.findOneBy({ name });
    return re?.value;
  }

  async saveSetting(name: string, value: string) {
    let setting = await this.settingRepository.findOneBy({ name });
    if (!setting) {
      setting = new Setting();
      setting.name = name;
      setting.value = value;
      await this.settingRepository.save(setting);
      return;
    }
    setting.value = value;
    await this.settingRepository.update(setting.id, setting);
    return;
  }


}
