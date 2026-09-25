import { Injectable } from '@nestjs/common';

@Injectable()
export class CatService {
    getCats(): string {
        return "This will return all cats from CatService."
    }
}
