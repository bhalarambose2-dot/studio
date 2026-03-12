import images from './lib/placeholder-images.json';

export const newSeasonDestinations = [
  { 
    name: 'Shimla Snow Resort', 
    city: 'Shimla', 
    image: images.snowResort, 
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-snowy-mountain-landscape-under-a-clear-blue-sky-42416-large.mp4',
    hint: 'shimla snow', 
    price: 10500,
    rating: 4.5,
    description: 'Classic colonial charm meets winter wonderland. Located on the ridge with panoramic valley views.',
    tag: 'Winter Special'
  },
  { 
    name: 'Auli Ski Lodge', 
    city: 'Auli', 
    image: images.snowResort, 
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-skier-sliding-down-a-snowy-mountain-42417-large.mp4',
    hint: 'auli skiing', 
    price: 11800,
    rating: 4.8,
    description: 'Indias premium skiing destination. Professional instructors and equipment provided with the stay.',
    tag: 'Skiing'
  },
  { 
    name: 'Gulmarg Gondola Inn', 
    city: 'Gulmarg', 
    image: images.snowResort, 
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-coniferous-trees-covered-in-snow-42418-large.mp4',
    hint: 'gulmarg gondola', 
    price: 12000,
    rating: 4.9,
    description: 'Experience the magic of Kashmir. Direct access to the worlds highest cable car ride.',
    tag: 'Kashmir Paradise'
  },
];