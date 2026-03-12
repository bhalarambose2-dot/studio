import images from './lib/placeholder-images.json';

export const newSeasonDestinations = [
  { 
    name: 'Shimla Snow Resort', 
    city: 'Shimla', 
    image: images.snowResort, 
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
    hint: 'gulmarg gondola', 
    price: 12000,
    rating: 4.9,
    description: 'Experience the magic of Kashmir. Direct access to the worlds highest cable car ride.',
    tag: 'Kashmir Paradise'
  },
];
