const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());

const mongoURI = 'mongodb://127.0.0.1:27017/bento_shop';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err.message));

const db = mongoose.connection;
db.once('open', () => console.log('MongoDB connected'));
db.on('error', (err) => console.error('MongoDB connection error', err));

const userSchema = new mongoose.Schema({
    id: Number,
    name: String,
    company: String,
    username: String,
    email: String,
    address: String,
    zip: String,
    state: String,
    country: String,
    phone: String,
    photo: String
});

const User = mongoose.model('User', userSchema);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'front.html'));
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/users/import', async (req, res) => {
    try {
        const response = await axios.get('https://fake-json-api.mock.beeceptor.com/users');
        const importedUsers = response.data;

        // 確保資料格式匹配
        await User.insertMany(importedUsers);
        res.json({ message: '資料匯入成功', data: importedUsers });
    } catch (error) {
        console.error(error);
        res.status(500).send('匯入失敗: ' + error.message);
    }
});

app.post('/users', async (req, res) => {
    try {
        console.log('Received data:', req.body); // 查看前端送來的資料
        const newUser = new User(req.body);
        await newUser.save();
        res.json({ message: '資料新增成功', data: newUser });
    } catch (error) {
        console.error('新增失敗:', error.message); // 顯示錯誤
        res.status(500).send('新增失敗' + error.message);
    }
});

// 刪除用戶資料
app.delete('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;  // 取得 URL 中的 ID
        console.log("正在刪除用戶ID:", userId); // 確認 ID 是否正確
        
        const result = await User.deleteOne({ _id: userId });  // 根據 _id 刪除
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: '用戶不存在' });
        }
        
        res.json({ message: '用戶已刪除' });
    } catch (error) {
        console.error('刪除錯誤:', error);
        res.status(500).json({ message: '刪除失敗', error: error.message });
    }
});







const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

app.use(cors());
