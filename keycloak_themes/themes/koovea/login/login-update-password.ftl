<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=!messagesPerField.existsError('password','password-confirm'); section>
    <#if section = "header">
        ${msg("updatePasswordTitle")}
    <#elseif section = "form">
        <form id="kc-passwd-update-form" action="${url.loginAction}" method="post" class="w-full lg:w-2/3 flex flex-col gap-8 mt-8">
          <h1 class="font-bold text-3xl">Update your password</h1>
          <div class="flex flex-col gap-6">
            <div class="flex flex-col gap-2">
                <input
                    type="password"
                    placeholder="New password *"
                    class="px-4 rounded text-md h-[3rem] border-[1px] border-[#0000006b] focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                    id="password-new" 
                    name="password-new" 
                    autofocus 
                    autocomplete="new-password"
                    aria-invalid="<#if messagesPerField.existsError('password','password-confirm')>true</#if>"
                />
                <#if messagesPerField.existsError('password')>
                    <span id="input-error-password" class="text-red-600" aria-live="polite">
                        ${kcSanitize(messagesPerField.get('password'))?no_esc}
                    </span>
                </#if>
            </div>

            <div class="flex flex-col gap-2">
                <input
                    type="password"
                    placeholder="Confirm password *"
                    class="px-4 rounded text-md h-[3rem] border-[1px] border-[#0000006b] focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                    id="password-confirm" 
                    name="password-confirm"
                    autocomplete="new-password"
                    aria-invalid="<#if messagesPerField.existsError('password-confirm')>true</#if>"
                />
                <#if messagesPerField.existsError('password-confirm')>
                    <span id="input-error-password-confirm" class="text-red-600" aria-live="polite">
                        ${kcSanitize(messagesPerField.get('password-confirm'))?no_esc}
                    </span>
                </#if>
            </div>

            <input class="h-12 bg-[#030635] hover:bg-black transition duration-150 ease-in-out rounded-full w-full text-white text-center" type="submit" value="Update password" />
          </div>
        </form>
    </#if>
</@layout.registrationLayout>