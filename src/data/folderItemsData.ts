import React from 'react';

export interface FolderItem {
  name: string;
  icon: string;
  appId?: string; // For built-in apps
  path?: string; // For external games/content
  isBuiltIn?: boolean; // To differentiate built-in games from external ones
  audioUrls?: string[]; // Add optional array for audio URLs
  openOnSingleClick?: boolean; // Add optional property for single-click behavior
  component?: React.ComponentType<any>; // Use a more general type to allow different component types
}

export const games: FolderItem[] = [
  // Built-in games
  {
    name: 'Minesweeper',
    icon: '/minesweeper.png',
    appId: 'minesweeper',
    isBuiltIn: true
  },
  {
    name: 'Solitaire',
    icon: '/sollitaire.png',
    appId: 'solitaire',
    isBuiltIn: true
  },
  // External games with updated icons and new items
  {
    name: 'Pizza Delivery',
    icon: '/pizza.png',
    path: '/games/pizza-undelivery/index.html',
    isBuiltIn: false
  },
  {
    name: 'Super Mario',
    icon: '/mario.png',
    path: '/games/mario_js-master/index.html',
    isBuiltIn: false
  },
  // Street Fighter is added back
  {
    name: 'Street Fighter',
    icon: '/street.png',
    path: '/games/StreetFighter-main/index.html',
    isBuiltIn: false
  },
  {
    name: 'Racer',
    icon: '/racer.png',
    path: '/games/racer/index.html',
    isBuiltIn: false
  },
  {
    name: 'Zelda',
    icon: '/zelda.png',
    path: '/games/zelda-js-master/index.html',
    isBuiltIn: false
  },
  {
    name: 'Mortal Kombat Wiki',
    icon: '/mortalkombat.png',
    path: '/games/MK-Wiki-master/index.html',
    isBuiltIn: false
  }
];

export const flashForwardFolders: FolderItem[] = [
  { name: 'Services', icon: '/documents copy.png', appId: 'servicesWindow', isBuiltIn: true },
  { name: 'Pricing', icon: '/documents copy.png', appId: 'pricingWindow', isBuiltIn: true },
  {
    name: 'Testimonials',
    icon: '/testimonials.png',
    audioUrls: [
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/5.mp3',
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/2.mp3',
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/8.mp3',
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/16.mp3',
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/15.mp3',
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/4.mp3',
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/9.mp3',
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/13.mp3',
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/12.mp3',
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/11.mp3',
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/7.mp3',
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/14.mp3',
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/17.mp3',
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/3.mp3',
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/19.mp3',
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/6.mp3',
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/1.mp3',
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/18.mp3',
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/10.mp3'
    ],
    openOnSingleClick: true
  },
  { name: 'Contact us', icon: '/phone.png', appId: 'contactUsWindow', isBuiltIn: true },
  { name: 'Our Work', icon: '/Our_Work.png', appId: 'ourWork', isBuiltIn: true },
  { name: 'Update', icon: '/update.png', appId: 'statsPage', isBuiltIn: true }
];

export const mediaItems: FolderItem[] = [
  {
    name: 'News.mp4',
    icon: '/promovids.png',
    path: 'https://file.garden/Zxsc5-9aojhlnJO6/news_promo.mp4',
    isBuiltIn: false
  },
  {
    name: 'Promo.mp4',
    icon: '/promovids.png',
    path: 'https://file.garden/Zxsc5-9aojhlnJO6/flashforowarddraft.mp4',
    isBuiltIn: false
  }
];

export const aiItems: FolderItem[] = [
  {
    name: 'Image Generator',
    icon: '/imagegen.png',
    appId: 'imageGenerator',
    isBuiltIn: true,
  },
  {
    name: 'Chatbot',
    icon: '/90schatbot.png',
    appId: 'chatbot',
    isBuiltIn: true,
  },
  {
    name: 'Voicebot',
    icon: '/callagent.png',
    appId: 'voicebot',
    isBuiltIn: true,
  },
  {
    name: '90sGPT',
    icon: '/90sgpt.png',
    appId: 'gpt90s',
    isBuiltIn: true,
  },
];