import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import Voice from '@react-native-community/voice';
import Features from '../components/features'
import { apiCall } from '../api/openAI'
import Tts from 'react-native-tts';

export default function HomeScreen() {
    const [messages, setMessages] = useState([])
    const [recording, setRecording] = useState(false)
    const [speaking, setSpeaking] = useState(false)
    const [result, setResult] = useState('')
    const [loading, setLoading] = useState(false)
    const ScrollViewRef = useRef()

    const clear = () => {
        setMessages([])
        Tts.stop()
    }

    const stopSpeaking = () => {
        Tts.stop()
        setSpeaking(false)
    }

    const speechStartHandler = (e) => {

    }

    const speechEndHandler = (e) => {
        setRecording(false)
    }

    const speechResultsHandler = (e) => {
        const text = e.value[0]
        setResult(text)
    }

    const speechErrorHandler = (e) => {
        console.log('error event: ', e)
    }

    const startRecording = async () => {
        setRecording(true)
        Tts.stop()
        try{
            await Voice.start('en-US')
        } catch(error) {
            console.log('error: ', error)
        }
    }

    const stopRecording = async () => {
        setRecording(false)
        try{
            await Voice.stop()
            fetchResponse()
        } catch(error) {
            console.log('error: ', error)
        }
    }

    const updateScrollView = () => {
        setTimeout(() => {
            ScrollViewRef?.current?.scrollToEnd({animated: true})
        }, 200)
    }

    const startTextToSpeech = (message) => {
        if (!message.content.includes('http')) {
            Tts.getInitStatus().then(() => {
                Tts.speak('Testing the text to speech functionality. Let\'s see if it works');
              }, (err) => {
                if (err.code === 'no_engine') {
                  Tts.requestInstallEngine();
                }
              });

        }
    }

    const fetchResponse = () => {
        if (result.trim().length > 0) {
            let newMessages = [...messages]
            newMessages.push({role: 'user', content: result.trim()})
            setMessages([...newMessages])
            updateScrollView()
            setLoading(true)
            apiCall(result.trim(), newMessages)
                .then(res => {
                    setLoading(false)
                    if (res.success) {
                        setMessages([...res.data])
                        updateScrollView()
                        startTextToSpeech(res.data[res.data.length-1])
                        setResult('')
                    } else {
                        Alert.alert('Error', res.msg)
                    }
                })
        }
    }

    useEffect(() => {
        Voice.onSpeechStart = speechStartHandler;
        Voice.onSpeechEnd = speechEndHandler;
        Voice.onSpeechResults = speechResultsHandler;
        Voice.onSpeechError = speechErrorHandler;

        Tts.addEventListener('tts-start', (event) => console.log("start", event));
        Tts.addEventListener('tts-progress', (event) => console.log("progress", event));
        Tts.addEventListener('tts-finish', (event) => {console.log("finish", event); setSpeaking(false)});
        Tts.addEventListener('tts-cancel', (event) => console.log("cancel", event));

        return () => {
            Voice.destroy().then(Voice.removeAllListeners)
        }
    }, [])   

    return (
        <View className="flex-1 bg-white">
            <SafeAreaView className="flex-1 flex mx-5">
                <View className="flex-row justify-center">
                    <Image source={require('../../assets/images/bot.png')} style={{height: hp(15), width: hp(15)}}/>
                </View>
                {messages.length > 0 ? (
                    <View className="space-y-2 flex-1">
                        <Text style={{fontSize: wp(5)}} 
                            className="text-gray-700 font-semibold ml-1"
                        >
                            Assistant
                        </Text>
                        <View style={{height: hp(58)}} 
                            className="bg-neutral-200 rounded-3xl p-4"
                        >
                            <ScrollView ref={ScrollViewRef}
                                bounces={false} 
                                className="space-y-4" 
                                showsVerticalScrollIndicator={false}
                            >
                                {
                                    messages.map((message, index) => {
                                        if (message.role === 'assistant'){
                                            if (message.content.includes('https')){
                                                return (
                                                    <View key={index} 
                                                        className="flex-row justify-start"
                                                    >
                                                        <View style={{width: wp(70)}}
                                                            className="flex bg-emerald-100 rounded-2xl p-2 rounded-tl-none"
                                                        >
                                                            <Image source={{uri: message.content}}
                                                                className="rounded-2xl"
                                                                resizeMode="contain"
                                                                style={{height: wp(60), width: wp(60)}}
                                                            />
                                                        </View>
                                                    </View>
                                                )
                                            } else {
                                                return (
                                                    <View key={index}
                                                        style={{width: wp(70)}}
                                                        className="bg-emerald-100 rounded-xl p-2 rounded-tl-none"
                                                    >
                                                        <Text>
                                                            {message.content}
                                                        </Text>
                                                    </View>
                                                    
                                                )
                                            }
                                        } else {
                                            return (
                                                <View key={index} 
                                                    className="flex-row justify-end"
                                                >
                                                    <View style={{width: wp(70)}}
                                                        className="bg-white rounded-xl p-2 rounded-tr-none"
                                                    >
                                                        <Text>
                                                            {message.content}
                                                        </Text>
                                                    </View>
                                                </View>
                                            )
                                        }
                                    })
                                }
                            </ScrollView>
                        </View>
                    </View>
                ) : (
                    <Features/>
                )}
                <View className="flex justify-center items-center">
                    { speaking.length > 0 && (
                        <TouchableOpacity 
                            onPress={stopSpeaking}
                            className="bg-red-400 rounded-3xl p-2 absolute left-10">
                            <Text className="text-white font-semibold"> 
                                Stop
                            </Text>
                        </TouchableOpacity>
                    )}
                    { loading ? (
                        <Image source={require('../../assets/images/loading.gif')}
                            style={{width: hp(10), height: hp(10)}}
                        />
                    ) : recording ? (
                            <TouchableOpacity onPress={stopRecording}>
                                <Image className="rounded-full"
                                    source={require('../../assets/images/voiceLoading.gif')}
                                    style={{width: hp(10), height: hp(10)}}
                                />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={startRecording}>
                                <Image className="rounded-full"
                                    source={require('../../assets/images/recordingIcon.png')}
                                    style={{width: hp(10), height: hp(10)}}
                                />
                            </TouchableOpacity>
                        )
                    }
                    { messages.length > 0 && (
                        <TouchableOpacity 
                            onPress={clear}
                            className="bg-neutral-400 rounded-3xl p-2 absolute right-10">
                            <Text className="text-white font-semibold"> 
                                Clear
                            </Text>
                        </TouchableOpacity>
                    )}

                </View>
            </SafeAreaView>
        </View>
    )
}