CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  fullname VARCHAR(100),
  phone VARCHAR(20) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(10), -- user, admin
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE queue (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  date DATE NOT NULL,
  service_id INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, currently_in_queue, passed
  number INTEGER NOT NULL
);

CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
