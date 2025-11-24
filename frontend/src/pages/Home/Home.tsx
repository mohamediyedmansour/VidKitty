import React from 'react';

import CatWidget from '../../components/CatWidget/CatWidget';
import Hero from '../../components/Hero/Hero';
import Nav from '../../components/Nav/Nav';

const Home: React.FC = () => {
  return (
    <div>
      <Nav />
      <Hero />
      <CatWidget />
    </div>
  );
};

export default Home;
