import React from 'react';
import { Link } from 'react-router-dom';
import { ButtonOne } from '../../../components';

const Error = () => {
  return (
    <div className="flex h-screen items-center justify-center p-4">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-primary dark:text-white">
          404 Error
        </h1>
        <h2 className="mb-8 text-xl font-semibold text-black dark:text-white">
          Sorry, this page is not available!
        </h2>
        <Link to="/">
          <ButtonOne>
            Back to Home
          </ButtonOne>
        </Link>
      </div>
    </div>
  );
};

export default Error;