import { FakeDatabase, MongoDatabase, PostgresDatabase } from "./Database";
import UserService from "./UserService";


const userServices = new UserService(new MongoDatabase());
const userServicesTwo = new UserService(new PostgresDatabase());


const fakeUserServices = new UserService(new FakeDatabase());
const fakeUsers = fakeUserServices.getUsers();
console.log(fakeUsers);