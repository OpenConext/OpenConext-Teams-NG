package teams.api;

import org.junit.Test;

import static org.junit.Assert.*;

public class TeamMatcherTest {

    private int BEFORE = -1, EQUALS = 0, AFTER = 1;
    private TeamMatcher subject = new TeamMatcher();

    @Test
    public void compare() throws Exception {
        assertCompare(BEFORE, "test", "nope");
        assertCompare(BEFORE, "test", "1 test");
        assertCompare(BEFORE, "1 test", "laterTest");
        assertCompare(BEFORE, "1 test", "1 2 Test");
        assertCompare(BEFORE, "positionTest", "laterPositionTest");

        assertCompare(AFTER, "nope", "test");
        assertCompare(AFTER, "1 test", "test");
        assertCompare(AFTER, "laterTest", "1 test");
        assertCompare(AFTER,  "laterPositionTest", "positionTest");
        assertCompare(AFTER, "1 2 test", "1 Test");

        assertCompare(EQUALS, "1 test", "1 test");
        assertCompare(EQUALS, "test", "test");
        assertCompare(EQUALS, "nope", "nope");
        assertCompare(EQUALS, "positionTest", "positionTest");
    }

    private void assertCompare(int expected, String name1, String name2) {
        assertEquals(expected, subject.compare(name1.toLowerCase(), name2.toLowerCase(), "test"));
    }

}