import React, { useState, useEffect, useRef } from 'react'; // Added useRef
import { useSelector } from 'react-redux';
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

const ChatDialog = ({ open, onClose }) => {
  const { sendMessage } = useGemini();
  const chatHistory = useSelector((state) => state.chat.history);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null); // State for error messages
  const messagesEndRef = useRef(null); // Added ref

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]); // Added useEffect to scroll

  const handleSend = async () => {
    if (message.trim()) {
      try {
        await sendMessage(message);
        setMessage('');
        setError(null); // Clear any existing errors
      } catch (err) {
        setError('Failed to send message. Please try again.');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose} className="max-h-[90%]">
      <DialogContent >
        <DialogHeader>
          <DialogTitle>Chat</DialogTitle>
            <DialogDescription >
                Chat with the bot to get help with your project.
            </DialogDescription>
        </DialogHeader>
        {/* Display chat messages */}
        <div className="max-h-80 overflow-y-auto break-words">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded-lg ${msg.role === 'user' 
                ? 'text-right bg-slate-400 ms-28'
                : 'text-left bg-gray-600 mr-28'
            }`}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown> {/* Replaced <p> with ReactMarkdown */}
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* Added div for scrolling */}
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>} {/* Display error */}
        <DialogFooter>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="mr-2"
          />
          <Button onClick={handleSend}>Send</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;
