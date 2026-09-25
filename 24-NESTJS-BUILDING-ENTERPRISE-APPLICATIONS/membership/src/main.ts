import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 5000);
}

bootstrap().catch((err) => {
  // Ensure unhandled rejections are reported and process exits with non-zero code
  // This satisfies lint/TS rules that require promises to be handled.
  // eslint-disable-next-line no-console
  console.error('Fatal error during bootstrap:', err);
  process.exit(1);
});
