"use client"
import { useState } from "react"
import { Star } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const MAX_RATING = 5

export default function ProductRatingDialog() {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)

  return (
    <Dialog open onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Do you like DevKalk?</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex">
            {[...Array(MAX_RATING)].map((_, index) => {
              const ratingValue = index + 1
              return (
                <Star
                  key={index}
                  className={`w-8 h-8 cursor-pointer transition-colors ${
                    ratingValue <= (hover || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => setRating(ratingValue)}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(0)}
                />
              )
            })}
          </div>
          <p className="text-sm text-gray-500">
            {rating ? `You have selected ${rating} ${rating === 1 ? "star" : "stars"}` : "Select a rating"}
          </p>
          <Button onClick={() => console.log(`Rating submitted: ${rating}`)}>Submit rating</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
