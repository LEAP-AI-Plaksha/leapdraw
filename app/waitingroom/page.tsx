"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Header from "../components/Header";

interface Bubble {
  position: { left: number; top: number };
  velocity: { x: number; y: number };
  color: string;
}

const DisplayPage: React.FC = () => {
  const displayRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const [numBubbles, setNumBubbles] = useState(10);
  const [bubbleColors] = useState(() => [
    "#11AC7B",
    "#9839B1",
    "#337DFF",
    "#EC5E46",
  ]);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsLoading(true);

    const bubbleSize = 160;
    const bubbleRadius = bubbleSize / 2;
    const padding = 40;
    const headerHeight = 80;

    // Initialize bubbles with position, velocity, and color
    const initializeBubbles = () => {
      if (!displayRef.current) return [];

      const displayRect = displayRef.current.getBoundingClientRect();
      const maxX = Math.max(0, displayRect.width - bubbleSize - padding);
      const maxY = Math.max(
        0,
        displayRect.height - bubbleSize - padding - headerHeight
      );

      const newBubbles: Bubble[] = [];

      for (let i = 0; i < numBubbles; i++) {
        // Generate random position
        const randomX = Math.floor(Math.random() * maxX) + padding;
        const randomY =
          Math.floor(Math.random() * maxY) + padding + headerHeight;

        // Generate random velocity (slight movement)
        const randomVelocityX = (Math.random() * 2 - 1) * 50;
        const randomVelocityY = (Math.random() * 2 - 1) * 50;

        // Randomly select color from original array
        const randomColor =
          bubbleColors[Math.floor(Math.random() * bubbleColors.length)];

        // Create and add the bubble without checking overlaps
        newBubbles.push({
          position: { left: randomX, top: randomY },
          velocity: { x: randomVelocityX, y: randomVelocityY },
          color: randomColor,
        });
      }

      return newBubbles;
    };

    // Set initial bubble states
    const initialBubbles = initializeBubbles();
    setBubbles(initialBubbles);

    setTimeout(() => {
      setBubbles((prevBubbles) =>
        prevBubbles.map((bubble) => ({
          ...bubble,
          velocity: {
            x: (bubble.velocity.x / 50) * 0.1,
            y: (bubble.velocity.y / 50) * 0.1,
          },
        }))
      );
      setIsLoading(false);
    }, 100);

    // Animation loop for physics updates
    const updatePhysics = () => {
      if (!displayRef.current) return;

      const displayRect = displayRef.current.getBoundingClientRect();
      const maxX = displayRect.width - bubbleSize;
      const maxY = displayRect.height - bubbleSize;

      setBubbles((prevBubbles) => {
        const updatedBubbles = [...prevBubbles];

        // Update positions based on velocity
        for (let i = 0; i < updatedBubbles.length; i++) {
          const bubble = updatedBubbles[i];

          // Update position based on velocity
          bubble.position.left += bubble.velocity.x;
          bubble.position.top += bubble.velocity.y;

          // Wall collision detection
          if (bubble.position.left <= 0 || bubble.position.left >= maxX) {
            bubble.velocity.x *= -1; // Reverse x velocity
            bubble.position.left = Math.max(
              0,
              Math.min(maxX, bubble.position.left)
            );
          }

          if (
            bubble.position.top <= headerHeight ||
            bubble.position.top >= maxY
          ) {
            bubble.velocity.y *= -1; // Reverse y velocity
            bubble.position.top = Math.max(
              headerHeight,
              Math.min(maxY, bubble.position.top)
            );
          }
        }

        // Bubble-to-bubble collision detection
        for (let i = 0; i < updatedBubbles.length; i++) {
          for (let j = i + 1; j < updatedBubbles.length; j++) {
            const bubble1 = updatedBubbles[i];
            const bubble2 = updatedBubbles[j];

            // Calculate distance between centers
            const centerX1 = bubble1.position.left + bubbleRadius;
            const centerY1 = bubble1.position.top + bubbleRadius;
            const centerX2 = bubble2.position.left + bubbleRadius;
            const centerY2 = bubble2.position.top + bubbleRadius;

            const dx = centerX2 - centerX1;
            const dy = centerY2 - centerY1;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Check if bubbles are colliding
            if (distance < bubbleSize) {
              // Calculate collision normal vector
              const nx = dx / distance;
              const ny = dy / distance;

              // Calculate relative velocity
              const relVelX = bubble2.velocity.x - bubble1.velocity.x;
              const relVelY = bubble2.velocity.y - bubble1.velocity.y;

              // Calculate dot product (relative velocity along normal)
              const dotProduct = relVelX * nx + relVelY * ny;

              // Skip if bubbles are moving away from each other
              if (dotProduct > 0) continue;

              // Calculate impulse scalar
              const impulse = dotProduct;

              // Apply impulse to velocities
              bubble1.velocity.x += impulse * nx;
              bubble1.velocity.y += impulse * ny;
              bubble2.velocity.x -= impulse * nx;
              bubble2.velocity.y -= impulse * ny;

              // Move bubbles apart to prevent sticking
              const overlap = bubbleSize - distance;
              const moveX = (overlap / 2) * nx;
              const moveY = (overlap / 2) * ny;

              bubble1.position.left -= moveX;
              bubble1.position.top -= moveY;
              bubble2.position.left += moveX;
              bubble2.position.top += moveY;
            }
          }
        }

        return updatedBubbles;
      });

      // Continue animation loop
      animationRef.current = requestAnimationFrame(updatePhysics);
    };

    // Start animation loop
    animationRef.current = requestAnimationFrame(updatePhysics);

    // Handle window resize (keeping original resize logic)
    const handleResize = () => {
      setIsLoading(true);
      setBubbles(initializeBubbles());

      setTimeout(() => {
        setBubbles((prevBubbles) =>
          prevBubbles.map((bubble) => ({
            ...bubble,
            velocity: {
              x: (bubble.velocity.x / 50) * 0.1,
              y: (bubble.velocity.y / 50) * 0.1,
            },
          }))
        );
        setIsLoading(false);
      }, 100);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [numBubbles, bubbleColors]);

  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-black"
      ref={displayRef}
    >
      <Header />
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="text-lg font-semibold p-4">Room: 2987767</div>
        {/* Render bubbles dynamically */}
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p>Loading Players...</p>
          </div>
        ) : (
          bubbles.map((bubble, index) => (
            <div
              key={index}
              className="absolute"
              style={{
                left: `${bubble.position.left}px`,
                top: `${bubble.position.top}px`,
              }}
            >
              <div
                className="rounded-full w-40 h-40 flex items-center justify-center border-8 border-white"
                style={{
                  backgroundColor: bubble.color,
                }}
              >
                <Image
                  src={`/froggy/froggy${index + 1}.svg`}
                  alt={`Froggy ${index + 1}`}
                  width={224}
                  height={224}
                  className="object-cover rounded-full"
                />
              </div>
              <Image
                src="/shine.svg"
                alt="Shine"
                width={128}
                height={128}
                className="absolute inset-0 transform rotate-12 translate-y-9 translate-x-12"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DisplayPage;
