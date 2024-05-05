<#macro registrationLayout bodyClass="" displayInfo=false displayMessage=true displayRequiredFields=false>
    <!DOCTYPE html>
    <html class="bg-gray-900" <#if realm.internationalizationEnabled> lang="${locale.currentLanguageTag}"</#if>>

    <head>
        <meta charset="utf-8">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="robots" content="noindex, nofollow">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <#if properties.meta?has_content>
            <#list properties.meta?split(' ') as meta>
                <meta name="${meta?split('==')[0]}" content="${meta?split('==')[1]}"/>
            </#list>
            </#if>
            <title>
                ${msg("loginTitle",(realm.displayName!''))}
            </title>
            <link rel="icon" href="${url.resourcesPath}/img/favicon.ico" />
            <#if properties.stylesCommon?has_content>
                <#list properties.stylesCommon?split(' ') as style>
                    <link href="${url.resourcesCommonPath}/${style}" rel="stylesheet" />
                </#list>
            </#if>
            <#if properties.styles?has_content>
                <#list properties.styles?split(' ') as style>
                    <link href="${url.resourcesPath}/${style}" rel="stylesheet" />
                </#list>
            </#if>
            <#if properties.scripts?has_content>
                <#list properties.scripts?split(' ') as script>
                    <script src="${url.resourcesPath}/${script}" type="text/javascript"></script>
                </#list>
            </#if>
            <#if scripts??>
                <#list scripts as script>
                    <script src="${script}" type="text/javascript"></script>
                </#list>
            </#if>
        </head>
        <body>
            <main class="grid grid-cols-12 h-screen">
                <section class="col-span-6 hidden lg:flex items-center justify-center text-white bg-[#FFF]">
                    <svg class="h-60 w-60" viewBox="0 0 601 168" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M134.5 67.7C134.5 104.8 104.5 134.8 67.4 134.8C30.3 134.8 0.299988 104.8 0.299988 67.7C0.299988 30.6 30.3 0.600006 67.4 0.600006C104.4 0.600006 134.5 30.6 134.5 67.7Z" fill="#0E284C"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M117.7 66.1C116.9 67 114.9 68.7 109.7 68.7H72.3C72.3 68.7 69.4 68.6 67.5 71.5C66.3 73.1 63.5 77.2 63.5 77.2C62.9 78.1 60.8 81.1 55.2 81.1C54 81.1 45.2 81.1 35.8 81.1L44.8 68C44.8 68 46.1 65.6 50.7 65.6H105.8C108.6 65.6 111.1 64.9 113.1 62.3C114.8 60.1 120.4 52.3 122.3 49.7H129.8M95.4 53.6L97.8 50.2H6.00002C5.70002 51.3 5.40001 52.4 5.20001 53.6H95.4ZM32.1 80.8C34.4 77.8 42.1 66.5 42.8 65.6C44.6 63.3 46.7 62.8 48.6 62.8C49.3 62.8 99.9 62.8 103.5 62.8C108.5 62.8 109.5 61.2 110.1 60.5L118.5 49.5H111.4C110.3 51.2 107.6 55.2 106.6 56.6C104.2 60 100 59.7 100 59.7C100 59.7 46.6 59.7 34 59.7C26.4 59.7 22.9 64.6 22.9 64.6L11.8 80.8C11.9 80.8 23 80.8 32.1 80.8ZM45.2 55L40.6 58.3H59.2L62.7 55H45.2Z" fill="white"/>
                        <path d="M194 166.4H188.6V149.2H162.4V166.4H157V127.7H162.4V143.4H188.6V127.7H194M237.3 160.6H208.5V149.2H227.6V143.4H208.5V133.5H236V127.7H203V166.4H237.2M276.1 160.6H250.9V127.7H245.5V166.4H276.2M283.3 166.4H288.7V127.7H283.3V166.4ZM336.9 136.5C332.5 129.8 326.3 126.5 318.1 126.5C312.4 126.5 307.6 128.2 303.8 131.7C299.4 135.7 297.2 140.7 297.2 147C297.2 153.3 299.4 158.5 303.7 162.4C307.5 165.8 312.3 167.5 318.1 167.5C322.2 167.5 325.8 166.8 328.7 165.3C331.7 163.9 334.3 161.5 336.7 158.3L332.1 155.3C328.8 159.5 324.2 161.7 318.5 161.7C313.7 161.7 309.9 160.4 307.1 157.7C304.3 155 302.9 151.5 302.9 147.1C302.9 142.9 304.3 139.4 307.2 136.6C310 133.9 313.7 132.5 318.2 132.5C324.2 132.5 328.8 134.6 332.1 138.8L336.9 136.5ZM385.3 147C385.3 140.8 383.1 135.7 378.7 131.7C374.8 128.2 370.1 126.5 364.4 126.5C358.7 126.5 354 128.2 350 131.7C345.5 135.7 343.3 140.8 343.3 147C343.3 153.3 345.5 158.4 349.9 162.3C353.8 165.8 358.6 167.5 364.3 167.5C370 167.5 374.8 165.8 378.7 162.4C383.1 158.5 385.3 153.3 385.3 147ZM379.6 147C379.6 151.3 378.2 154.9 375.4 157.6C372.6 160.3 368.9 161.7 364.3 161.7C359.6 161.7 355.9 160.4 353.1 157.7C350.3 155 348.9 151.5 348.9 147.1C348.9 142.9 350.3 139.4 353.2 136.6C356.1 133.8 359.8 132.5 364.3 132.5C368.5 132.5 371.9 133.7 374.7 136.1C378 138.8 379.6 142.5 379.6 147ZM393.5 127.7V166.4H398.9V151.7H418.4C422.3 151.7 425.2 150.7 427.3 148.7C429.3 146.7 430.3 143.7 430.3 139.9C430.3 136.2 429.3 133.3 427.4 131.1C425.4 128.9 422.8 127.8 419.5 127.8M398.9 145.9V133.5H418.1C422.5 133.5 424.7 135.6 424.7 139.9C424.7 143.9 422.6 145.9 418.4 145.9H398.9ZM471.3 127.7H434.6V133.5H450.2V166.4H455.6V133.5H471.2M511.9 160.6H483.1V149.2H502.2V143.4H483V133.5H510.5V127.7H477.5V166.4H511.7M548.3 151.3C550.9 150.8 552.9 149.6 554.4 147.8C556 145.8 556.8 143.2 556.8 139.9C556.8 136.2 555.8 133.2 553.9 131C551.9 128.8 549.3 127.7 545.8 127.7H520V166.4H525.4V151.7H541.9L550.7 166.4H557M525.4 145.9V133.5H544.5C549 133.5 551.3 135.6 551.3 139.9C551.3 143.9 549.2 145.9 545 145.9H525.4ZM598.3 132.5C593.5 128.7 587.6 126.8 580.6 126.8C575.4 126.8 571.3 127.9 568.4 130C565.5 132.1 564.1 135 564.1 138.6C564.1 142.1 565.4 144.6 567.9 146.1C570.1 147.4 573.8 148.2 579.2 148.7C585.3 149.2 589 149.6 590.4 150C593 150.8 594.4 152.5 594.4 154.9C594.4 157 593.4 158.7 591.4 159.9C589.3 161.1 586.3 161.8 582.5 161.8C576.6 161.8 571.1 159.9 566 156.2L563 160.8C567.6 165.1 574.1 167.3 582.5 167.3C588.2 167.3 592.7 166.2 595.7 163.9C598.8 161.7 600.3 158.5 600.3 154.4C600.3 151.2 599.3 148.7 597.4 147C595.4 145.3 592.4 144.1 588.3 143.4C586.9 143.2 583.9 142.9 579.4 142.5C576.3 142.3 574.1 141.9 572.8 141.3C570.9 140.5 570 139.3 570 137.6C570 136 570.9 134.7 572.7 133.8C574.5 132.9 577 132.4 580.4 132.4C585.4 132.4 590.4 133.9 595.2 136.8M259 28.3H278.8V108H259M359.1 54.7C359.1 66 353.3 75.4 341 79.2C340.9 79.2 357.9 108.1 357.9 108.1H338.2L313.3 63.9H329.7C336.7 63.9 339.7 59.8 339.7 54.7C339.7 49.6 336.8 45.3 329.9 45.3H306.4V108.2H287.2V28.5H328.6C349.1 28.4 359.1 40.2 359.1 54.7ZM213.1 28.2L254.9 107.9H231L205.3 55.8L195 77.7H205.9L214.4 95.2H187L181 108H157.1L197.4 28.3L213.1 28.2ZM571.1 59.1C591.2 63.5 599.5 72.7 599.5 84.6C599.5 98 589.7 109.6 565.6 109.6C551.1 109.6 539 105.3 527.3 99.8L533.2 84C543 88.2 553.4 91.8 564.1 91.8C572.4 91.8 578.6 90 578.6 85.3C578.6 80.5 574.4 78.6 559.1 75.3C539.3 71.1 529.3 65 529.3 51.1C529.3 37.2 541.5 25.8 560.9 25.8C575.7 25.8 586.9 29.5 596.3 33.4L590 49.6C583.8 45.9 573.4 42.2 564.7 42.2C555.5 42.2 549.7 44.5 549.7 49C549.6 54.1 555 55.6 571.1 59.1ZM521.2 28.1V73C521.2 101.7 504.3 110 483.5 110C462.7 110 445.8 101.6 445.8 73V28.1H465.7V72.9C465.7 86.6 473.6 92.3 483.5 92.3C493.3 92.3 501.3 86.5 501.3 72.9V28.1H521.2ZM429.4 67C434.9 70 439.9 76.2 439.9 84.6C439.9 97.5 428.6 108 414.9 108H366.4V28.3H413.1C426 28.3 436.5 38.3 436.5 50.8C436.5 57.4 434.6 63.4 429.4 67ZM385.6 58.6H412.9C416.7 58.6 420 55.6 420 51.8C420 48 416.8 45.1 413 45.1H385.5V58.6H385.6ZM413.6 91.1C418.2 91.1 421.9 87.5 421.9 83.2C421.9 78.9 418.2 75.5 413.6 75.4H385.6V91.1H413.6Z" fill="#0E284C"/>
                    </svg>

                </section>
                 <section class="relative col-span-12 lg:col-span-6 flex items-center justify-center bg-white p-4">
                    <nav class="absolute top-0 left-0 right-0 p-4 bg-[#FFF] flex items-center justify-start lg:justify-end">
                        <svg class="h-5" viewBox="0 0 135 135" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M134.5 67.7C134.5 104.8 104.5 134.8 67.4 134.8C30.3 134.8 0.299988 104.8 0.299988 67.7C0.299988 30.6 30.3 0.600006 67.4 0.600006C104.4 0.600006 134.5 30.6 134.5 67.7Z" fill="#0E284C"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M117.7 66.1C116.9 67 114.9 68.7 109.7 68.7H72.3C72.3 68.7 69.4 68.6 67.5 71.5C66.3 73.1 63.5 77.2 63.5 77.2C62.9 78.1 60.8 81.1 55.2 81.1C54 81.1 45.2 81.1 35.8 81.1L44.8 68C44.8 68 46.1 65.6 50.7 65.6H105.8C108.6 65.6 111.1 64.9 113.1 62.3C114.8 60.1 120.4 52.3 122.3 49.7H129.8M95.4 53.6L97.8 50.2H6.00002C5.70002 51.3 5.40001 52.4 5.20001 53.6H95.4ZM32.1 80.8C34.4 77.8 42.1 66.5 42.8 65.6C44.6 63.3 46.7 62.8 48.6 62.8C49.3 62.8 99.9 62.8 103.5 62.8C108.5 62.8 109.5 61.2 110.1 60.5L118.5 49.5H111.4C110.3 51.2 107.6 55.2 106.6 56.6C104.2 60 100 59.7 100 59.7C100 59.7 46.6 59.7 34 59.7C26.4 59.7 22.9 64.6 22.9 64.6L11.8 80.8C11.9 80.8 23 80.8 32.1 80.8ZM45.2 55L40.6 58.3H59.2L62.7 55H45.2Z" fill="white"/>
                        </svg>
                    </nav>
                    <#nested "form">
                    <#nested "info">
                    <#nested "socialProviders">
                </section>     
            </main>
        </body>
    </html>
</#macro>