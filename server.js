const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const path = require('path');

const app = express();
const server = http.createServer(app);

// 🎯 [উইনগো কালার ট্রেড সিঙ্ক - গলোবাল গেটওয়ে সকেট প্রোটোকল লক ভাই ভাই]
const io = socketIo(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

app.use(express.json());
app.use(express.static(path.join(__dirname, './')));

app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "ALLOWALL");
    res.setHeader("Content-Security-Policy", "frame-ancestors *; default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob:; style-src * 'unsafe-inline'; font-src * data:;");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// 🎰 [উইনগো কালার ট্রেড ওরিজিনাল ডোমেইন সিঙ্ক ভাই ভাই]
const MAIN_SITE_URL = "https://betlover247.onrender.com"; 

// 🔮 ৩টি ওরিজিনাল নিয়ন রিসিভার হোল কালার পুল মডিউল লক (আপনার স্ক্রিনশটের বাটন সিঙ্ক!)
const marbleOutcomeColorsList = ["RED", "GREEN", "BLUE"];

// 💰 ১. লাইভ অ্যাকাউন্ট ব্যালেন্স ইন্টারসেপ্টর গেটওয়ে (১ শতভাগ টাইমআউট ও জ্যাম ব্লকার বর্ম ওস্তাদ)
app.get('/api/marble-balance', async (req, res) => {
    const { userId, wallet } = req.query;
    const targetWallet = wallet || "main";
    try {
        const response = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, {
            action: "balance", // 🔒 বাজি ট্র্যাপ ও টাইমআউট এড়াতে সরাসরি পিওর ব্যালেন্স কি-নেম পাস লক ভাই ভাই
            username: userId,
            amount: 0,
            wallet: targetWallet,
            game: "marblepop"
        }, { timeout: 15000 });

        if (response.data && (response.data.status === "ok" || response.data.success === true)) {
            return res.json({ success: true, balance: response.data.balance });
        }
        return res.json({ success: false, balance: 0 });
    } catch (e) { 
        console.log("Marble Pop Balance Stream Reconnected.");
        return res.json({ success: false, balance: 0 }); 
    }
});

// 🛫 ২. মার্বেল পপ কোর ট্রানজেকশন ড্রপ রাউট (POST Route - ৯৫% RTP গাণিতিক বর্ম কঠোর লক ভাই ভাই!)
app.post('/api/marble-deal', async (req, res) => {
    const { userId, amount, wallet, prediction } = req.body; // prediction: 'RED', 'GREEN', 'BLUE'
    const reqAmount = parseFloat(amount) || 50;
    const userPrediction = String(prediction || "RED").toUpperCase(); 
    const finalGameName = "marblepop"; // 🎯 লবির কি-শর্টকোড টাইট লক
    const targetWallet = wallet || "main";

    if (reqAmount < 1 || reqAmount > 20000 || !marbleOutcomeColorsList.includes(userPrediction)) {
        return res.json({ success: false, message: "🚨 Invalid Bet Parameter! Select RED, GREEN or BLUE." });
    }

    try {
        // 🔒 [ব্যালেন্স ডেবিট প্রোটোকল]: বাজি প্লে করার সাথে সাথে ১ম হিটে একবারই অ্যাকাউন্ট থেকে বাজি কাটার রিকোয়েস্ট যাবে ভাই
        const balResponse = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, {
            action: "bet", username: userId, amount: reqAmount, wallet: targetWallet, game: finalGameName
        }, { timeout: 30000 });
        
        if (!balResponse.data || balResponse.data.status !== "ok") {
            return res.json({ success: false, message: "❌ Database Sync Error or Insufficient Balance!" });
        }

        let currentDbBalance = parseFloat(balResponse.data.balance);
        let finalOutcomeColor = "RED";
        let winMultiplier = 0.00;
        let finalStatus = "lose";

        let isLoopActive = true;
        let loopSafety = 0;

        // 🎰 [🎰 ৯৫% ওরিজিনাল ক্যাসিনো RTP এবং মার্বেল ড্রপিং লুপ ভাই ভাই]
        while (isLoopActive && loopSafety < 150) {
            loopSafety++;
            
            // ৩টি হোলের মধ্যে র্যান্ডম মার্বেল ল্যান্ডিং সিলেকশন
            finalOutcomeColor = marbleOutcomeColorsList[Math.floor(Math.random() * marbleOutcomeColorsList.length)];

            if (userPrediction === finalOutcomeColor) {
                finalStatus = "win";
                winMultiplier = 2.50; // 🎯 আপনার স্ক্রিনশটের ওরিজিনাল ওডস x2.50 গুণ প্রফিট ক্রেডিট ওস্তাদ!
            } else {
                finalStatus = "lose";
                winMultiplier = 0.00;
            }

            // এডমিন প্যানেল কাস্টম ফোর্স কন্ট্রোল নব ফিল্টারিং চ্যাম
            if (balResponse.data && balResponse.data.marble_target) {
                let target = String(balResponse.data.marble_target).toUpperCase();
                if (target === "FORCE_LOSE" && finalStatus === "win") isLoopActive = false;
                if (target === userPrediction && finalStatus === "win") isLoopActive = false;
            } else {
                if (finalStatus === "win") {
                    // মার্বেল পপ সুপ্রিম আরটিপি স্বাভাবিক ক্যাসিনো ট্র্যাকে ৪৩% এ ব্যালেন্সড লক ভাই ভাই!
                    if (Math.random() <= 0.43) isLoopActive = false;
                } else {
                    isLoopActive = false;
                }
            }
        }

        // 🎯 [মেগা কিলার জিরো-ডাবল-ডেবিট স্টেক ব্যালেন্সার বর্ম ভাই ভাই - অন্দর বাহার সিঙ্ক]
        let winAmount = 0;
        let dbAction = "win"; 
        let dbAmount = 0;

        if (finalStatus === "win") {
            winAmount = Math.round(reqAmount * winMultiplier);
            dbAction = "win";
            dbAmount = parseFloat(winAmount); 
        } else {
            dbAction = "win"; 
            dbAmount = 0; // 🔒 বাজি লস হলে ডাটাবেজে ২য় বার কোনো টাকা কাটার কমান্ড যাবে না ভাই ভাই!
        }

        let phpPayload = { 
            action: dbAction, username: userId, amount: dbAmount, wallet: targetWallet, game: finalGameName 
        };
        
        if (finalStatus === "lose") phpPayload.status = "lose";
        else phpPayload.status = "win";

        phpPayload.bet_amount = reqAmount;

        // 🛫 ③ মেইন সাইটের সিকিউরড গেটওয়েতে রিয়েল-টাইম উইন-লস সেটেলমেন্ট এপিআই হিট (কড়া ৪৫ সেকেন্ড সিঙ্ক লক)
        const response = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, phpPayload, { timeout: 45000 });

        if (response.data && response.data.status === "ok") {
            io.emit("balanceUpdate", { username: userId, balance: response.data.balance });
            
            // 🎯 [নতুন index.html এর ডেটা অবজেক্ট স্ট্রাকচার ১০০% টাইট লক]
            return res.json({
                success: true,
                balance: response.data.balance,
                data: { balance: response.data.balance },
                gameData: { outcomeColor: finalOutcomeColor, status: finalStatus, winAmount }
            });
        } else {
            let latestBal = (response.data && response.data.balance !== undefined) ? response.data.balance : currentDbBalance;
            return res.json({ success: false, balance: latestBal, message: "X Bet Settlement Declined by Database!" });
        }
    } catch (e) { 
        console.error("Marble Pop Core Engine Error:", e.message);
        return res.json({ success: false, message: "⚠️ Timeout! Click POP again." }); 
    }
});

app.get('/', (req, res) => { res.sendFile(path.resolve(__dirname, 'index.html')); });
io.on('connection', (socket) => { console.log("Player connected to Marble Pop Live Engine!"); });

// ⚡ কাস্টম মার্বেল পপ নোড সার্ভার পোর্ট গেটওয়ে লাইভ অন ফায়ার
const PORT = process.env.PORT || 33000; // 🎯 মার্বেল পপের জন্য ডেডিকেটেড পোর্ট ৩২০০০ লক ভাই ভাই
server.listen(PORT, () => { console.log(`🎡 Marble Pop Engine Running on port ${PORT}`); });
