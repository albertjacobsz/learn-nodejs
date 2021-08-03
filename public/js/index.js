import '@babel/polyfill'
import { displayMap } from './mapbox';
import { login, logout } from './login.js';
import { updateSettings } from './updateSettings.js'
import { bookTour } from './stripe.js'
import {showAlert} from './alerts'
const mapBox = document.getElementById('map')
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout')
const userForm = document.querySelector('.form-user-data')
const passwordForm = document.querySelector('.form-user-password')
const bookBtn = document.getElementById('book-tour')

if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations)
    displayMap(locations)
}
if (loginForm) {
    loginForm.addEventListener('submit', e => {
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    e.preventDefault();
    login(email, password)
});
}
if (logoutBtn) {
    logoutBtn.addEventListener('click', logout)
}
if (userForm) {
    userForm.addEventListener('submit', e => {
        e.preventDefault();
        const form = new formData()
        form.append('name', document.getElementById('name').value)
        form.append('email',document.getElementById('email').value)
        form.append('photo',document.getElementById('photo').files[0])
        updateSettings(form,'data')
    })
}
if (passwordForm) {
    passwordForm.addEventListener('submit',async e => {
        e.preventDefault();
        document.querySelector('.btn--save-password').textContent = 'Updating...'
        const passwordCurrent = document.getElementById('pasword-current').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        const password = document.getElementById('password').value;
        await updateSettings({ password, passwordConfirm, passwordCurrent }, 'password')
        document.querySelector('.btn--save-password').textContent = 'Save password'
        document.getElementById('pasword-current').value = ''
        document.getElementById('password-confirm').value=''
        document.getElementById('password').value=''
    })
}
if (bookBtn) {
    bookBtn.addEventListener('click', e => {
        e.target.textContent = 'Processing...'
        console.log(e.target.dataset.tourId)
        const  tourId  = e.target.dataset.tourId
        console.log(tourId)
        bookTour(tourId)
    })
}
const alertMessage = document.querySelector('body').dataset.alert
if (alert) showAlert('success',alertMessage)