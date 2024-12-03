import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useEffect } from 'react';

export default function SupportDialog({ open, onOpenChange }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://www.paypalobjects.com/donate/sdk/donate-sdk.js";
    script.charset = "UTF-8";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      PayPal.Donation.Button({
        env: 'production',
        hosted_button_id: 'CC2RQ3PW3K8UN',
        image: {
          src: 'https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif',
          alt: 'Donate with PayPal button',
          title: 'PayPal - The safer, easier way to pay online!',
        }
      }).render('#donate-button');
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Support</DialogTitle>
          <DialogDescription>
            This site took a lot of hard work to build. If you have found it useful, we would greatly appreciate your support.
          </DialogDescription>
        </DialogHeader>
        
        {/* Buy me a coffee */}
        <a href="https://www.buymeacoffee.com/jjhbotache" target='_blank' rel="noopener noreferrer">
          <img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=jjhbotache&button_colour=FFDD00&font_colour=000000&font_family=Lato&outline_colour=000000&coffee_colour=ffffff" alt="Buy me a coffee" />
        </a>

        {/* PayPal Donate Button */}
        <div id="donate-button-container">
          <div id="donate-button"></div>
        </div>

        <DialogFooter>
          <DialogClose>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}