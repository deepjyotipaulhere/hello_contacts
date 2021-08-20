import { configureStore, createSlice } from '@reduxjs/toolkit'

const contactReducer = createSlice({
    name: "ContactStore",
    initialState: {
        contacts: []
    },
    reducers: {
        addContact(state, action) {
            // Action to add an array of contacts supplied through "action.payload"
            // in the form of [{...},{...}]
            state.contacts = state.contacts.concat(action.payload)
            console.log(state.contacts);
        },
        updateContact(state, action) {
            // Action to update a contact at the position "action.payload.index" in the
            // state "contacts" array with the value supplied in "action.payload.contact"
            state.contacts[action.payload.index] = action.payload.contact
        }
    }
})

const store = configureStore({
    reducer: { contactReducer: contactReducer.reducer }
})

export const contactActions = contactReducer.actions;
export default store;
