package db.migration;

import org.flywaydb.core.api.migration.spring.SpringJdbcMigration;
import org.springframework.jdbc.core.JdbcTemplate;
import teams.api.validations.HashGenerator;

public class V22__add_public_link_to_existing_teams implements SpringJdbcMigration, HashGenerator {

    @Override
    public void migrate(JdbcTemplate jdbcTemplate) throws Exception {
        jdbcTemplate.query("SELECT id AS id FROM teams WHERE public_link IS NULL OR public_link = ''", rs -> {
            long id = rs.getLong("id");
            jdbcTemplate.update("UPDATE teams SET public_link = ? WHERE id = ?",
                    generateHash(32, "UTF-8"), id);
        });
    }
}
