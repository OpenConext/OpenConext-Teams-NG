package db.migration;

import org.flywaydb.core.api.migration.spring.SpringJdbcMigration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowCallbackHandler;
import teams.api.validations.HashGenerator;

import java.sql.ResultSet;
import java.sql.SQLException;

public class V22__add_public_link_to_existing_teams implements SpringJdbcMigration, HashGenerator {

    @Override
    public void migrate(JdbcTemplate jdbcTemplate) throws Exception {
        jdbcTemplate.query("SELECT id as id FROM teams WHERE public_link IS NULL OR public_link = ''", new RowCallbackHandler() {
            @Override
            public void processRow(ResultSet rs) throws SQLException {
                long id = rs.getLong("id");
                jdbcTemplate.update("UPDATE teams SET public_link = ? WHERE id = ?",
                        generateHash(32, "UTF-8"), id);
            }
        });
    }
}
