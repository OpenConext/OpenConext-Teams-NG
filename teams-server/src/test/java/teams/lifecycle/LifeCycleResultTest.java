package teams.lifecycle;

import org.junit.Test;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import static org.junit.Assert.assertEquals;

public class LifeCycleResultTest {

    @Test
    public void equalsOther() {
        LifeCycleResult result = lifeCycleResult();

        LifeCycleResult other = lifeCycleResult();

        assertEquals(result, other);

        Set<LifeCycleResult> set = new HashSet<>();
        set.add(result);
        set.add(other);
        assertEquals(1, set.size());
    }

    private LifeCycleResult lifeCycleResult() {
        LifeCycleResult result = new LifeCycleResult();
        result.setData(Arrays.asList(new Attribute("name", "value")));
        return result;
    }

}