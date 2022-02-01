package db.migration;

import org.flywaydb.core.api.migration.BaseJavaMigration;
import org.flywaydb.core.api.migration.Context;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.SingleConnectionDataSource;
import teams.api.validations.HashGenerator;

public class V22__add_public_link_to_existing_teams extends BaseJavaMigration implements HashGenerator {

    public void migrate(Context context) {
        JdbcTemplate jdbcTemplate =
                new JdbcTemplate(new SingleConnectionDataSource(context.getConnection(), true));

        jdbcTemplate.query("SELECT id AS id FROM teams WHERE public_link IS NULL OR public_link = ''", rs -> {
            long id = rs.getLong("id");
            jdbcTemplate.update("UPDATE teams SET public_link = ? WHERE id = ?",
                    generateHash(32, "UTF-8"), id);
        });
    }
}
