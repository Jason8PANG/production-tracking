-- 初始化数据库脚本
CREATE DATABASE IF NOT EXISTS wiptrack CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE wiptrack;

-- 生产记录表
CREATE TABLE IF NOT EXISTS production_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    SiteRef VARCHAR(50) NOT NULL COMMENT '公司别',
    Station VARCHAR(100) NOT NULL COMMENT '站别',
    Job VARCHAR(100) NOT NULL COMMENT '工单号',
    CompleteDate DATETIME NOT NULL COMMENT '完工日期',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_site_station (SiteRef, Station),
    INDEX idx_job (Job),
    INDEX idx_complete_date (CompleteDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
