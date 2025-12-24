const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const USERS_FILE = path.join(__dirname, 'users.json');

/* ================= REGISTER ================= */
app.post('/api/register', (req, res) => {
    const { ten_tai_khoan, email, password } = req.body;

    if (!ten_tai_khoan || !email || !password) {
        return res.json({ success: false, msg: 'Thiếu thông tin' });
    }

    let users = [];
    if (fs.existsSync(USERS_FILE)) {
        users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    }

    if (users.find(u => u.email === email)) {
        return res.json({ success: false, msg: 'Tài khoản đã tồn tại' });
    }

    const newUser = {
        ten_tai_khoan,
        so_du: 0,
        kich_hoat: false,
        email,
        password,
        created_at: new Date().toISOString()
    };

    users.push(newUser);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    res.json({ success: true, user: newUser });
});

/* ================= LOGIN ================= */
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!fs.existsSync(USERS_FILE)) {
        return res.json({ success: false, msg: 'Chưa có tài khoản' });
    }

    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.json({ success: false, msg: 'Tài khoản không tồn tại hoặc sai mật khẩu' });
    }

    res.json({ success: true, user });
});

/* ================= ACTIVATE KEY ================= */
app.post('/api/activate', (req, res) => {
    const { activate } = req.body;
    if (!fs.existsSync(USERS_FILE)) return res.json({ success: false });

    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    if (users.length > 0) {
        users[0].kich_hoat = activate;
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    }
    res.json({ success: true });
});

/* ================= GET CURRENT USER ================= */
app.get('/api/me', (req, res) => {
    if (!fs.existsSync(USERS_FILE)) return res.json({ success: false });

    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    if (users.length === 0) return res.json({ success: false });

    res.json({ success: true, user: users[0] });
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 3000; // Render sẽ cấp port
app.listen(PORT, () => {
    console.log(`🚀 Server chạy tại port ${PORT}`);
});
