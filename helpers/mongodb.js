const { MongoClient } = require('mongodb');

let client = null;
let db = null;

async function connectToDB() {
    // Jika sudah ada koneksi, langsung kembalikan DB
    if (db) return db;

    // Mencegah double connection jika fungsi dipanggil bersamaan
    if (client) {
        await client.connect();
        db = client.db('bot_data');
        return db;
    }

    try {
        client = new MongoClient(process.env.MONGODB_URI, {
            // Pengaturan agar lebih stabil di server/hosting
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10, // Membatasi jumlah koneksi simultan
        });

        await client.connect();
        db = client.db('bot_data');
        
        console.log("✅ Terhubung ke MongoDB Atlas (Connection Pool Ready)");
        return db;
    } catch (e) {
        console.error("❌ Gagal koneksi MongoDB:", e.message);
        client = null; // Reset client agar bisa mencoba lagi nanti
        throw e;
    }
}

module.exports = { connectToDB };
