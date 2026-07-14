import { MongoDatabase, PostgresDatabase } from "./Database";
import UserService from "./UserService";


const userServices = new UserService(new MongoDatabase());
const userServicesTwo = new UserService(new PostgresDatabase());