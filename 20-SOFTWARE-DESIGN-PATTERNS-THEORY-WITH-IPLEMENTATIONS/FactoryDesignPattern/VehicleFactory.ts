type vehicleType = "car" | "bike";

interface Vehicle {
    drive(): void;
}


class Car implements Vehicle {
    drive(): void {
        console.log("Driving a car...");
    }
}


class Bike implements Vehicle {
    drive(): void {
        console.log("Riding a bike...");
    }
}

class VehicleFactory {
    static createVehicle(type: vehicleType): Vehicle {
        if (type === "car") {
            return new Car();
        } else if (type === "bike") {
            return new Bike();
        } else {
            throw new Error("Invalid vehicle type");
        }
    }
}

export {Vehicle, VehicleFactory, Car, Bike}