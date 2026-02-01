import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { KeywordsService } from '../services/keywords.service';
import { AccessLoginGuard } from '@app/auth/guards/access-login.guard';
import { AccessPublicDecorator } from '@app/common/decorators/access-public.decorator';

@ApiTags('Keywords')
@Controller('keywords')
@UseGuards(AccessLoginGuard)
export class KeywordsController {
    constructor(private readonly keywordsService: KeywordsService) { }

    @AccessPublicDecorator()
    @Get('get-all')
    public async getAllKeywords() {
        return await this.keywordsService.getAllKeywords();
    }

    @AccessPublicDecorator()
    @Post('create-bulk')
    public async createBulkKeywords(@Body('names') names: string[]) {
        return await this.keywordsService.createBulkKeywords(names);
    }
}
