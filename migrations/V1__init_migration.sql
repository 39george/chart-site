CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(500) NOT NULL
);

CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Create `users_groups` table for many-to-many
-- relationships between users and groups.
CREATE TABLE users_groups (
    users_id INTEGER REFERENCES users(id) ON DELETE CASCADE,    
    groups_id INTEGER REFERENCES groups(id) ON DELETE RESTRICT,
    PRIMARY KEY (users_id, groups_id)
);

-- Create `groups_permissions` table for many-to-many relationships
-- between groups and permissions.
CREATE TABLE groups_permissions (
    groups_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    permissions_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (groups_id, permissions_id)
);

-- Insert "users" and "administrators" groups.
INSERT INTO groups (name) VALUES ('group.administrators');

-- Insert individual permissions.
INSERT INTO permissions (name) VALUES ('administrator');

-- Insert group permissions.
INSERT INTO groups_permissions (groups_id, permissions_id)
VALUES (
    (SELECT id FROM groups WHERE name = 'group.administrators'),
    (SELECT id FROM permissions WHERE name = 'administrator')
);

