import React, { useState, useEffect } from 'react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent } from "./ui/card"
import { Sparkles, Search, RefreshCw } from 'lucide-react'

export default function AdviceApp() {
  const [advice, setAdvice] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [bgColor, setBgColor] = useState({ start: '#8B5CF6', mid: '#EC4899', end: '#EF4444' })

  useEffect(() => {
    getRandomAdvice()
    startColorChange()
  }, [])

  const getRandomAdvice = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('https://api.adviceslip.com/advice')
      const data = await response.json()
      setAdvice([data.slip.advice])
    } catch (error) {
      console.error('Error fetching advice:', error)
      setAdvice(['Oops! The advice fairy is on vacation. Try again later! 🧚‍♀️✨'])
    }
    setIsLoading(false)
  }

  const searchAdvice = async () => {
    if (!searchTerm.trim()) return
    setIsLoading(true)
    try {
      const response = await fetch(`https://api.adviceslip.com/advice/search/${encodeURIComponent(searchTerm)}`)
      const data = await response.json()
      if (data.slips && data.slips.length > 0) {
        setAdvice(data.slips.map((slip) => slip.advice))
      } else {
        setAdvice(['No advice found. Maybe try something less sus? 🕵️‍♂️'])
      }
    } catch (error) {
      console.error('Error searching advice:', error)
      setAdvice(['Oof! Our advice machine is glitching. Give it another shot! 🤖💥'])
    }
    setIsLoading(false)
  }

  const startColorChange = () => {
    setInterval(() => {
      const newStart = `hsl(${Math.random() * 360}, 70%, 60%)`
      const newMid = `hsl(${Math.random() * 360}, 70%, 60%)`
      const newEnd = `hsl(${Math.random() * 360}, 70%, 60%)`
      setBgColor({ start: newStart, mid: newMid, end: newEnd })
    }, 5000) // Change every 5 seconds
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 transition-colors duration-1000 ease-in-out"
      style={{
        background: `linear-gradient(to bottom right, ${bgColor.start}, ${bgColor.mid}, ${bgColor.end})`
      }}
    >
      <Card className="w-full max-w-md bg-white bg-opacity-90 backdrop-blur-md">
        <CardContent className="p-6 space-y-6">
          <h1 className="text-3xl font-bold text-center text-purple-600 mb-4">
            Check Advice 🌈✨
          </h1>
          
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Search for advice..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow"
              />
              <Button onClick={searchAdvice} disabled={isLoading}>
                <Search className="w-4 h-4 mr-2" />
                <span className="sr-only">Search</span>
                Search
              </Button>
            </div>
            
            <Button onClick={getRandomAdvice} disabled={isLoading} variant="outline" className="w-full">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="sr-only">Get Random Advice</span>
              Get Random Advice
            </Button>
          </div>
          
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center">
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Loading...
              </div>
            ) : (
              advice.map((item, index) => (
                <Card key={index} className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white p-4 rounded-lg shadow-lg">
                  <CardContent>
                    <p className="text-lg font-semibold">{item}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}