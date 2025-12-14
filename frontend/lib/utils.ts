import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSweetImage(name: string): string {
  const imageMap: Record<string, string> = {
    'Chocolate Truffle': '/chocolate-truffle.png',
    'Strawberry Gummy Bears': '/strawberry-gummy-bears.jpg',
    'Caramel Fudge': '/caramel-fudge.jpg',
    'Mint Lollipops': '/mint-lollipop.jpg',
    'Vanilla Marshmallows': '/vanilla-marshmallows.jpg',
    'Sour Rainbow Strips': '/sour-rainbow-candy.jpg',
  };
  return imageMap[name] || '/placeholder.svg';
}