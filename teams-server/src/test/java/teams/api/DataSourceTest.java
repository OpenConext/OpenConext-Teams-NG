package teams.api;

import com.zaxxer.hikari.HikariDataSource;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import teams.AbstractApplicationTest;

import javax.sql.DataSource;

import static org.junit.Assert.assertEquals;

public class DataSourceTest extends AbstractApplicationTest {

    @Autowired
    private DataSource dataSource;

    @Test
    public void dataBasePool() {
        HikariDataSource hikariDataSource = (HikariDataSource) this.dataSource;
        assertEquals("SELECT 1", hikariDataSource.getConnectionTestQuery());
        assertEquals(2000L, hikariDataSource.getLeakDetectionThreshold());
    }
}
