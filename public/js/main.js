/* eslint-disable no-undef */
const langSwitch = document.querySelector('#lang_switch');

//obtener las cookies guardadas
const cookies = Object.fromEntries(document.cookie.split('; ').map(cookie => cookie.split('=')));

if(cookies['nodeapi-lang'] ? cookies['nodeapi-lang'] === 'en' : false) {
  langSwitch.checked = true;
}
langSwitch.addEventListener('click', () => {
  if(langSwitch.checked) {
    window.location = '/change-lang/en';
    return;
  }
  window.location = '/change-lang/es';
});