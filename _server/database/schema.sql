-- ============================================
-- Users Table (인증용)
-- ============================================
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  is_active INTEGER NOT NULL DEFAULT 1,
  onboarding_completed INTEGER NOT NULL DEFAULT 0,
  -- 프로필 정보 (온보딩에서 수집)
  profile_region TEXT,
  profile_life_cycle TEXT,
  profile_interests TEXT
);

CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- Welfare Policies Table (복지 정책)
-- ============================================
DROP TABLE IF EXISTS welfare_policies;

CREATE TABLE welfare_policies (
  policy_id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  ministry TEXT,
  source_type TEXT NOT NULL CHECK (source_type IN ('central', 'regional')),
  ctpv_nm TEXT,  -- 시/도
  sgg_nm TEXT,   -- 시/군/구
  support_content TEXT,
  support_provision TEXT,
  target_detail TEXT,
  application_method TEXT,
  application_detail TEXT,
  phone TEXT,
  website TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_welfare_policies_source_type ON welfare_policies(source_type);
CREATE INDEX idx_welfare_policies_ctpv ON welfare_policies(ctpv_nm);
CREATE INDEX idx_welfare_policies_title ON welfare_policies(title);

-- ============================================
-- Legacy Policies Table (기존 호환성 유지)
-- ============================================
DROP TABLE IF EXISTS policies;

CREATE TABLE policies (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  age_min INTEGER,
  age_max INTEGER,
  income_limit TEXT,
  region TEXT,
  benefit_summary TEXT,
  description TEXT,
  apply_url TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_policies_category ON policies(category);
CREATE INDEX idx_policies_region ON policies(region);
