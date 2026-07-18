-- ILKOM backend optimized MySQL schema (MySQL 8.0+)
-- Focus: admin/public high-traffic paths, status filters, FK joins, and timeline queries.

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    email_verified_at TIMESTAMP NULL DEFAULT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin TINYINT(1) NOT NULL DEFAULT 0,
    remember_token VARCHAR(100) NULL DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY users_email_unique (email),
    KEY idx_users_is_admin_id (is_admin, id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS news (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    summary VARCHAR(255) NULL DEFAULT NULL,
    content LONGTEXT NOT NULL,
    category VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    author VARCHAR(255) NULL DEFAULT NULL,
    author_image VARCHAR(255) NULL DEFAULT NULL,
    author_institution VARCHAR(255) NULL DEFAULT NULL,
    author_position VARCHAR(255) NULL DEFAULT NULL,
    image VARCHAR(255) NULL DEFAULT NULL,
    views INT UNSIGNED NOT NULL DEFAULT 0,
    tags JSON NULL,
    published TINYINT(1) NOT NULL DEFAULT 1,
    expires_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY news_slug_unique (slug),
    KEY news_published_date_index (published, date),
    KEY idx_news_published_expires_date (published, expires_at, date),
    KEY news_category_index (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS project_submissions (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    tracking_id VARCHAR(36) NOT NULL,
    status ENUM('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
    title VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    thumbnail VARCHAR(255) NULL DEFAULT NULL,
    tech_stack JSON NULL,
    live_demo VARCHAR(255) NULL DEFAULT NULL,
    github_link VARCHAR(255) NULL DEFAULT NULL,
    download_link VARCHAR(255) NULL DEFAULT NULL,
    figma_link VARCHAR(255) NULL DEFAULT NULL,
    screenshots JSON NULL,
    creator_name VARCHAR(255) NOT NULL,
    creator_type VARCHAR(255) NOT NULL DEFAULT 'mahasiswa',
    creator_nim VARCHAR(50) NULL DEFAULT NULL,
    creator_nidn VARCHAR(50) NULL DEFAULT NULL,
    creator_jabatan VARCHAR(255) NULL DEFAULT NULL,
    creator_major VARCHAR(255) NULL DEFAULT NULL,
    creator_year INT NULL DEFAULT NULL,
    creator_avatar VARCHAR(255) NULL DEFAULT NULL,
    collaborators JSON NULL,
    rejection_reason TEXT NULL DEFAULT NULL,
    reviewed_by VARCHAR(255) NULL DEFAULT NULL,
    reviewed_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY project_submissions_tracking_id_unique (tracking_id),
    KEY project_submissions_status_index (status),
    KEY project_submissions_category_index (category),
    KEY idx_projects_status_category_created (status, category, created_at),
    KEY idx_projects_deleted_status_created (deleted_at, status, created_at),
    KEY idx_projects_tracking_status (tracking_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    tracking_id VARCHAR(255) NULL DEFAULT NULL,
    project_id BIGINT UNSIGNED NULL DEFAULT NULL,
    type VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    `read` TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    KEY notifications_tracking_id_index (tracking_id),
    KEY idx_notifications_tracking_created (tracking_id, created_at),
    KEY idx_notifications_project_created (project_id, created_at),
    KEY idx_notifications_read_created (`read`, created_at),
    KEY idx_notifications_type_created (type, created_at),
    CONSTRAINT notifications_project_id_foreign
        FOREIGN KEY (project_id) REFERENCES project_submissions(id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(255) NULL DEFAULT NULL,
    entity_id BIGINT UNSIGNED NULL DEFAULT NULL,
    details JSON NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    KEY audit_logs_entity_type_entity_id_index (entity_type, entity_id),
    KEY audit_logs_created_at_index (created_at),
    KEY idx_audit_logs_action_created (action, created_at),
    KEY idx_audit_logs_user_created (user_id, created_at),
    KEY idx_audit_logs_entity_created (entity_type, entity_id, created_at),
    CONSTRAINT audit_logs_user_id_foreign
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS login_attempts (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    success TINYINT(1) NOT NULL,
    reason VARCHAR(255) NOT NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    KEY login_attempts_email_created_at_index (email, created_at),
    KEY login_attempts_ip_address_index (ip_address),
    KEY idx_login_attempts_success_created (success, created_at),
    KEY idx_login_attempts_reason_created (reason, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS chat_logs (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    session_id VARCHAR(64) NOT NULL,
    user_message VARCHAR(200) NOT NULL,
    response TEXT NOT NULL,
    status VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    KEY chat_logs_session_id_index (session_id),
    KEY chat_logs_created_at_index (created_at),
    KEY chat_logs_status_index (status),
    KEY idx_chat_logs_status_created (status, created_at),
    KEY idx_chat_logs_ip_created (ip_address, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS llm_providers (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    base_url VARCHAR(255) NOT NULL,
    api_key TEXT NOT NULL,
    model_id VARCHAR(255) NOT NULL,
    prefix TEXT NULL,
    api_type VARCHAR(255) NULL DEFAULT 'chat',
    priority INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    provider_type VARCHAR(255) NOT NULL DEFAULT 'openai',
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    KEY idx_llm_providers_active_priority (is_active, priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS interactions (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    item_type VARCHAR(255) NOT NULL,
    item_id VARCHAR(255) NOT NULL,
    views INT UNSIGNED NOT NULL DEFAULT 0,
    likes INT UNSIGNED NOT NULL DEFAULT 0,
    saves INT UNSIGNED NOT NULL DEFAULT 0,
    shares INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY interactions_item_type_item_id_unique (item_type, item_id),
    KEY interactions_item_type_index (item_type),
    KEY interactions_item_id_index (item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS engagement_interactions (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    visitor_id VARCHAR(64) NOT NULL,
    interactable_type VARCHAR(255) NOT NULL,
    interactable_id BIGINT UNSIGNED NOT NULL,
    type ENUM('love', 'save', 'seen') NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY unique_interaction (visitor_id, interactable_type, interactable_id, type),
    KEY engagement_interactions_interactable_type_interactable_id_index (interactable_type, interactable_id),
    KEY engagement_interactions_visitor_id_index (visitor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS upload_quotas (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    ip_address VARCHAR(45) NULL DEFAULT NULL,
    user_id BIGINT UNSIGNED NULL DEFAULT NULL,
    `date` DATE NOT NULL,
    bytes_used BIGINT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY upload_quotas_ip_address_date_unique (ip_address, `date`),
    KEY upload_quotas_user_id_index (user_id),
    KEY idx_upload_quotas_date_bytes (date, bytes_used)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
