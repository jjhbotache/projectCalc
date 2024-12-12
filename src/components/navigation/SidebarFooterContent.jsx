import { Bolt, HeartHandshake, HelpCircle, Trash } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { AnimatePresence, motion } from 'framer-motion';

export default function SidebarFooterContent({ onConfig, onDeleteAllProject, onHelp, onSupport, open }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <a href="#settings" onClick={onConfig}>
            <Bolt className="h-5 w-5" />
            <span>Settings</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <AlertDialog>
        <AlertDialogTrigger>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#delete-project">
                <Trash className="h-5 w-5" />
                <span>Delete project</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete project.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDeleteAllProject}>Delete the whole project</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <a href="#help" onClick={onHelp}>
            <HelpCircle className="h-5 w-5" />
            <span>Help</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <a href="#support" onClick={onSupport}>
            <HeartHandshake className="h-5 w-5" />
            <span>Thank me!</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <AnimatePresence>
        {open && (
          <SidebarMenuItem className="mt-auto">
            <motion.p
              className="text-xs text-gray-400 pl-3 pt-3 w-full flex flex-col gap-1 justify-center items-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-gray-500 block basis-full">Created by:</span>
              <div className="flex items-center gap-0.5">
                <a className='underline hover:cursor-pointer' target="_blank" href="https://juanjosehuertas.vercel.app">Juan Jose Huertas Botache</a>
                <a href="https://github.com/jjhbotache" target="_blank" className=" ml-1 inline-grid place-items-end hover:cursor-pointer hover:text-gray-500">
                  <i className="fi fi-brands-github pt-0.5"></i>
                </a>
              </div>
            </motion.p>
          </SidebarMenuItem>
        )}
      </AnimatePresence>
    </SidebarMenu>
  );
}
