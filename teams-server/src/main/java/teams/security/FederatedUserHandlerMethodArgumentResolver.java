/*
 * Copyright 2016 Vincenzo De Notaris
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License. 
 */

package teams.security;

import org.springframework.core.MethodParameter;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;
import teams.domain.FederatedUser;

public class FederatedUserHandlerMethodArgumentResolver implements
    HandlerMethodArgumentResolver {

    public boolean supportsParameter(MethodParameter methodParameter) {
        return methodParameter.getParameterType().equals(FederatedUser.class);
    }

    public FederatedUser resolveArgument(MethodParameter methodParameter,
                                         ModelAndViewContainer mavContainer, NativeWebRequest webRequest,
                                         WebDataBinderFactory binderFactory) throws Exception {
        return FederatedUser.class.cast(PreAuthenticatedAuthenticationToken.class.cast(webRequest.getUserPrincipal())
            .getPrincipal());
    }
}