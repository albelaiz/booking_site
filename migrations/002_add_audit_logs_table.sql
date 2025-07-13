-- Migration: Add audit_logs table for tracking admin and staff actions
-- Created: 2025-06-30

CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id INTEGER,
  old_values TEXT,
  new_values TEXT,
  ip_address TEXT,
  user_agent TEXT,
  severity TEXT NOT NULL DEFAULT 'info',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_severity ON audit_logs(severity);

-- Add comments for documentation
COMMENT ON TABLE audit_logs IS 'Tracks all administrative and staff actions for compliance and security auditing';
COMMENT ON COLUMN audit_logs.user_id IS 'ID of the user who performed the action';
COMMENT ON COLUMN audit_logs.action IS 'Type of action performed (e.g., user_create, property_update, etc.)';
COMMENT ON COLUMN audit_logs.entity IS 'Type of entity affected (user, property, booking, system, etc.)';
COMMENT ON COLUMN audit_logs.entity_id IS 'ID of the specific entity affected (optional)';
COMMENT ON COLUMN audit_logs.old_values IS 'JSON string of values before the change (for updates/deletes)';
COMMENT ON COLUMN audit_logs.new_values IS 'JSON string of values after the change (for creates/updates)';
COMMENT ON COLUMN audit_logs.ip_address IS 'IP address of the user who performed the action';
COMMENT ON COLUMN audit_logs.user_agent IS 'Browser/device information of the user';
COMMENT ON COLUMN audit_logs.severity IS 'Severity level: info, warning, error, critical';
COMMENT ON COLUMN audit_logs.description IS 'Human-readable description of what happened';
COMMENT ON COLUMN audit_logs.created_at IS 'Timestamp when the action was performed';
