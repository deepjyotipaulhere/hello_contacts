/* eslint-disable */

import React, { useRef, useState } from 'react'
import { Button, Card, Divider, List, Modal, Snackbar, TextInput } from 'react-native-paper'
import { Image } from 'react-native'
import { useDispatch } from 'react-redux'
import { contactActions } from '../store'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

export default function ContactForm({ onGoHome }) {
    const containerStyle = { backgroundColor: 'white', padding: 20 };

    const dispatch = useDispatch()

    // Refs for the inputs
    const nameRef = useRef(null)
    const emailRef = useRef(null)
    const phoneRef = useRef(null)

    // Internal state variables for setting values
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [userPhoto, setUserPhoto] = useState(null)

    // Internal state variables for controlling modals
    const [visible, setVisible] = useState(false)
    const [cameraModal, setCameraModal] = useState(false)

    // Method to save contact in the Redux store
    const saveContact = () => {
        dispatch(contactActions.addContact([{
            givenName: name,
            familyName: '',
            phoneNumbers: [{
                label: 'mobile',
                number: phone
            }],
            emailAddresses: [{
                label: 'work',
                email: email,
            }],
            thumbnailPath: userPhoto.assets[0].base64
        }]))
        setVisible(true)
        setName('')
        setEmail('')
        setPhone('')
        nameRef.current.clear()
        emailRef.current.clear()
        phoneRef.current.clear()
        setTimeout(() => {
            setVisible(false)
        }, 3000);
    }

    // Method to open photo choice modal
    const openCaptureMenu = () => {
        setCameraModal(true)
    }

    // Method to capture photo from gallery or camera,
    //parameter mode is 'g' for gallery and 'c' for camera
    const capturePhoto = (mode) => {
        if (mode == 'g') {
            launchImageLibrary({
                mediaType: 'photo',
                includeBase64: true,
                quality: 0.3
            }, p => {
                console.log(p.assets[0].uri);
                setUserPhoto(p)
                setCameraModal(false)
                console.log(userPhoto);
            })
        }
        else {
            photo = launchCamera({
                mediaType: 'photo',
                includeBase64: true,
                quality: 0.3
            }, p => {
                console.log(p.assets[0].uri);
                setUserPhoto(p)
                setCameraModal(false)
            })
        }
    }

    return (
        <>
            {/* Card for taking contact inputs */}
            <Card>
                <Card.Title title="Enter contact details" />
                <Divider />
                <Card.Content>
                    <TextInput ref={nameRef} label="Name" mode='outlined' onChangeText={text => setName(text)} />
                    <TextInput ref={emailRef} label="Email" mode='outlined' onChangeText={text => setEmail(text)} />
                    <TextInput ref={phoneRef} label="Phone Number" mode='outlined' onChangeText={text => setPhone(text)} keyboardType='number-pad' />
                    {
                        userPhoto ? <>
                            <Image source={{uri:`data:image/jpeg;base64,${userPhoto.assets[0].base64}`}} style={{ width: 100, height: 100, resizeMode:'contain' }} resizeMode='contain' />
                            <Button onPress={openCaptureMenu}>Add Photo</Button>
                        </> :
                            <Button onPress={openCaptureMenu}>Add Photo</Button>
                    }
                </Card.Content>
                <Card.Actions>
                    <Button disabled={!name || !email || !phone} onPress={saveContact}>Save</Button>
                </Card.Actions>
            </Card>

            {/* Modal for choices of image source, photo gallery or camera */}
            <Modal visible={cameraModal} contentContainerStyle={containerStyle} onDismiss={() => setCameraModal(false)}>
                <List.Item title="From Gallery" onPress={() => capturePhoto('g')} />
                <Divider />
                <List.Item title="Open Camera" onPress={() => capturePhoto('c')} />
            </Modal>

            {/* Confirmation Snackbar to notify successfully adding contact */}
            <Snackbar visible={visible} onDismiss={console.log} action={{
                label: "Contact List",
                onPress: onGoHome
            }}>Contact Added</Snackbar>
        </>
    )
}
