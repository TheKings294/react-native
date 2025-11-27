import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PlacesModule } from './modules/places/places.module';
import { RoadbooksModule } from './modules/roadbooks/roadbooks.module';
import { SocialModule } from './modules/social/social.module';
import { MediaModule } from './modules/media/media.module';
import { ExportsModule } from './modules/exports/exports.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [AuthModule, UsersModule, PlacesModule, RoadbooksModule, SocialModule, MediaModule, ExportsModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
