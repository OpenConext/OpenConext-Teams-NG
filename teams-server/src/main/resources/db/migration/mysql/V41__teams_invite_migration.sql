ALTER TABLE `persons`
    add `schac_home_organization` varchar(255) DEFAULT NULL;

CREATE TABLE `applications`
(
    `id`           bigint       NOT NULL AUTO_INCREMENT,
    `manage_id`    varchar(255) NOT NULL,
    `manage_type`  varchar(255) NOT NULL,
    `landing_page` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `applications_unique` (`manage_id`, `manage_type`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `teams_applications`
(
    `id`             bigint    NOT NULL AUTO_INCREMENT,
    `team_id`        mediumint NOT NULL,
    `application_id` bigint    NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `teams_applications_unique` (`team_id`, `application_id`),
    CONSTRAINT `fk_teams_applications_` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_teams_applications_application` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = utf8mb4;


