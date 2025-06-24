import React from 'react';
import MyComputer from '../components/Windows95/apps/MyComputer';
import MyDocuments from '../components/Windows95/apps/MyDocuments';
import RecycleBin from '../components/Windows95/apps/RecycleBin';
import Calculator from '../components/Windows95/apps/Calculator';
import InternetExplorer from '../components/Windows95/apps/InternetExplorer';
import MSPaint from '../components/Windows95/apps/MSPaint';
import MediaFolder from '../components/Windows95/apps/MediaFolder';
import GamesFolder from '../components/Windows95/apps/GamesFolder';
import FlashForwardFolder from '../components/Windows95/apps/FlashForwardFolder';
import AIStuffFolder from '../components/Windows95/apps/AIStuffFolder';
import Notepad from '../components/Windows95/apps/Notepad';
import Minesweeper from '../games/Minesweeper';
import Solitaire from '../games/Solitaire';
import ServicesWindow from '../components/Windows95/apps/ServicesWindow';
import PricingWindow from '../components/Windows95/apps/PricingWindow';
import ContactUsWindow from '../components/Windows95/apps/ContactUsWindow';
import OurWorkWindow from '../components/Windows95/apps/OurWorkWindow';
import TVPlayer from '../components/Windows95/apps/TVPlayer';
import WinampPlayer from '../components/Windows95/apps/WinampPlayer';
import ComingSoon from '../components/Windows95/apps/ComingSoon';
import BasicChatbot from '../components/Windows95/apps/BasicChatbot';
import ImageGenerator from '../components/Windows95/apps/ai/ImageGenerator';
import Chatbot from '../components/Windows95/apps/ai/Chatbot';
import Voicebot from '../components/Windows95/apps/ai/Voicebot';
import GPT90s from '../components/Windows95/apps/ai/GPT90s';
import GameLauncher from '../components/Windows95/apps/GameLauncher';

export interface AppContentProps {
  onOpenApp: (appId: string, content?: React.ReactNode, title?: string, position?: { x: number; y: number }) => void;
}

export interface AppConfig {
  name: string;
  icon: string;
  position: { x: number; y: number };
  defaultSize: { width: number; height: number };
  contentType: 'component' | 'iframe' | 'none';
  component?: React.ComponentType<AppContentProps> | React.ReactNode;
  url?: string;
  type?: string;
  isResizable?: boolean;
  isAlwaysOnTop?: boolean;
}

export interface AppData {
  [id: string]: AppConfig;
}

export const initialAppData: AppData = {
  myComputer: {
    name: 'My Computer',
    icon: '/computer.png',
    position: { x: 20, y: 20 },
    defaultSize: { width: 400, height: 300 },
    contentType: 'component',
    component: MyComputer
  },
  myDocuments: {
    name: 'Documents',
    icon: '/documents copy copy.png',
    position: { x: 20, y: 130 },
    defaultSize: { width: 400, height: 300 },
    contentType: 'component',
    component: MyDocuments
  },
  recycleBin: {
    name: 'Recycle Bin',
    icon: '/recycle.png',
    position: { x: 20, y: 240 },
    defaultSize: { width: 400, height: 300 },
    contentType: 'component',
    component: RecycleBin
  },
  calculator: {
    name: 'Calculator',
    icon: '/calculator.png',
    position: { x: 20, y: 350 },
    defaultSize: { width: 250, height: 300 },
    contentType: 'component',
    component: Calculator
  },
  internetExplorer: {
    name: 'Explorer',
    icon: '/Explorer.png',
    position: { x: 20, y: 460 },
    defaultSize: { width: 1000, height: 600 },
    contentType: 'component',
    component: InternetExplorer,
    type: 'default',
    isResizable: true,
    isAlwaysOnTop: false
  },
  msPaint: {
    name: 'MS Paint',
    icon: '/mspaint.png',
    position: { x: 20, y: 570 },
    defaultSize: { width: 800, height: 600 },
    contentType: 'component',
    component: MSPaint,
    type: 'default',
    isResizable: true,
    isAlwaysOnTop: false
  },
  winamp: {
    name: 'Winamp',
    icon: '/winamp.png',
    position: { x: 20, y: 680 },
    defaultSize: { width: 275, height: 116 },
    contentType: 'component',
    component: WinampPlayer
  },
  mediaFolder: {
    name: 'Media',
    icon: '/media.png',
    position: { x: 130, y: 20 },
    defaultSize: { width: 400, height: 300 },
    contentType: 'component',
    component: MediaFolder
  },
  gamesFolder: {
    name: 'Games',
    icon: '/games.png',
    position: { x: 130, y: 130 },
    defaultSize: { width: 400, height: 300 },
    contentType: 'component',
    component: GamesFolder
  },
  minesweeper: {
    name: 'Minesweeper',
    icon: '/minesweeper.png',
    position: { x: 0, y: 0 }, // Hidden from desktop
    defaultSize: { width: 400, height: 500 },
    contentType: 'component',
    component: Minesweeper
  },
  solitaire: {
    name: 'Solitaire',
    icon: '/sollitaire.png',
    position: { x: 0, y: 0 }, // Hidden from desktop
    defaultSize: { width: 800, height: 600 },
    contentType: 'component',
    component: Solitaire
  },
  aiStuffFolder: {
    name: 'AI Stuff',
    icon: '/ai_stuff.png',
    position: { x: 130, y: 240 },
    defaultSize: { width: 400, height: 300 },
    contentType: 'component',
    component: AIStuffFolder
  },
  tv: {
    name: 'TV',
    icon: '/TV.png',
    position: { x: 130, y: 350 },
    defaultSize: { width: 600, height: 630 },
    contentType: 'component',
    component: TVPlayer
  },
  notepad: {
    name: 'Notepad',
    icon: '/Notepad_32x32_4.png',
    position: { x: 130, y: 460 },
    defaultSize: { width: 400, height: 300 },
    contentType: 'component',
    component: Notepad
  },
  flashForwardFolder: {
    name: 'Flash Forward',
    icon: '/flashforward.png',
    position: { x: 130, y: 570 },
    defaultSize: { width: 400, height: 300 },
    contentType: 'component',
    component: FlashForwardFolder
  },
  ourWork: {
    name: 'Our Work',
    icon: '/Our_Work.png',
    position: { x: 0, y: 0 }, // Hidden from desktop
    defaultSize: { width: 600, height: 500 },
    contentType: 'component',
    component: OurWorkWindow
  },
  servicesWindow: {
    name: 'Services',
    icon: '/documents copy.png',
    position: { x: 0, y: 0 }, // Hidden from desktop
    defaultSize: { width: 600, height: 600 },
    contentType: 'component',
    component: ServicesWindow
  },
  pricingWindow: {
    name: 'Pricing',
    icon: '/documents copy.png',
    position: { x: 0, y: 0 }, // Hidden from desktop
    defaultSize: { width: 600, height: 500 },
    contentType: 'component',
    component: PricingWindow
  },
  contactUsWindow: {
    name: 'Contact Us',
    icon: '/phone.png',
    position: { x: 0, y: 0 }, // Hidden from desktop
    defaultSize: { width: 400, height: 500 },
    contentType: 'component',
    component: ContactUsWindow
  },
  // AI Chatbot entry
  basicChatbot: {
    name: 'Basic Chatbot',
    icon: '/90schatbot.png',
    position: { x: 0, y: 0 }, // Hide from desktop
    defaultSize: { width: 400, height: 600 },
    contentType: 'component',
    component: BasicChatbot,
    isResizable: true,
  },
  // Coming Soon entries
  'comingSoon-mario': {
    name: 'Super Mario - Coming Soon',
    icon: '/mario.png',
    position: { x: 0, y: 0 }, // Hidden from desktop
    defaultSize: { width: 400, height: 300 },
    contentType: 'component',
    component: ComingSoon,
  },
  'comingSoon-zelda': {
    name: 'Zelda - Coming Soon',
    icon: '/zelda.png',
    position: { x: 0, y: 0 }, // Hidden from desktop
    defaultSize: { width: 400, height: 300 },
    contentType: 'component',
    component: ComingSoon,
  },
  // External games added via folderItemsData
  'external-pizzadelivery': {
    name: 'Pizza Delivery',
    icon: '/games/pizza-undelivery/icon.png',
    position: { x: 0, y: 0 }, // Hidden from desktop
    defaultSize: { width: 1000, height: 600 },
    contentType: 'iframe',
    url: '/games/pizza-undelivery/index.html'
  },
  'external-streetfighter': {
    name: 'Street Fighter',
    icon: '/games/StreetFighter-main/icon.png',
    position: { x: 0, y: 0 }, // Hidden from desktop
    defaultSize: { width: 1000, height: 600 },
    contentType: 'iframe',
    url: '/games/StreetFighter-main/index.html'
  },
  'external-racer': {
    name: 'Racer',
    icon: '/games/racer/icon.png',
    position: { x: 0, y: 0 }, // Hidden from desktop
    defaultSize: { width: 1000, height: 600 },
    contentType: 'iframe',
    url: '/games/racer/index.html'
  },
  'external-newsmp4': {
    name: 'News.mp4',
    icon: '/promovids.png',
    position: { x: 0, y: 0 }, // Hidden from desktop
    defaultSize: { width: 1000, height: 750 }, // 2.5 times original size
    contentType: 'iframe',
    url: 'https://file.garden/Zxsc5-9aojhlnJO6/news_promo.mp4',
  },
  'external-promomp4': {
    name: 'Promo.mp4',
    icon: '/promovids.png',
    position: { x: 0, y: 0 }, // Hidden from desktop
    defaultSize: { width: 1000, height: 750 }, // 2.5 times original size
    contentType: 'iframe',
    url: 'https://file.garden/Zxsc5-9aojhlnJO6/flashforowarddraft.mp4',
  },
  // AI Tools - Properly defined with their own components
  imageGenerator: {
    name: 'Image Generator',
    icon: '/imagegen.png',
    position: { x: 0, y: 0 }, // Hidden from desktop
    defaultSize: { width: 600, height: 700 },
    contentType: 'component',
    component: ImageGenerator,
    isResizable: true,
  },
  chatbot: {
    name: 'Chatbot',
    icon: '/90schatbot.png',
    position: { x: 0, y: 0 }, // Hidden from desktop
    defaultSize: { width: 500, height: 600 },
    contentType: 'component',
    component: Chatbot,
    isResizable: true,
  },
  voicebot: {
    name: 'Voicebot',
    icon: '/callagent.png',
    position: { x: 0, y: 0 }, // Hidden from desktop
    defaultSize: { width: 500, height: 600 },
    contentType: 'component',
    component: Voicebot,
    isResizable: true,
  },
  gpt90s: {
    name: '90sGPT',
    icon: '/90sgpt.png',
    position: { x: 0, y: 0 }, // Hidden from desktop
    defaultSize: { width: 500, height: 600 },
    contentType: 'component',
    component: GPT90s,
    isResizable: true,
  },
  // Game launchers
  'game-mario': {
    name: 'Super Mario',
    icon: '/mario.png',
    position: { x: 0, y: 0 }, // Hidden from desktop
    defaultSize: { width: 800, height: 650 },
    contentType: 'component',
    component: (props: AppContentProps) => (
      <GameLauncher {...props} gameUrl="/games/mario_js-master/index.html" gameName="Super Mario" />
    ),
    isResizable: true,
  },
  'game-zelda': {
    name: 'Legend of Zelda',
    icon: '/zelda.png',
    position: { x: 0, y: 0 }, // Hidden from desktop
    defaultSize: { width: 800, height: 650 },
    contentType: 'component',
    component: (props: AppContentProps) => (
      <GameLauncher {...props} gameUrl="/games/zelda-js-master/index.html" gameName="Legend of Zelda" />
    ),
    isResizable: true,
  },
  'game-mk-wiki': {
    name: 'Mortal Kombat Wiki',
    icon: '/mortalkombat.png',
    position: { x: 0, y: 0 }, // Hidden from desktop
    defaultSize: { width: 800, height: 650 },
    contentType: 'component',
    component: (props: AppContentProps) => (
      <GameLauncher {...props} gameUrl="/games/MK-Wiki-master/index.html" gameName="Mortal Kombat Wiki" />
    ),
    isResizable: true,
  },
};