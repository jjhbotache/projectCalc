import { Reorder } from 'framer-motion';
import Functionality from './Functionality';
import { useDragControls } from 'framer-motion';

export default function ReorderFunctionalityItem({
  functionality,
  isCollapsed,
  onToggle,
  dragEnabled,
}) {

  return dragEnabled ? (
    <Reorder.Item
      key={functionality.id}
      value={functionality}
      style={{ touchAction: 'none' }}
    >
      <Functionality
        functionality={functionality}
        isCollapsed={isCollapsed}
        onToggle={onToggle}
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
