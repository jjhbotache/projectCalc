import React, { useState, useEffect, useRef } from 'react'; // Added useRef
import { useSelector, useDispatch } from 'react-redux'; // Ensure useDispatch is imported
import useGemini from '../hooks/useGemini';
import ReactMarkdown from 'react-markdown'; // Added import
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'; // Import shadcn dialog components
import { Button } from '@/components/ui/button'; // Import shadcn Button component
import { Input } from '@/components/ui/input'; // Import shadcn Input component
import { DialogDescription } from '@radix-ui/react-dialog';
import { resetChat } from '../slices/chatSlice'; // Import resetChat
import { LoaderCircle, RotateCcw } from 'lucide-react';

const ChatDialog = ({ open, onClose }) => {
  const { sendMessage } = useGemini();
  const chatHistory = useSelector((state) => state.chat.history);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null); // Added ref
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const dispatch = useDispatch(); // Initialize dispatch

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]); // Added useEffect to scroll

  const handleSend = async () => {
    setMessage('');
    if (message.trim()) {
      try {
        setIsLoading(true); // Start loading
        await sendMessage(message);
        
      } catch (err) {
        console.log ('Failed to send message. Please try again.');
      } finally {
        setIsLoading(false); // End loading
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose} >
      <DialogContent className="h-[98%]">
        <DialogHeader>
          <DialogTitle>Chat</DialogTitle>
          <DialogDescription>
            Chat with the bot to get help with your project.
          </DialogDescription>
        </DialogHeader>
        {/* Display chat messages */}
        <div className="h-full min-h-96 border border-white rounded-md overflow-y-auto flex flex-col">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 px-3 flex ${msg.role === 'user' 
                ? 'self-end   w-auto max-w-xs'
                : 'self-start  w-auto max-w-xs'
            }`}
            >
              <ReactMarkdown
              className={`text-sm p-2 rounded-lg break-words ${msg.role === 'user' 
                ? 'bg-zinc-200 dark:bg-zinc-700 '
                : 'bg-gray-200  dark:bg-gray-700'}`} 
              >{msg.text}</ReactMarkdown> {/* Replaced <p> with ReactMarkdown */}
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* Added div for scrolling */}
        </div>
        <DialogFooter>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="mr-2"
          />
          {isLoading 
          ?<LoaderCircle size={16} className="spin" /> 
          :<Button onClick={handleSend}>Send</Button>}
          <Button onClick={() => dispatch(resetChat())} className="ml-2 p-1">
            <RotateCcw size={16} className="" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;
