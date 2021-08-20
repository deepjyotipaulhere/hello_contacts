/* eslint-disable */

import React, { useEffect, useState } from 'react'
import { ScrollView, Text, StyleSheet, Image, PermissionsAndroid, Platform } from 'react-native'
import PhoneContacts from 'react-native-contacts'
import { Banner, Button, Divider, FAB, IconButton, List, Modal, TextInput, Title, useTheme } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useDispatch, useSelector } from 'react-redux'
import { contactActions } from '../store'

export default function Contacts({ onAddContact }) {
    const theme = useTheme()
    const styles = StyleSheet.create({
        fab: {
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 50,
            backgroundColor: theme.colors.primary,
            zIndex: 100
        },
    })
    const containerStyle = { backgroundColor: 'white', padding: 20 };

    const dispatch = useDispatch()
    const contacts = useSelector(store => store.contactReducer.contacts)

    const [bannerVisible, setBannerVisible] = useState(true)        // To show/hide import banner in the beginning
    const [editVisible, setEditVisible] = useState(false)           // To show/hide edit modal on each contact item "edit" icon click
    const [currentContact, setCurrentContact] = useState(null)      // To store the contact that is being edited

    const [editName, setEditName] = useState(null)                  // Edited name value
    const [editEmail, setEditEmail] = useState(null)                // Edited email value
    const [editMobile, setEditMobile] = useState(null)              // Edited mobile value

    // Method to fetch contacts from the phone contact list
    // Fetched contacts are stored in Redux store variable "contacts"
    const fetchContacts = () => {
        if (Platform.OS == 'android') {
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                {
                    'title': 'Contacts',
                    'message': 'This app would like to view your contacts.',
                    'buttonPositive': 'Accept'
                }
            ).then(Contacts.getAll).then(cont => {
                dispatch(contactActions.addContact(cont))
                setBannerVisible(false)
            })
        }
        else {
            PhoneContacts.getAll().then(cont => {
                dispatch(contactActions.addContact(cont))
                setBannerVisible(false)
            })
        }
    }

    // Method to temporarily hold the details of the contact being edited
    const editContact = (index) => {
        setCurrentContact(index)
        setEditName(contacts[index].givenName)
        setEditEmail(contacts[index].emailAddresses.length > 0 ? contacts[index].emailAddresses[0].email : '')
        setEditMobile(contacts[index].phoneNumbers.length > 0 ? contacts[index].phoneNumbers[0].number : '')
        setEditVisible(true)
    }

    // Method to save edited contact in the Redux store
    const saveContact = () => {
        dispatch(contactActions.updateContact({
            index: currentContact,
            contact: {
                ...contacts[currentContact],
                givenName: editName,
                phoneNumbers: [{
                    label: 'mobile',
                    number: editMobile
                }],
                emailAddresses: [{
                    label: 'work',
                    email: editEmail,
                }]
            }
        }))

        setEditEmail(null)
        setEditMobile(null)
        setEditName(null)
        setEditVisible(false)
    }


    return (
        <>
            {/* Floating button to add new contact */}
            <FAB
                style={styles.fab}
                small={false}
                icon="plus"
                onPress={onAddContact}
            />

            {/* Initial banner to ask for importing contacts */}
            <Banner visible={bannerVisible}
                icon={({ size }) => (
                    <Icon name="account-box" size={size} />
                )}
                actions={[
                    {
                        label: "Yes",
                        onPress: fetchContacts
                    },
                    {
                        label: "No",
                        onPress: () => setBannerVisible(false)
                    }
                ]}>Do you want to sync your contacts with the app?</Banner>
            {!bannerVisible && contacts.length == 0 && <Text style={{ textAlign: 'center' }}>Contact List is empty!</Text>}

            {/* List for showing contacts from the Redux store */}
            {
                !bannerVisible && contacts.length > 0 &&
                <ScrollView>
                    {contacts.map((contactItem, i) =>
                        <List.Item key={i}
                            title={contactItem.givenName + ' ' + contactItem.familyName}
                            description={contactItem.phoneNumbers[0].number}
                            left={props => <List.Icon {...props} icon="account" />}
                            right={props => <IconButton {...props} icon='pencil' style={{ backgroundColor: '#ddd' }} onPress={() => editContact(i)} />}
                        />)}
                </ScrollView>
            }

            {/* Modal to show editable details on clicking edit button on the right side of contact list */}
            {currentContact && <Modal visible={editVisible} contentContainerStyle={containerStyle} onDismiss={() => setEditVisible(false)}>
                <Title>Edit Contact</Title>
                <Divider />
                {contacts[currentContact].thumbnailPath ?
                    <Image source={{ uri: `data:image/jpeg;base64,${contacts[currentContact].thumbnailPath}` }} style={{ width: 100, height: 100, resizeMode: 'contain' }} resizeMode='contain' /> : <></>}
                <TextInput label="Name" value={editName} onChangeText={text => setEditName(text)} />
                <TextInput label="Email" value={editEmail} onChangeText={text => setEditEmail(text)} />
                <TextInput label="Mobile" value={editMobile} onChangeText={text => setEditMobile(text)} />
                <Button mode='contained' onPress={saveContact}>Save</Button>
            </Modal>}
        </>
    )
}
