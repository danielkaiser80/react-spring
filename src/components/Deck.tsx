import React, { useState } from "react"
import { animated, to, useSprings } from "react-spring"
import { useGesture } from "react-use-gesture"
import image0 from "../assets/IMG_4959.jpeg"
import image1 from "../assets/IMG_5025.jpeg"
import image2 from "../assets/IMG_5055.jpeg"
import image3 from "../assets/IMG_5168.jpeg"
import image4 from "../assets/IMG_5178.jpeg"
import image5 from "../assets/IMG_5216.jpeg"
import { rotatedTo, trans } from "./util"

const cards = [image0, image1, image2, image3, image4, image5]

const Deck = () => {
  // The set flags all the cards that are flicked out
  const [gone] = useState(() => new Set())

  // Create a bunch of springs using the helpers above
  const [props, set] = useSprings(cards.length, (i) => ({ ...rotatedTo(i), from: { x: 0, rot: 0, scale: 1.5, y: -1000 } }))

  // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
  const bind = useGesture({
    onDrag: ({ args: [index], down, delta: [xDelta], direction: [xDir], velocity }) => {
      const trigger = velocity > 0.2 // If you flick hard enough it should trigger the card to fly out
      const dir = xDir < 0 ? -1 : 1 // Direction should either point left or right
      if (!down && trigger) gone.add(index) // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out

      set((i) => {
        if (index !== i) return // We're only interested in changing spring-data for the current spring

        const isGone = gone.has(index)
        const x = isGone ? (200 + window.innerWidth) * dir : down ? xDelta : 0 // When a card is gone it flies out left or right, otherwise goes back to zero
        const rot = xDelta / 100 + (isGone ? dir * 10 * velocity : 0) // How much the card tilts, flicking it harder makes it rotate faster
        const scale = down ? 1.1 : 1 // Active cards lift-up a bit
        return { x, rot, scale, delay: undefined, config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 } }
      })

      if (!down && gone.size === cards.length) {
        setTimeout(() => {
          gone.clear()
          setTimeout(() => set((i) => rotatedTo(i)), 600)
        }, 600)
      }
    },
  })

  // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
  return (
    <>
      {props.map(({ x, y, rot, scale }, i) => {
        const cardUrl = `url(${cards[i]})`
        return (
          <animated.div key={cardUrl} style={{ transform: to([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`) }}>
            {/* This is the card itself, we're binding our gesture to it (and inject its index, so we know which is which) */}
            <animated.div
              {...bind(i)}
              style={{
                transform: to([rot, scale], trans),
                backgroundImage: cardUrl,
              }}
            />
          </animated.div>
        )
      })}
    </>
  )
}

export default Deck
