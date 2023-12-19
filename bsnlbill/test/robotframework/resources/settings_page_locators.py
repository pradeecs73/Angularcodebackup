setup_write_password = "css:input#checkProtection"
popup_header =  "css:app-form-dialog .header-text"
password_validations_success = "xpath:(//*[starts-with(@class,'tick-size')])[${index}]//*[contains(@class,'tick-success')]"
password_validations_error = "xpath:(//*[starts-with(@class,'tick-size')])[${index}]//*[contains(@class,'tick-default')]"
old_password = "css:input#oldPassword"
setup_password = "css:input#password"
confirm_password = "css:input#confirmPassword"
project_list_table = "css:.recently-used-project table"
protected_project = project_list_table + " tr:has(td[title='${project_name}']:nth-child(2)) td"
btn_setupPassword = "css:#setuppassword"
btn_cancel = "css:#cancel"
input_field_write_password = "css:input#writepassoword"
input_field_read_password = "css:input#readPassword"
btn_setup_disabled = "css:.passwordSetupBtn.disable_passwordSetupBtn"
checkbox_show_password = "css:input#showPassword"
save_project = "css:.saveicon .fas.fa-save.enable-save"
btn_change_write_password = "css:.col-4.writePasswordBtn.pb-5 .btn"
btn_setup_read_password = "css:.col-8.readPasswordBtn .btn"
errorSpan = "css:.errorSpan"