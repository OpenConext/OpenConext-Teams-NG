package teams.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.Environment;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.preauth.AbstractPreAuthenticatedProcessingFilter;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationProvider;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import teams.domain.Feature;
import teams.repository.PersonRepository;
import teams.shibboleth.ShibbolethPreAuthenticatedProcessingFilter;
import teams.shibboleth.ShibbolethUserDetailService;
import teams.shibboleth.mock.MockShibbolethFilter;
import teams.voot.VootClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
@Configuration
public class SecurityConfig {

    @Order(1)
    @Configuration
    public static class ApiSecurityConfigurationAdapter extends WebSecurityConfigurerAdapter {

        @Value("${security.user.name}")
        private String user;

        @Value("${security.user.password}")
        private String password;

        @Override
        protected void configure(AuthenticationManagerBuilder auth) throws Exception {
            auth.inMemoryAuthentication().withUser(user).password(password).authorities("ROLE_USER");
        }

        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http
                    .antMatcher("/api/voot/**")
                    .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                    .and()
                    .csrf().disable()
                    .addFilterBefore(new BasicAuthenticationFilter(authenticationManager()), BasicAuthenticationFilter.class)
                    .authorizeRequests()
                    .antMatchers("/**").hasRole("USER");
        }
    }

    @Order(2)
    @Configuration
    public static class LifeCycleSecurityConfigurationAdapter extends WebSecurityConfigurerAdapter {

        @Value("${api.lifecycle.username}")
        private String user;

        @Value("${api.lifecycle.password}")
        private String password;

        @Override
        protected void configure(AuthenticationManagerBuilder auth) throws Exception {
            auth.inMemoryAuthentication().withUser(user).password(password).authorities("ROLE_USER");
        }

        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http
                    .antMatcher("/deprovision/**")
                    .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                    .and()
                    .csrf().disable()
                    .addFilterBefore(new BasicAuthenticationFilter(authenticationManager()), BasicAuthenticationFilter.class)
                    .authorizeRequests()
                    .antMatchers("/**").hasRole("USER");
        }
    }

    @Configuration
    public static class SecurityConfigurationAdapter extends WebSecurityConfigurerAdapter {

        @Autowired
        private PersonRepository personRepository;

        @Autowired
        private VootClient vootClient;

        @Autowired
        private Environment environment;

        @Value("${teams.non-guest-member-of}")
        private String nonGuestsMemberOf;

        @Value("${teams.group-name-context}")
        private String groupNameContext;

        @Value("${teams.product-name}")
        private String productName;

        @Value("${feature-toggles.expiry-date-membership}")
        private boolean expiryDateMembership;

        @Value("${feature-toggles.person-email-picker}")
        private boolean personEmailPicker;

        @Value("${config.support-email}")
        private String supportEmail;

        @Value("${config.help-link-en}")
        private String helpLinkEn;

        @Value("${config.help-link-nl}")
        private String helpLinkNl;

        @Value("${config.main-link}")
        private String mainLink;

        @Value("${config.help-tos-en}")
        private String helpTosEn;

        @Value("${config.help-tos-nl}")
        private String helpTosNl;

        @Value("${config.organization}")
        private String organization;

        @Value("${config.sponsor}")
        private String sponsor;

        @Value("${config.supported_language_codes}")
        private String supportedLanguageCodes;

        @Override
        protected void configure(AuthenticationManagerBuilder auth) throws Exception {
            PreAuthenticatedAuthenticationProvider authenticationProvider = new PreAuthenticatedAuthenticationProvider();
            authenticationProvider.setPreAuthenticatedUserDetailsService(
                    new ShibbolethUserDetailService(
                            groupNameContext,
                            productName,
                            vootClient,
                            featureToggles(),
                            config()));
            auth.authenticationProvider(authenticationProvider);
        }

        private Map<String, String> config() {
            Map<String, String> config = new HashMap<>();
            config.put("supportEmail", supportEmail);
            config.put("helpLinkEn", helpLinkEn);
            config.put("helpLinkNl", helpLinkNl);
            config.put("helpTosEn", helpTosEn);
            config.put("helpTosNl", helpTosNl);
            config.put("mainLink", mainLink);
            config.put("organization", organization);
            config.put("sponsor", sponsor);
            config.put("supportedLanguageCodes", supportedLanguageCodes);
            return config;
        }

        private Map<Feature, Boolean> featureToggles() {
            Map<Feature, Boolean> toggles = new HashMap<>();
            toggles.put(Feature.EXPIRY_DATE_MEMBERSHIP, expiryDateMembership);
            toggles.put(Feature.PERSON_EMAIL_PICKER, personEmailPicker);
            return toggles;
        }

        @Override
        protected void configure(HttpSecurity http) throws Exception {
            ShibbolethPreAuthenticatedProcessingFilter filter =
                    new ShibbolethPreAuthenticatedProcessingFilter(authenticationManager(), personRepository, nonGuestsMemberOf);

            http
                    .antMatcher("/api/teams/**")
                    .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                    .and()
                    .csrf()
                    .requireCsrfProtectionMatcher(new CsrfProtectionMatcher()).and()
                    .addFilterAfter(new CsrfTokenResponseHeaderBindingFilter(), CsrfFilter.class)
                    .addFilterBefore(filter, AbstractPreAuthenticatedProcessingFilter.class)
                    .authorizeRequests()
                    .antMatchers("/**").hasRole("USER");

            if (environment.acceptsProfiles("dev")) {
                http.addFilterBefore(new MockShibbolethFilter(environment.acceptsProfiles("test")), ShibbolethPreAuthenticatedProcessingFilter.class);
                http.csrf().disable();
            }
        }
    }

    @Configuration
    public class MvcConfig extends WebMvcConfigurerAdapter {

        @Override
        public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
            argumentResolvers.add(new FederatedUserHandlerMethodArgumentResolver());
        }

        @Override
        public void addInterceptors(InterceptorRegistry registry) {
            super.addInterceptors(registry);
            registry.addInterceptor(new SessionAliveInterceptor());
        }

    }

}
