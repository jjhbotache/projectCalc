import { Reorder } from 'framer-motion';
import Functionality from './Functionality';
import { useDragControls } from 'framer-motion';

export default function ReorderFunctionalityItem({
  functionality,
  isCollapsed,
  onToggle,
  dragEnabled,
}) {
  const controls = useDragControls();

  return dragEnabled ? (
    <Reorder.Item
      key={functionality.id}
      value={functionality}
      dragListener={false}
      dragControls={controls}
      style={{ touchAction: 'none' }}
    >
      <Functionality
        functionality={functionality}
        isCollapsed={isCollapsed}
        onToggle={onToggle}
        dragControls={controls} // Pass controls to Functionality
        dragEnabled={dragEnabled}
      />
    </Reorder.Item>
  ) : (
    <Functionality
      functionality={functionality}
      isCollapsed={isCollapsed}
      onToggle={onToggle}
      dragEnabled={dragEnabled}
    />
  );
}
