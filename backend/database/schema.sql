-- Portfolio Database Schema (PostgreSQL)
-- Converted from MySQL to PostgreSQL

-- Table for storing contact messages
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(500),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_status BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_email ON messages(email);
CREATE INDEX idx_created_at ON messages(created_at);

-- Table for tracking profile views
CREATE TABLE IF NOT EXISTS profile_views (
    id SERIAL PRIMARY KEY,
    ip_address VARCHAR(45),
    user_agent TEXT,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ip_address ON profile_views(ip_address);
CREATE INDEX idx_viewed_at ON profile_views(viewed_at);

-- Table for tracking unique visitors
CREATE TABLE IF NOT EXISTS visitors (
    id SERIAL PRIMARY KEY,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    referrer TEXT,
    visit_count INTEGER DEFAULT 1,
    first_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(ip_address)
);

CREATE INDEX idx_visitor_ip ON visitors(ip_address);
CREATE INDEX idx_last_visit ON visitors(last_visit);

-- Table for daily analytics
CREATE TABLE IF NOT EXISTS analytics (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    total_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    messages_received INTEGER DEFAULT 0
);

CREATE INDEX idx_analytics_date ON analytics(date);
