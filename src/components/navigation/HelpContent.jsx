import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';

function HelpContent({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" aria-describedby="help">
        <DialogHeader>
          <DialogTitle>Help Guide</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-sm">
          <section>
            <h3 className="font-bold mb-2">Introduction</h3>
            <p>This is a software project calculator that helps developers create customized quotations. It features AI-powered estimations and can be personalized for each developer's needs.</p>
          </section>

          <section>
            <h3 className="font-bold mb-2">Left Panel</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>Functionalities list (clickable to navigate)</li>
              <li>Developer settings:
                <ul className="list-disc pl-4">
                  <li>Technology stack</li>
                  <li>Hourly rate</li>
                  <li>Hours per day</li>
                  <li>Days per week</li>
                </ul>
              </li>
              <li>Project deletion option</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold mb-2">Header</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>Project title</li>
              <li>Quotation settings:
                <ul className="list-disc pl-4">
                  <li>Project name</li>
                  <li>Description</li>
                  <li>Technologies used</li>
                </ul>
              </li>
              <li>Actions:
                <ul className="list-disc pl-4">
                  <li>Export PDF quotation</li>
                  <li>Import/Export JSON</li>
                  <li>AI-powered project editing</li>
                  <li>Theme toggle</li>
                  <li>Project chat</li>
                </ul>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold mb-2">Functionalities</h3>
            <p>Each functionality includes:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Name</li>
              <li>Delete button</li>
              <li>AI-powered editing</li>
              <li>Expand/collapse tasks</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold mb-2">Tasks</h3>
            <p>For each task you can:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Edit name</li>
              <li>Set hours</li>
              <li>Toggle billing status</li>
              <li>Delete task</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold mb-2">Summary</h3>
            <p>Provides final overview including:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Total project duration</li>
              <li>Labor costs</li>
              <li>Monthly costs</li>
            </ul>
          </section>
        </div>
        
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}

export default HelpContent;
