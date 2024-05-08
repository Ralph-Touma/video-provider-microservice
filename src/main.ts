import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config(); 

  const app = await NestFactory.create(AppModule);

  app.enableCors();

  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/video_db', {
    } as mongoose.ConnectOptions);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Could not connect to MongoDB', error);
  }

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, () => {
    console.log(`Video Provider Microservice is running on port ${PORT}`);
  });
}

bootstrap();
