import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useRef, useState } from "react"
import "regenerator-runtime/runtime"
import { GetHighlightedTranscript } from "./lib/helpers"
import { socket } from "./lib/socket"

export default function App() {
  const [isRecording, setIsRecording] = useState(false)
  const [metadata, setMetadata] = useState("")
  const [webcamStream, setWebcamStream] = useState(null)
  const [transcript, setTranscript] = useState(
    "test text end more rnadom text here i dont know what to write text",
  )

  const idx = useRef(-1)
  const camStream = useRef(null)
  const mediaRecorderRef = useRef(null)

  const [highlights, setHighlights] = useState([
    { start: 0, end: 10, type: "false" },
    { start: 11, end: 20, type: "true" },
    { start: 21, end: 30, type: "context" },
    { start: 31, end: 40, type: "false" },
    { start: 41, end: 50, type: "false" },
  ])
  const [highlightedTranscript, setHighlightedTranscript] = useState([])

  var curIteration = useRef(0)

  useEffect(() => {
    const getWebcamStream = async () => {
      camStream.current.srcObject = await navigator.mediaDevices.getUserMedia({
        video: true,
      })
      camStream.current.play()
    }

    getWebcamStream()
  }, [])

  useEffect(() => {
    const startRecording = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      })
      mediaRecorderRef.current = new MediaRecorder(stream)
      socket.connect()

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          socket.emit("audio_data", event.data)
          console.log("Audio data sent:", event.data.size, "bytes")
        }
      }

      mediaRecorderRef.current.onstop = () => {
        socket.disconnect()
      }

      socket.on("transcript", (transcript) => {
        console.log("Transcript received:", transcript)
        const delimeter = transcript.indexOf(",")
        const text = transcript.substring(delimeter + 1)
        if (idx.current === -1) {
          idx.current = parseInt(transcript.substring(0, delimeter))
        }

        setTranscript((prev) => [...prev, text])
      })

      socket.on("metadata", (metadata) => {
        console.log("Metadata received:", metadata)

        // const sample = {
        //   highlights: [
        //     {
        //       type: "text",
        //       start: 0,
        //       end: 15,
        //     },
        //   ],
        // }

        if (idx.current === -1) {
          setMetadata((prev) => [...prev, metadata])
          return
        }

        const newMetadata = metadata.map((m) => {
          return {
            ...m,
            start: m.start - idx.current,
            end: m.end - idx.current,
          }
        })

        setMetadata((prev) => [...prev, newMetadata])
      })

      mediaRecorderRef.current.start(100)
    }

    const stopRecording = () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop()
      }
    }

    if (isRecording) {
      startRecording()
    } else {
      stopRecording()
    }

    return () => {
      stopRecording()
    }
  }, [isRecording])

  useEffect(() => {
    curIteration.current += 1
    console.log(curIteration.current)
    console.log(highlights)
    setHighlightedTranscript(
      GetHighlightedTranscript(transcript, highlights, curIteration),
    )
  }, [highlights, transcript])

  return (
    <div className="relative w-screen min-h-screen flex justify-center items-center px-8">
      {/* Video Player 16:9 */}
      <div className="h-full aspect-video min-h-[280px] rounded-xl">
        <video
          className="w-full h-full object-cover rounded-xl"
          autoPlay
          muted
          ref={camStream}
        />
      </div>
      {/* Transcript */}
      <div className="h-full min-w-[25vw] min-h-[100vh] rounded-lg py-16 px-4">
        <CardHeader>
          <CardTitle>Transcript</CardTitle>
        </CardHeader>
        <CardContent>{highlightedTranscript}</CardContent>
      </div>
      {/* Metadata */}
      <div className="h-full min-w-[25vw] min-h-[100vh] rounded-lg py-16 px-4">
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {highlights.map((high, index) => (
            <Card key={index} className={CardStyles[high.type]}>
              <CardHeader>
                <CardTitle className="">Box 1</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="">
                  This is an empty box. You can add content here.
                </p>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </div>
    </div>
  )

  // return (
  //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-screen w-screen bg-gray-900 text-gray-100">
  //     <div className="relative bg-black">
  //       <video
  //         className="absolute inset-0 w-full h-full object-cover"
  //         src="https://www.w3schools.com/html/mov_bbb.mp4"
  //         autoPlay
  //         loop
  //         muted
  //         playsInline
  //       />
  //     </div>
  //     <ScrollArea className="h-full bg-gray-800 border-l border-r border-gray-700 p-6">
  //       <h2 className="text-2xl font-bold mb-4">Lorem Ipsum</h2>
  //       {highlightedTranscript}
  //     </ScrollArea>
  //     <div className="bg-gray-800 p-4 overflow-auto">
  //       <div className="grid gap-4">
  //         {highlights.map((high, index) => (
  //           <Card key={index} className={CardStyles[high.type]}>
  //             <CardHeader>
  //               <CardTitle className="text-gray-100">Box 1</CardTitle>
  //             </CardHeader>
  //             <CardContent>
  //               <p className="text-gray-300">
  //                 This is an empty box. You can add content here.
  //               </p>
  //             </CardContent>
  //           </Card>
  //         ))}

  //         <Card className="bg-gray-700 border-gray-600">
  //           <CardHeader>
  //             <CardTitle className="text-gray-100">Box 3</CardTitle>
  //           </CardHeader>
  //           <CardContent>
  //             <p className="text-gray-300">
  //               You can add more boxes or other components in this column.
  //             </p>
  //           </CardContent>
  //           <Button
  //             onClick={() => {
  //               setHighlights(
  //                 [
  //                   ...highlights,
  //                   {
  //                     start: 17,
  //                     end: 25,
  //                     type: "true",
  //                   },
  //                 ].sort((a, b) => a.start - b.start),
  //               )
  //             }}
  //           >
  //             PRESS HERE
  //           </Button>
  //         </Card>
  //       </div>
  //     </div>
  //   </div>
  // )
}

const CardStyles = {
  false:
    "border-2 border-red-300 bg-red-100 bg-opacity-50 rounded-lg animate-in",
  true: "border-2 border-green-300 bg-green-100 bg-opacity-50 rounded-lg animate-in",
  context:
    "border-2 border-blue-300 bg-blue-100 bg-opacity-50 rounded-lg animate-in",
}
