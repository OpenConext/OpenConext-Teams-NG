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
import teams.repository.PersonRepository;
import teams.shibboleth.ShibbolethPreAuthenticatedProcessingFilter;
import teams.shibboleth.ShibbolethUserDetailService;
import teams.shibboleth.mock.MockShibbolethFilter;

import java.util.List;

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

    @Configuration
    public static class SecurityConfigurationAdapter extends WebSecurityConfigurerAdapter {

        @Autowired
        private PersonRepository personRepository;

        @Autowired
        private Environment environment;

        @Value("${teams.non-guest-member-of}")
        private String nonGuestsMemberOf;

        @Override
        protected void configure(AuthenticationManagerBuilder auth) throws Exception {
            PreAuthenticatedAuthenticationProvider authenticationProvider = new PreAuthenticatedAuthenticationProvider();
            authenticationProvider.setPreAuthenticatedUserDetailsService(new ShibbolethUserDetailService());
            auth.authenticationProvider(authenticationProvider);
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
                http.addFilterBefore(new MockShibbolethFilter(), ShibbolethPreAuthenticatedProcessingFilter.class);
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
