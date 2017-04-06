package teams.voot;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class GroupTest {

    @Test(expected = IllegalArgumentException.class)
    public void testNoNullId() throws Exception {
        group(null);
    }

    @Test
    public void testEqualsHashCode() throws Exception {
        Group group = group("1");
        Group other = group("1");
        assertTrue(group.equals(other));
        assertTrue(group.equals(group));
        assertFalse(group.equals(""));
        assertEquals(group.hashCode(), other.hashCode());
    }

    private Group group(String id) {
        return new Group(id, "displayname", "description", "membership");
    }

}