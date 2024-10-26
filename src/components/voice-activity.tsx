'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Bot } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Room, RoomEvent } from 'livekit-client'
import { createToken } from '@/app/utils'

let debounce: string | number | NodeJS.Timeout | undefined
let debounce2: string | number | NodeJS.Timeout | undefined
export function VoiceActivity() {
    const [isUserSpeaking, setIsUserSpeaking] = useState(false)
    const [isAISpeaking, setIsAISpeaking] = useState(false)
    const [started, setStarted] = useState(false)
    const [isMicOn, setIsMicOn] = useState(false)
    const room: any = useRef()
    const NEXT_PUBLIC_LIVEKIT_URL = 'wss://sia-5hbxjjlj.livekit.cloud'

    useEffect(() => {
        async function fun() {
            room.current = new Room()
            const { token } = await createToken()
            await room.current.connect(NEXT_PUBLIC_LIVEKIT_URL, token)
        }
        if (started) {
            fun()
            room.current.on(RoomEvent.ParticipantConnected, (remote: any) => {
                console.log(remote)
            })
            room.current.on(
                RoomEvent.TrackSubscribed,
                (track: { attach: (arg0: any) => void }) => {
                    const audioElement = document.getElementById('audioElement')
                    // callerTuneAudioElement.pause();
                    track.attach(audioElement)
                }
            )
            room.current.on(
                RoomEvent.TranscriptionReceived,
                async (transcription: any, participant: any) => {
                    console.log(transcription)
                    if (
                        participant?.identity ===
                        room.current?.localParticipant?.identity
                    ) {
                        setIsUserSpeaking(true)
                        if (debounce) {
                            clearTimeout(debounce)
                        }
                        debounce = setTimeout(async () => {
                            setIsUserSpeaking(false)
                        }, 1000)
                    } else {
                        setIsAISpeaking(true)
                        if (debounce2) {
                            clearTimeout(debounce2)
                        }
                        debounce2 = setTimeout(async () => {
                            setIsAISpeaking(false)
                        }, 1000)
                    }
                }
            )
            room.current.on(
                RoomEvent.ConnectionStateChanged,
                async (state: any) => {
                    console.log('state', state)
                    if (state === 'connected') {
                        room.current?.localParticipant.setMicrophoneEnabled(
                            true
                        )
                        room.current?.localParticipant.setMicrophoneEnabled(
                            false
                        )
                    }
                }
            )
        } else {
            room.current?.disconnect()
        }
    }, [started])

    // const toggleUserSpeaking = () => setIsUserSpeaking(!isUserSpeaking)
    // const toggleAISpeaking = () => setIsAISpeaking(!isAISpeaking)
    const toggleStarted = () => setStarted(!started)

    const CircularVoiceAnimation = ({
        isActive,
        colorStart,
        colorEnd,
    }: {
        isActive: boolean
        colorStart: string
        colorEnd: string
    }) => (
        <div className="relative h-32 w-32">
            <AnimatePresence>
                {isActive &&
                    [...Array(3)].map((_, index) => (
                        <motion.div
                            key={index}
                            className="absolute inset-0"
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: [0.3, 0.7, 0.3],
                            }}
                            exit={{
                                opacity: 0,
                                transition: {
                                    duration: 0.3,
                                    ease: 'easeInOut',
                                },
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: index * 0.6,
                                ease: 'easeInOut',
                            }}
                        >
                            <svg
                                className="h-full w-full"
                                viewBox="0 0 100 100"
                            >
                                <defs>
                                    <radialGradient
                                        id={`gradient-${index}`}
                                        cx="50%"
                                        cy="50%"
                                        r="50%"
                                        fx="50%"
                                        fy="50%"
                                    >
                                        <stop
                                            offset="0%"
                                            stopColor={colorStart}
                                        />
                                        <stop
                                            offset="100%"
                                            stopColor={colorEnd}
                                        />
                                    </radialGradient>
                                </defs>
                                <motion.circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill={`url(#gradient-${index})`}
                                    filter="url(#glow)"
                                    initial={{ r: 36 }}
                                    animate={{ r: [36, 45, 36] }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: index * 0.6,
                                        ease: 'easeInOut',
                                    }}
                                />
                            </svg>
                        </motion.div>
                    ))}
            </AnimatePresence>
            <svg width="0" height="0">
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </svg>
        </div>
    )

    return (
        <Card className="mx-auto w-full max-w-2xl">
            <CardContent className="p-6">
                <div className="flex flex-col items-center justify-around space-y-8 md:flex-row md:space-x-8 md:space-y-0">
                    {/* <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            <CircularVoiceAnimation
                                isActive={isUserSpeaking}
                                colorStart="#22c55e"
                                colorEnd="#4ade80"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Avatar className="h-16 w-16 bg-green-100">
                                    <AvatarFallback>
                                        <User className="h-8 w-8 text-green-600" />
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        </div>
                    </div> */}

                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            <CircularVoiceAnimation
                                isActive={isAISpeaking}
                                colorStart="#3b82f6"
                                colorEnd="#60a5fa"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Avatar className="h-32 w-32 bg-blue-100">
                                    <AvatarFallback>
                                        <Bot className="h-16 w-16 text-blue-600" />
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-20 grid w-full grid-cols-1 place-content-center gap-y-8 md:grid-cols-2">
                    <Button
                        onClick={toggleStarted}
                        variant={started ? 'destructive' : 'default'}
                        className="m-auto w-40"
                    >
                        {started ? 'Stop' : 'Start'}
                    </Button>
                    <Button
                        onClick={() => {
                            if (isMicOn) {
                                room.current?.localParticipant.setMicrophoneEnabled(
                                    false
                                )
                                setIsMicOn(false)
                            } else {
                                room.current?.localParticipant.setMicrophoneEnabled(
                                    true
                                )
                                setIsMicOn(true)
                            }
                        }}
                        variant={isMicOn ? 'destructive' : 'default'}
                        className="m-auto w-40"
                    >
                        {isMicOn ? 'Stop Mic' : 'Start Mic'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
