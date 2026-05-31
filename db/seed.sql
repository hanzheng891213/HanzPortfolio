-- HanzPortfolio Seed Data
-- Run: npx wrangler d1 execute hanz-portfolio-db --file=db/seed.sql

INSERT OR IGNORE INTO users (email, password_hash, role) VALUES
  ('hanzheng891213@gmail.com', 'aaa057ac1e0d7591fc3c7a9d026fad7d:cada4afce78516077d45ff2ca07b2bc08f8a798361752beb63bfcaba50103eb7', 'admin'),
  ('O_O@visitor.com', '427a2169660e91e060c4c8aeb93366dc:3ea471d61d4bb109a25b99d1a45968dde078fcdcbecd8c77046e4ef23dfda996', 'visitor');
