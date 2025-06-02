const pool = require('../config/db'); // PostgreSQL ulanishi

// Ro'yxatdan o'tish
exports.register = async (req, res) => {
  const { fullname, phone, password, role } = req.body;
  try {
    // Telefon raqam mavjudligini tekshirish
    const userCheck = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Telefon raqam allaqachon mavjud' });
    }

    // Parolni oddiy ko'rinishda saqlash (xavfsizlik uchun hashlash tavsiya etiladi!)
    const insertResult = await pool.query(
      `INSERT INTO users (fullname, phone, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, fullname, phone, role`,
      [fullname, phone, password, role]
    );

    const newUser = insertResult.rows[0];

    // Login kabi ma'lumotlarni qaytaramiz
    res.status(201).json({  
      message: 'Ro‘yxatdan o‘tildi',
      user: newUser
    });
  } catch (err) {
    res.status(500).json({ message: 'Server xatosi', error: err.message });
    console.error('Ro‘yxatdan o‘tishda xato:', err);
  }
};


// Login
exports.login = async (req, res) => {
  const { phone, password } = req.body;
  try {
    const userRes = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
    }

    const user = userRes.rows[0];

    // Parolni oddiy ko‘rinishda tekshirish
    if (password !== user.password) {
      return res.status(400).json({ message: 'Parol noto‘g‘ri' });
    }

    res.status(200).json({
      message: 'Muvaffaqiyatli kirdingiz',
      user: {
        id: user.id,
        fullname: user.fullname,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server xatosi', error: err.message });
  }
};
