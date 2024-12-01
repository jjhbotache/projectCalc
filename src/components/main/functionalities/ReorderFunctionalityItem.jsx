import { Reorder } from 'framer-motion';
import Functionality from './Functionality';
import { useDragControls } from 'framer-motion';

export default function ReorderFunctionalityItem({ functionality, isCollapsed, onToggle }) {
  const controls = useDragControls(); 

  return (
    <Reorder.Item
      key={functionality.id}
      value={functionality}
      dragListener={false}
      dragControls={controls}
      style={{ touchAction: "none" }}
    >
      <Functionality
        functionality={functionality}
        isCollapsed={isCollapsed}
        onToggle={onToggle}
        dragControls={controls} // Pasar controles al hijo
      />
    </Reorder.Item>
  );
}
