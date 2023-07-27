import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js'
import { getDatabase, ref, push, onValue, remove } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js'

const appSettings = {
    databaseURL: 'https://firstrealtime-dc7fb-default-rtdb.europe-west1.firebasedatabase.app/'
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppinglistInDB = ref(database, 'shoppingList')

const inputEl = document.getElementById("input-field")
const buttonEl = document.getElementById("add-button")
const shoppingListEl = document.querySelector('#shopping-list')

buttonEl.addEventListener("click", ()=> {
    let inputValue = inputEl.value
    clearInputField();
    // appendItemshoppingListEl(inputValue);
    push(shoppinglistInDB, inputValue)
})

// grabing/fetching our data from the database
onValue(shoppinglistInDB, (snapshot) => {
    // let shoppingArray = Object.values(snapshot.val())
    // let shoppingArray = Object.keys(snapshot.val())

    // use the snapshot.exist method() (which will return a boolean) to check if there's still items in the Database
    if (snapshot.exists()) {
        // in this shoppingArray, we want to grab the keys and values at the same time, so we use 'entries' which will put any input into separate arrays of key value pairs (this comes in handy incase the user wants to delete any of the inputs/items) 
        let shoppingArray = Object.entries(snapshot.val())

        // we use the clearOldItemsOnChange() function to remove old items from list each time we edit or delete an item in the database. do this before the loop
        clearOldItemsOnChange()

        // now loop through the shoppingArray
        for (let currentItem of shoppingArray) {
            
            // in the loop, call the appendItemshoppingListEl() function and parse in currentItem as an argument so we can render the data gotten from the database to the page even when the page refreshes
            appendItemshoppingListEl(currentItem)
        }
    } else {
        // when we try to delete the last item, this block runs after the deleting, telling us that we do not have anymore items
        shoppingListEl.innerHTML = 'No items left in the database!...'
    }
})

function clearInputField() {
    inputEl.value = ''
}

function clearOldItemsOnChange() {
    shoppingListEl.innerHTML = ''
}

// Let this function take in a parameter of itemValue so you can use the inputValue as an argument when you call it
function appendItemshoppingListEl(item) {
    // shoppingListEl.innerHTML += `<li>${item}</li>`

    // lets store the keys and values in separate variables...we make the keys(or ID) to be 0, and value to be 1 because we used object.entries in the shoppingArray and it returned a giant array conatining small arrays that each contains a key and a value
    // let ItemID = item[0]
    // let ItemValue = item[1]
    let [ItemID, ItemValue] = item

    // because we want to add an event listener to the each li, we cannot achieve that functionality with innerHTML, a better way to do it is to refactor our code and use the createElement() method below

    // create a new li element and name the variable newEl
    let newEl = document.createElement('li')
    // add a textContent(which is the itemValue variable) to the newEl
    newEl.textContent = ItemValue
    // append the (li)newEl to the (ul)shoppingListEl
    shoppingListEl.appendChild(newEl)

    // incase we want to delete an item from the database
    newEl.addEventListener('click', ()=> {
        console.log(ItemID)
        let itemToDelete = ref(database, `shoppingList/${ItemID}`)
        remove(itemToDelete);
    })
}