import bcrypt from "bcrypt";
export default class Storage {
    constructor() {
        this.store = new Map();
        this.users = new Map();
    }
    GetItem(id) {
        return this.store.get(id);
    }
    GetAll() {
        let ans = [];
        this.store.forEach((item) => {
            ans.push(item);
        });
        return ans;
    }
    Update(id, data) {
        if (!this.store.has(id)) return null;
        this.store.set(id, data);
        return data;
    }
    Insert(id, data) {
        if (this.store.get(id)) return null;
        this.store.set(id, data);
        return data;
    }
    async Register(id, data) {
        if (this.users.get(id)) return null;
        data.password = await bcrypt.hash(data.password, 10);
        this.users.set(id, data);
        return this.users.get(id); 
    }
    GetUser(id) {
        return this.users.get(id);
    }
}
