import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import PaypalDonateButton from './PaypalDonateButton';

export default function SupportDialog({ open, onOpenChange }) {
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
          <PaypalDonateButton />
        </div>

        <DialogFooter>
          <DialogClose>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}