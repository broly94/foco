import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KeywordsEntity } from '../entities/keywords.entity';
import { ErrorManager } from '@app/common/utils/error-manager';

@Injectable()
export class KeywordsService {
    constructor(
        @InjectRepository(KeywordsEntity)
        private readonly keywordsRepository: Repository<KeywordsEntity>,
    ) { }

    public async getAllKeywords() {
        try {
            return await this.keywordsRepository.find({
                order: { name: 'ASC' },
            });
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message);
        }
    }

    public async createKeyword(name: string) {
        try {
            const keyword = this.keywordsRepository.create({ name });
            return await this.keywordsRepository.save(keyword);
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message);
        }
    }

    public async createBulkKeywords(names: string[]) {
        try {
            const savedKeywords = [];
            for (const name of names) {
                const existing = await this.keywordsRepository.findOneBy({ name });
                if (!existing) {
                    const keyword = this.keywordsRepository.create({ name });
                    savedKeywords.push(await this.keywordsRepository.save(keyword));
                }
            }
            return savedKeywords;
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message);
        }
    }
}
