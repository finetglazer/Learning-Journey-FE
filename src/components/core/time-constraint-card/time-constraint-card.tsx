import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock } from "lucide-react"

// Define props for the component to make it dynamic
interface TimeConstraintCardProps {
    // The progress value for the bar, from 0 to 100
    progress: number;
}

// Define the component
export function TimeConstraintCard({ progress }: TimeConstraintCardProps) {
    return (
        <Card className="max-w-md w-full rounded-xl shadow-lg border border-gray-200">
            <CardContent className="p-5">

                {/* Subtitle */}
                <p className="text-sm text-gray-500 mb-1">
                    The limit working time
                </p>

                {/* Main Title and Time */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-blue-600">
                        Under time constraints
                    </h2>
                    <div className="flex items-center text-gray-500">
                        <Clock className="w-4 h-4 mr-1.5" />
                        <span className="text-sm font-medium">8hr</span>
                    </div>
                </div>

                {/* Custom Progress Bar */}
                <div className="relative w-full h-4 bg-gray-200 rounded-full">
                    {/* Progress fill */}
                    <div
                        className="h-full bg-cyan-300 rounded-full"
                        style={{ width: `${progress}%` }}
                    />

                    {/* Decorative dots on the progress bar */}
                    {/* Dot at 15% */}
                    <div className="absolute top-1/2 left-[15%] transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/70 rounded-full" />

                    {/* Dot at 30% */}
                    <div className="absolute top-1/2 left-[30%] transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/70 rounded-full" />

                    {/* Dot at 60% */}
                    <div className="absolute top-1/2 left-[60%] transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-cyan-300/60 rounded-full" />

                    {/* Dot at 80% */}
                    <div className="absolute top-1/2 left-[80%] transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-cyan-300/60 rounded-full" />
                </div>

            </CardContent>
        </Card>
    )
}