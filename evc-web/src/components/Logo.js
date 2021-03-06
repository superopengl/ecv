
import React from 'react';
import { Link } from 'react-router-dom';

export const Logo = () =>
  <Link to="/">
    <div style={{
      marginLeft: 'auto',
      marginRight:'auto',
      backgroundImage: `url('/images/logo-transparent.png')`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      width: 64,
      height: 64,
      borderRadius: 4,
      cursor: 'pointer',
    }}></div>
  </Link>