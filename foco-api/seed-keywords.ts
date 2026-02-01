import { DataSource } from 'typeorm';
import { KeywordsEntity } from './src/keywords/entities/keywords.entity';
import { DataSourceConfig } from './src/config/data-source';

async function seed() {
    const AppDataSource = new DataSource(DataSourceConfig as any);
    await AppDataSource.initialize();

    const repository = AppDataSource.getRepository(KeywordsEntity);

    const keywords = [
        'Marketing Digital',
        'Desarrollo Web',
        'Diseño Gráfico',
        'Redes Sociales',
        'SEO',
        'Copywriting',
        'Fotografía',
        'Video Making',
        'E-commerce',
        'Publicidad',
        'Consultoría',
        'Eventos',
        'Software',
        'Aplicaciones Móviles'
    ];

    for (const name of keywords) {
        const exists = await repository.findOneBy({ name });
        if (!exists) {
            const keyword = repository.create({ name });
            await repository.save(keyword);
            console.log(`Keyword created: ${name}`);
        }
    }

    await AppDataSource.destroy();
}

seed().catch(err => console.error(err));
