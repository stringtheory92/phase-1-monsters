document.addEventListener('DOMContentLoaded', renderPage)

const dbUrl = 'http://localhost:3000/monsters'
let dbData = []
let minId = 0;
let maxId = 49;
//let firstFiftyMonsters = []

// Elements
const createMonsterDiv = document.querySelector('#create-monster')
const monsterContainer = document.querySelector('#monster-container')
const backBtn = document.querySelector('#back')
const forwardBtn = document.querySelector('#forward')

function renderPage() {
    getData(`${dbUrl}`).then(data => {
        dbData = data;
        dbData.forEach(monster => {
            if (monster.id <= 49) displayMonster(monster);
        })
        createMonsterForm()
        pageButtonListeners()
    })
}

function displayMonster(monster) {
    const name = document.createElement('h2')
    const age = document.createElement('h4')
    const bio = document.createElement('p')

    name.textContent = monster.name
    age.textContent = `Age: ${monster.age}`
    bio.textContent = `Bio: ${monster.description}`

    monsterContainer.append(name, age, bio)
}

function createMonsterForm() {
    const monsterForm = document.createElement('form')
    const nameInput = document.createElement('input')
    const ageInput = document.createElement('input')
    const bioInput = document.createElement('input')
    const createBtn = document.createElement('button')
    createBtn.type = 'submit'
    nameInput.placeholder = 'name...'
    ageInput.placeholder = 'age...'
    bioInput.placeholder = 'description...'
    createBtn.textContent = 'Create'

    monsterForm.append(nameInput, ageInput, bioInput, createBtn)
    createMonsterDiv.append(monsterForm)
    console.log(monsterContainer)
    monsterForm.addEventListener('submit', (e) => {
        console.log('click')
        formSubmit(e, nameInput.value, ageInput.value, bioInput.value)
    })
}

function formSubmit(e, name, age, bio) {
    e.preventDefault()
    
    const newMonster = {
        name: name,
        age: age,
        description: bio
    }
    postData(dbUrl, newMonster).then(data => {
        displayMonster(newMonster)
        console.log('post data: ', data)
    })
    getData(dbUrl).then(data => dbData = data)
}

function pageButtonListeners() {
    forwardBtn.addEventListener('click', forwardHandler)
    backBtn.addEventListener('click', backHandler)
}

function forwardHandler() {
    minId += 50;
    maxId += 50;

    console.log(minId, maxId)
    if (maxId > dbData.length) alert('its the last page')
    else {
        monsterContainer.innerHTML = '';
        dbData.forEach(monster => {
            if (monster.id >= minId && monster.id <= maxId) {
                displayMonster(monster)
                console.log('id: ', monster.id, 'monster: ', monster)
            }
        })
    }
}

function backHandler() {
    minId -= 50;
    maxId -= 50;

    if (minId < 0) alert('its the first page')
    else {
        monsterContainer.innerHTML = '';
        dbData.forEach(monster => {
            if (monster.id >= minId && monster.id <= maxId)
                displayMonster(monster)
        })
    }
    console.log(minId, maxId)
}

function getData(url) {
    return fetch(url).then(res => res.json())
}

function postData(url, body) {
    const configOb = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify(body)
    }

    return fetch(url, configOb).then(res => res.json())
}