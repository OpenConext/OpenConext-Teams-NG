package teams;

import teams.domain.FederatedUser;

import java.util.HashMap;
import java.util.Map;

public interface FeatureToggles {

    String EXPIRY_DATE_MEMBERSHIP = "expiryDateMembership";

    default Map<String, Boolean> featureToggles(Boolean expiryDateMembership) {
        Map<String, Boolean> featureToggles = new HashMap<>();
        featureToggles.put(EXPIRY_DATE_MEMBERSHIP, expiryDateMembership);
        return featureToggles;
    }

    default boolean isFeatureEnabled(FederatedUser user, String feature) {
        return user.getFeatureToggles().getOrDefault(feature, Boolean.FALSE);
    }

}
