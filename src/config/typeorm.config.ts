import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export function TypeormConfig(configService: ConfigService){
    const env = configService.get('NODE_ENV');
    if(!['dev', 'prod'].includes(env)) {
        throw Error('dev나 prod 환경이어야 합니다.');
    }

    const synchronize = configService.get<string>('SYNCHRONIZE') === 'true' ? true : false;
    const logging = configService.get<string>('DB_LOGGING') === 'true' ? true : false;
    const DB_TYPE: 'mysql' | null = 'mysql';
    console.log(configService.get('DB_PORT'));
    const option: TypeOrmModuleOptions = {
        type: DB_TYPE,
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: env === 'prod' ? false : synchronize,
        logging: logging,
        timezone: 'Asia/Seoul'
    };

    return option;
}