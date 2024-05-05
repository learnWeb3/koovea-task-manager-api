<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=true displayMessage=!messagesPerField.existsError('username'); section>
    <#if section = "header">
        ${msg("emailForgotTitle")}
    <#elseif section = "form">
        <form id="kc-reset-password-form" action="${url.loginAction}" method="post" class="w-full lg:w-2/3 flex flex-col gap-8 mt-8">
            <h1 class="font-bold text-3xl">Forgot your password ?</h1>
            <div class="flex flex-col gap-6">
                <div class="flex flex-col gap-2">
                    <input
                        type="email"
                        placeholder="Email *"
                        class="px-4 rounded text-md h-[3rem] border-[1px] border-[#0000006b] focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                        id="username" 
                        name="username" 
                        class="${properties.kcInputClass!}" 
                        autofocus 
                        value="${(auth.attemptedUsername!'')}" 
                        aria-invalid="<#if messagesPerField.existsError('username')>true</#if>"
                    />
                    <#if messagesPerField.existsError('username')>
                        <span id="input-error-username" class="text-red-600" aria-live="polite">
                            ${kcSanitize(messagesPerField.get('username'))?no_esc}
                        </span>
                    </#if>
                </div>

                <input class="cursor-pointer h-12 bg-[#030635] hover:bg-black transition duration-150 ease-in-out rounded-full w-full text-white text-center" type="submit" value="Reset password" />
                
                <div class="flex items-center justify-center gap-4">
                    <a href="${url.loginUrl}" class="text-sm font-light underline text-center">
                        Login
                    </a>
                </div>
            </div>
        </form>
    </#if>
</@layout.registrationLayout>
