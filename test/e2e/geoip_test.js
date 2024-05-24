Feature('geoip');

Scenario('test something',  ({ I }) => {
    // first adapter
    I.amOnPage("/countryName/104.40.147.217");
    I.see("Netherlands");
    // second adapter
    I.amOnPage("/countryName/52.46.64.223");
    I.see("France");
    I.amOnPage("/countryName/52.46.64.224");
    I.see("France");
    // Rate limit exceeds
    I.amOnPage("/countryName/52.46.64.225");
    I.see("Rate limit exceeded");
    // wait 2 seconds let second adapter become available
    I.wait(2);
    // second adapter
    I.amOnPage("/countryName/52.46.64.225");
    I.see("France");
    I.amOnPage("/countryName/52.46.64.226");
    I.see("France");
    // Rate limit exceeds
    I.amOnPage("/countryName/52.46.64.227");
    I.see("Rate limit exceeded");

});
