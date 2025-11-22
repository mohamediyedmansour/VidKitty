import React from 'react';

import CatWidget from './CatWidget/CatWidget';
import Hero from './Hero/Hero';

const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      <CatWidget />
    </div>
  );
};

export default Home;
