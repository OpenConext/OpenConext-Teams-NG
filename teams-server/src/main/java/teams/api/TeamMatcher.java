package teams.api;

import java.util.stream.IntStream;

public class TeamMatcher {

    /**
     * MariaDB version on centOS7 does not support FULLTEXT matcher functionality for InnoDB and this
     * is the poor man's solution
     */
    public int compare(String name1, String name2, String query) {
        boolean name1StartsWith = name1.startsWith(query);
        boolean name2StartsWith = name2.startsWith(query);
        if (name1StartsWith || name2StartsWith) {
            return (name1StartsWith && name2StartsWith) ? 0 : (name1StartsWith ? -1 : 1);
        }
        int n1  = compareStartWithParts(name1.split("[-_ ]"), query);
        int n2  = compareStartWithParts(name2.split(" "), query);
        if (n1 == -1 && n2 == -1) {
            return Integer.compare(name1.indexOf(query), name2.indexOf(query));
        }
        if (n1 > -1 && n2 > -1) {
            return Integer.compare(n1, n2);
        }
        return n1 == -1 ? 1 : -1;
    }

    private int compareStartWithParts(String[] parts, String query) {
        return IntStream.range(0, parts.length).filter(i -> parts[i].startsWith(query)).findFirst().orElse(-1);
    }

}
