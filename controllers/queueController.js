const pool = require('../config/db'); // PostgreSQL ulanishi

// Foydalanuvchi navbat oladi
exports.takeQueue = async (req, res) => {
  const { user_id, service_id, date } = req.body;

  try {
    // Avval shu sana va xizmat bo‘yicha nechta navbat borligini aniqlaymiz
    const result = await pool.query(
      `SELECT COUNT(*) FROM queue WHERE service_id = $1 AND date = $2`,
      [service_id, date]
    );

    const count = parseInt(result.rows[0].count, 10);
    const queueNumber = count + 1;

    // Navbatni qo‘shamiz
    await pool.query(
      `INSERT INTO queue (user_id, service_id, date, number) VALUES ($1, $2, $3, $4)`,
      [user_id, service_id, date, queueNumber]
    );

    res.status(201).json({
      message: 'Navbat olindi',
      queue_number: queueNumber
    });
  } catch (err) {
    res.status(500).json({ message: 'Navbat olishda xatolik', error: err.message });
  }
};

exports.getAllQueues = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        q.id,
        u.fullname,
        u.phone,
        s.name AS service_name,
        q.status,
        TO_CHAR(q.date, 'YYYY-MM-DD') AS date,
        q.number
      FROM queue q
      JOIN users u ON q.user_id = u.id
      JOIN services s ON q.service_id = s.id
      ORDER BY q.date DESC, q.number ASC
    `);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Navbatlar topilmadi' });
    } else if (result.rows.length > 0) {
      res.status(200).json(result.rows);
    }
  } catch (err) {
    res.status(500).json({ message: 'Navbatlar olinmadi', error: err.message });
  }
};

// Admin navbatni tasdiqlaydi/bekor qiladi
exports.updateQueueStatus = async (req, res) => {
  const id = req.params.id;
  const { status } = req.body; // expected: approved / rejected
  try {
    await pool.query(
      'UPDATE queue SET status = $1 WHERE id = $2',
      [status, id]
    );
    res.status(200).json({ message: 'Holat yangilandi' });
  } catch (err) {
    res.status(500).json({ message: 'Yangilashda xatolik', error: err.message });
  }
};

exports.getUserQueues = async (req, res) => {
  const userId = req.params.user_id;
  try {
    const result = await pool.query(`
      SELECT 
        q.id,
        s.name AS service_name,
        q.status,
        TO_CHAR(q.date, 'YYYY-MM-DD') AS date, -- formatlangan sana
        q.number,
        (
          SELECT COUNT(*)
          FROM queue q2 
          WHERE 
            q2.service_id = q.service_id 
            AND q2.date = q.date
            AND q2.status = 'pending'
            AND q2.number < q.number
        ) AS people_before
      FROM queue q
      JOIN services s ON q.service_id = s.id
      WHERE q.user_id = $1 AND q.status = 'pending'
      ORDER BY q.date ASC, q.number ASC
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Foydalanuvchi navbatlari topilmadi' });
    } else {
      // Endi sanani formatlash kerak emas
      return res.status(200).json(result.rows);
    }
  } catch (err) {
    res.status(500).json({ message: 'Foydalanuvchi navbatlari olinmadi', error: err.message });
  }
};


exports.getUserAllQueues = async (req, res) => {
  const userId = req.params.user_id;
  try {
    const result = await pool.query(`
      SELECT 
        q.id,
        s.name AS service_name,
        q.status,
        q.date,
        q.number,
        (
          SELECT COUNT(*) 
          FROM queue q2 
          WHERE 
            q2.service_id = q.service_id 
            AND q2.date = q.date
            AND q2.status = 'pending'
            AND q2.number < q.number
        ) AS people_before
      FROM queue q
      JOIN services s ON q.service_id = s.id
      WHERE q.user_id = $1
      ORDER BY q.date ASC, q.number ASC
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Foydalanuvchi navbatlari topilmadi' });
    }

    // Sanani yyyy-MM-dd formatiga o‘tkazamiz
    const formattedRows = result.rows.map(row => {
      const date = new Date(row.date);
      const formattedDate = date.toISOString().split('T')[0]; // "2025-12-02" shaklida
      return {
        ...row,
        date: formattedDate
      };
    });

    return res.status(200).json(formattedRows);
  } catch (err) {
    res.status(500).json({ message: 'Foydalanuvchi navbatlari olinmadi', error: err.message });
  }
};



