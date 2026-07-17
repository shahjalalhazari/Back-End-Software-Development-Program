import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// ABOUT THIS FILE
// A BASIC CONTROLLER WITH A SINGLE ROUTE

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() //= app.get("/"), "localhost:5000".
  getHello(): string {
    return this.appService.getHello();
  }
}
