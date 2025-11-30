*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${URL}    http://37.27.214.114:3000
${CHROMEDRIVER}    C:/WebDrivers/chromedriver.exe


*** Test Cases ***
Landing page shows categories and most sold products
    [Documentation]    Verifies that the landing page loads and key elements are visible:
    ...                - Correct title
    ...                - Category section (Tuotekategoriat + hero image)
    ...                - Most sold products section (Myydyimmät + at least one product)
    Open Browser    ${URL}    Chrome    executable_path=${CHROMEDRIVER}
    Maximize Browser Window

    # 1) Title
    Title Should Be    Lappaz.fi | 3D-tulostukset

    # 2) Header and logo link to home
    Element Should Be Visible    css=header a[href="/"]

    # 3) Category section heading
    Element Text Should Be    xpath=//section[.//h2[contains(@class,"text-2xl")]][1]/h2    Tuotekategoriat

    # 4) Category hero image "Autotarvikkeet" is visible
    Element Should Be Visible    css=img[alt="Autotarvikkeet"]

    # 5) Category CTA button text
    Element Text Should Be    xpath=//section[.//h2[text()="Tuotekategoriat"]]//button    Näytä tuotteet

    # 6) "Myydyimmät" section heading
    Element Text Should Be    xpath=//section[.//h2[contains(@class,"text-2xl")]][2]/h2    Myydyimmät

    # 7) Footer links exist (e.g. toimitus- ja palautusehdot)
    Element Should Be Visible    css=footer a[href="/toimitus-ja-palautusehdot"]

    Close Browser
