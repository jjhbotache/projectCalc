import React, { useEffect } from 'react';

const PaypalDonateButton = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.paypalobjects.com/donate/sdk/donate-sdk.js';
    script.charset = 'UTF-8';
    script.onload = () => {
      if (window.PayPal && document.querySelectorAll('#donate-button').length<=1) {
        window.PayPal.Donation.Button({
          env: 'production',
          hosted_button_id: 'CC2RQ3PW3K8UN',
          image: {
            src: 'https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif',
            alt: 'Donate with PayPal button',
            title: 'PayPal - The safer, easier way to pay online!',
          },
        }).render('#donate-button');
      }
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      document.body.removeChild(script);
    };
  }, []);

  return <div id="donate-button" className='flex justify-center p-2' />;
};

export default PaypalDonateButton;
