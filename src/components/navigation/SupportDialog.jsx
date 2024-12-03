import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import PaypalDonateButton from './PaypalDonateButton';
import GitHubButton from 'react-github-btn'

export default function SupportDialog({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thank me!</DialogTitle>
          <DialogDescription>
            DevKalk <strong>took a lot of hard work to build.</strong> If you have found it useful, I would greatly appreciate your support!.
            <br /><br />
            You can support me by buying me a coffee, donating through PayPal or sponsoring me on GitHub, but <strong>don't feel obligated to do so,</strong> you can also support me by starring the project on GitHub, following me on Github or sending me a message with your feedback!.
            <br />
            :D
          </DialogDescription>
        </DialogHeader>
        

        <div className="flex flex-wrap-reverse gap-2">
          <div className="min-w-44 flex-1 flex-col justify-center">
            <h1 className='text-2xl text-center mb-1' >Sponsor me!</h1>
            <hr className='pb-3 ' />
            {/* Buy me a coffee */}
            <div className="flex justify-center p-2">
              <a href="https://www.buymeacoffee.com/jjhbotache" target='_blank' rel="noopener noreferrer" className='mx-auto'> 
                <img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=jjhbotache&button_colour=FFDD00&font_colour=000000&font_family=Lato&outline_colour=000000&coffee_colour=ffffff" alt="Buy me a coffee" />
              </a>
            </div>

            {/* PayPal Donate Button */}
            <div id="donate-button-containe">
              <PaypalDonateButton />
            </div>

            {/* sponsor through github */}
            <div className="flex justify-center p-2">
              <GitHubButton
              href="https://github.com/sponsors/jjhbotache" data-color-scheme="no-preference: dark_dimmed; light: light; dark: dark_dimmed;" data-icon="octicon-heart" data-size="large" aria-label="Sponsor @jjhbotache on GitHub">Sponsor</GitHubButton>
            </div>
          </div>
          <div className="min-w-44 flex-1 flex-col justify-center">
            <h1 className='text-2xl text-center mb-1' >Free help!</h1>
            <hr className='pb-3 ' />
            <div className="flex justify-center p-2">
              <GitHubButton href="https://github.com/jjhbotache/projectCalc" data-color-scheme="no-preference: dark_dimmed; light: light; dark: dark_dimmed;" data-icon="octicon-star" data-size="large" aria-label="Star jjhbotache/projectCalc on GitHub">Star</GitHubButton>
            </div>

            <div className="flex justify-center p-2">
              <GitHubButton href="https://github.com/jjhbotache" data-color-scheme="no-preference: dark_dimmed; light: light; dark: dark_dimmed;" data-size="large" aria-label="Follow @jjhbotache on GitHub">Follow @jjhbotache</GitHubButton>
            </div>
          </div>

        </div>




        <DialogFooter>
          <DialogClose>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}