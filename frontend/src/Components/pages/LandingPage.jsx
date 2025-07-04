import React from 'react';
import Barchart from '../compos/Dashboard_compos/Barchart';
import Tabs from '../compos/Dashboard_compos/Tabs';

function LandingPage() {
  return (
    <div className="flex-1 h-screen overflow-y-auto p-4">
      <div className="mb-4">
        <Barchart />
      </div>
      <div>
        <Tabs />
      </div>
    </div>
  );
}

export default LandingPage;