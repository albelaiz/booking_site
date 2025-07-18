-- MySQL User Permission Fix Commands
-- Run these on your MySQL server (172.233.120.178:3306)

-- Option 1: Grant permissions to user from any host (recommended)
GRANT ALL PRIVILEGES ON myapp_db.* TO 'tamudastay'@'%' IDENTIFIED BY 'DAdAH@&&1206';
FLUSH PRIVILEGES;

-- Option 2: If user already exists, update the host
UPDATE mysql.user SET Host='%' WHERE User='tamudastay';
FLUSH PRIVILEGES;

-- Option 3: Create new user with remote access (if user doesn't exist)
CREATE USER 'tamudastay'@'%' IDENTIFIED BY 'DAdAH@&&1206';
GRANT ALL PRIVILEGES ON myapp_db.* TO 'tamudastay'@'%';
FLUSH PRIVILEGES;

-- Verify the user permissions
SELECT User, Host FROM mysql.user WHERE User='tamudastay';
SHOW GRANTS FOR 'tamudastay'@'%';

-- Test connection from command line (run this from any external machine)
-- mysql -h 172.233.120.178 -P 3306 -u tamudastay -p myapp_db
