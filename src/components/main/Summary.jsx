import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Copy, Check, ChevronUp, CalendarRange, Cpu, SquareCode, CircleDollarSign, DollarSign, Timer } from 'lucide-react';
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from "@/components/ui/dialog"; // Import Dialog components
import { calculateTotals } from '../../utils/calculate';



export default function Summary() { // Removed props
  const dispatch = useDispatch();
  const project = useSelector(state => state.project); // Access redux state
  const config = useSelector((state) => state.config);
  const [maintenanceCost, setMaintenanceCost] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false); // State for Drawer
  const [isDialogOpen, setDialogOpen] = useState(false); // State for Dialog

  const copyJsonStructure = () => {
    navigator.clipboard.writeText(jsonStructure);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totals = calculateTotals(project, config); 
  
  
  return (  
    <div className="fixed mt-auto z-10 bottom-0 h-auto w-full flex justify-center shadow-lg">

      <Drawer open={isDrawerOpen} onOpenChange={setDrawerOpen}>

        <DrawerTrigger asChild className="dark:bg-gray-900 bg-slate-200 dark:text-white text-black bottom-0 mb-0 pb-0 h-auto rounded-t-full w-56 ">
          <div className='h-full flex flex-col items-center justify-center'>
            <ChevronUp size={16} />
            <small>Summary</small>
          </div>
        </DrawerTrigger>

        <DrawerContent className="p-3 gap-2">
          <DialogTitle>Project Summary</DialogTitle>
          <DialogDescription>
            The project will cost {totals.projectCost.toFixed(2)} in total and will take {totals.days.toFixed(0)} days to complete.
          </DialogDescription>
          <div className="flex flex-col gap-4 my-12">
            
            
            <div className="flex items-center">
              <SquareCode />
              <p className="ml-2">Total Labor Cost: {totals.laborCost.toFixed(2)}</p>
            </div>
            <div className="flex items-center">
              <Timer />
              <p className="ml-2">Total Hours of job: {totals.hours.toFixed(0)}</p>
            </div>

            <hr className='w-5/12 border-gray-400'/>

            <div className="flex items-center">
              <CalendarRange />
              <p className="ml-2">Total Days: {totals.days.toFixed(1)}</p>
            </div>
            <div className="flex items-center">
              <CalendarRange />
              <p className="ml-2">Total Months: {(totals.days / 30).toFixed(1)}</p>
            </div>
            <div className="flex items-center">
              <Cpu />
              <p className="ml-2">Total Tech Cost: {totals.techCost.toFixed(2)}</p>
            </div>
            <div className="flex items-center">
              <CircleDollarSign />
              <p className="ml-2">Total Monthly Cost: {totals.monthlyCost.toFixed(2)}</p>
            </div>
            <div className="flex items-center">
              <DollarSign />
              <p className="ml-2">Total Project Cost: {totals.projectCost.toFixed(2)}</p>
            </div>





          </div>
          
        </DrawerContent>

      </Drawer>

    </div>
  );
}