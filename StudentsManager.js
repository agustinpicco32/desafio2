import fs from "fs";

class UserManager {
    #filePath;
    #lastId = 0;

    constructor(filePath = "./user.json") {
        this.#filePath = filePath;
        this.#setLastId();
    }

    async addUser(name, age, courses = []) {
        try {
            if (!name || !age) {
                throw new Error("Nombre y año requeridos");
            }
            const user = await this.getUsers();
    
            if (user.find((u) => u.name === name)) {
                throw new Error("El usuario ya existe");
            }
    
            const newUser = {
                name,
                age,
                id: ++this.#lastId,
            };
    
            user.push(newUser);
    
            await this.#saveUsers(user);
            
        } catch (error) {
            console.log(error);
        }
    }


    async getUsers() {
        try {

            if(fs.existsSync(this.#filePath)) {
                const users = JSON.parse(await fs.promises.readFile(this.#filePath, "utf-8"));
                return users;
            }
            return [];
        } catch (error) {
            console.log(error);
        }
        
    }


    async getUsersById(id) {
    try {
        const users = await this.getUsers();

        const user = users.find((u) => u.id === id);

        return user;
    } catch (error) {
        console.log(error);
    }
    }


    async deleteUserById(id) {
        try {
            let users = await this.getUsers();

            users = users.filter((u) => u.id !== id);

            this.#saveUsers(users);
        } catch (error) {
            onsole.log(error.name, error.message);
        }
    }


    async updateUser(id, fieldToUpdate, newValue) {
        try {
            const users = await this.getUsers();

            const userIndex = users.findIndex((u) => u.id === id);

            if (userIndex < 0) {
                throw new Error(`Usuario con id ${id} no encontrado`);
            }

            users[userIndex][fieldToUpdate] = newValue;

            await this.#saveUsers(users);
        } catch (error) {
            onsole.log(error.name, error.message);
        }
    }

    async #setLastId() {
        try {
            const users = await this.getUsers();
            if (users.length < 1) {
                this.#lastId = 0;
                return;
            }

            this.#lastId = users[users.length - 1].id;
        } catch (error) {
            console.log(error);
        }
    }

    async #saveUsers(users) {
        try {
            await fs.promises.writeFile(this.#filePath, JSON.stringify(users));
        } catch (error) {
            console.log(error);
        }
    }
}

const userManager = new UserManager("./users.json");

console.log(await userManager.getUsers());

await userManager.addUser("Agus", 24);

/* console.log(await userManager.getUsers()); */

await userManager.addUser("Joaco", 25);

/* console.log(await userManager.getUsersById(2)); */

console.log(await userManager.getUsers());

/* await userManager.deleteUserById(2);

console.log(await userManager.getUsers()); */

await userManager.updateUser(1, "name", "Agustin");

await userManager.updateUser(2, "name", "Joaquin");

console.log(await userManager.getUsers());