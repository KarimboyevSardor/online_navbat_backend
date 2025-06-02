// controllers/serviceController.js
const pool = require('../config/db'); // PostgreSQL ulanishi

// Barcha xizmatlarni olish
exports.getAllServices = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM services ORDER BY id');
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Xizmatlar topilmadi' });
    } else if (result.rows.length > 0) {
      res.status(200).json(result.rows);
    }
  } catch (err) {
    res.status(500).json({ message: 'Xizmatlar olinmadi', error: err.message });
  }
};

// Xizmat qo‘shish (faqat admin uchun frontendda nazorat qilinadi)
exports.addService = async (req, res) => {
  const { name, description } = req.body;
  try {
    await pool.query(
      'INSERT INTO services (name, description) VALUES ($1, $2)',
      [name, description]
    );
    res.status(201).json({ message: 'Xizmat muvaffaqiyatli qo‘shildi' });
  } catch (err) {
    res.status(500).json({ message: 'Xizmat qo‘shilmadi', error: err.message });
  }
};

// Xizmatni va unga tegishli navbatlarni o‘chirish
exports.deleteService = async (req, res) => {
  const id = req.params.id;
  try {
    // Avval ushbu servicega tegishli barcha queue yozuvlarini o‘chiramiz
    await pool.query('DELETE FROM queue WHERE service_id = $1', [id]);

    // So'ng service ni o‘chiramiz
    await pool.query('DELETE FROM services WHERE id = $1', [id]);

    res.status(200).json({ message: 'Xizmat va unga tegishli navbatlar o‘chirildi' });
  } catch (err) {
    res.status(500).json({ message: 'Xizmat o‘chirilmadi', error: err.message });
  }
};


// Xizmatni tahrirlash
exports.updateService = async (req, res) => {
  const id = req.params.id;
  const { name, description } = req.body;
  try {
    await pool.query(
      'UPDATE services SET name = $1, description = $2 WHERE id = $3',
      [name, description, id]
    );
    res.status(200).json({ message: 'Xizmat yangilandi' });
  } catch (err) {
    res.status(500).json({ message: 'Yangilashda xatolik', error: err.message });
  }
};
