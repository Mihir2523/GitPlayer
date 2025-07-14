import express from "express";
import Storage from "./models/Storage.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";
const app = express();
let store = new Storage();
let GLOBAL_ID = 0;
app.use(express.json());
app.use(cors());
const SECRET = "secret";

async function auth(req, res, next) {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: "Error" });
    const tt = token.split(' ')[1];
    if (!tt) return res.status(401).json({ error: "Error" });
    try {
        const decr = jwt.verify(tt, SECRET);
        req.user = decr;
        next();
    } catch (e) {
        res.status(401).json({ error: "Invalid token" });
    }
}

app.post('/user', async (req, res) => {
    const { email, password } = req.body;
    if (store.GetUser(email)) return res.json({ data: "User Already Exists" });
    const data = { email, password };
    const t = await store.Register(email, data);   
    res.json({ data: t });
});

app.post('/user/login', async (req, res) => {
    const { email, password } = req.body;
    const user = store.GetUser(email);
    if (!user) return res.json({ data: "False Credentials" });
    const flag = await bcrypt.compare(password, user.password);
    if (!flag) {
        return res.json({ data: "False Credentials" });
    }
    const token = jwt.sign(user, SECRET);
    res.json({
        token: token,
        status: true
    });
});

app.get('/items', auth, (req, res) => {
    res.json({ data: store.GetAll() });
});

app.get('/item/:id', auth, (req, res) => {
    const id = Number(req.params.id);
    res.json({ data: store.GetItem(id) });
});

app.post('/item', auth, (req, res) => {
    const { price, discount } = req.body;
    const data = { price, discount };
    GLOBAL_ID++;
    const t = store.Insert(GLOBAL_ID, data);
    res.json({ data: t });
});

app.put('/item', auth, (req, res) => {
    const { id, price, discount } = req.body;
    const t = store.Update(Number(id), { price, discount });
    res.json({ msg: t });
});

app.listen(3000, () => console.log(3000));