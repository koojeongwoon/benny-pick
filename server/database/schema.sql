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
