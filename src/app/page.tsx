import { ModeToggle } from '@/components/ui/theme-toggle'
import WordPullUp from '@/components/ui/word-pull-up'
import { VoiceActivity } from '@/components/voice-activity'

export default function Home() {
    return (
        <div className="flex flex-col items-center gap-10">
            <nav className="flex w-full items-center justify-between border px-10">
                <WordPullUp
                    words="AI Inventory Manager"
                    className="py-2 text-2xl md:py-5 md:text-4xl"
                />
                <ModeToggle />
            </nav>

            <VoiceActivity />
            <audio id="audioElement" className="hidden"></audio>
        </div>
    )
}
