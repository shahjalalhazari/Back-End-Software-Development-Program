import { Body, Controller, Get, HttpCode, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express'; // Response and Request will comes from Express.
import { CatService } from './cat.service';

export class CreateCatDto {
    name: string;
    age: number;
    breed: string;
}

@Controller('cat') // = app.get("/cat") "localhost:5000/cat"
export class CatController {

    constructor(private catService: CatService) {} // LIKE REGISTER CAT SERVICE IN CONTROLLER

    @Get('/all') // a = 'localhost:5000/cat/all'
    getAllCats(@Req() request:Request, @Res() response:Response): Response { // Now this method's type will be Response.
        console.log(request);
        return response.send("This will give a list of cats.");
    }

    @Post("/add")
    @HttpCode(204) // custome status code
    AddCat(@Req() request:Request, @Res() response:Response): Response {
        console.log(request);
        return response.send("New cat added.")
    }

    @Post()
    async create(@Body() createCatDto: CreateCatDto) {
        console.log(createCatDto);
        return "This action adds a new cat."
    }
}
