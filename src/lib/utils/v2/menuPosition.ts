/**
 * Calculates the optimal position for a menu relative to a button element.
 * Ensures the menu stays within viewport bounds while maintaining preferred positioning.
 */
export const calculateMenuPosition = (
  buttonRef: React.RefObject<HTMLElement>,
  menuWidth: number = 210,
  menuHeight: number = 400,
  spacing: number = 8,
  padding: number = 8
): { top: number; left: number } | null => {
  if (!buttonRef.current) return null

  const rect = buttonRef.current.getBoundingClientRect()
  
  // Preferred position: left of button with spacing, vertically aligned with button top
  let left = rect.left - menuWidth - spacing
  let top = rect.top
  
  // Ensure menu stays within viewport bounds
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  
  // Adjust horizontal position to stay in viewport
  // Priority: keep it on the left side if possible
  if (left < padding) {
    // If not enough space on left, shift right just enough to fit
    left = padding
    // If button would overlap with menu, position to the right instead
    if (left + menuWidth + spacing >= rect.left) {
      left = rect.right + spacing
      // Ensure it doesn't go off-screen right
      if (left + menuWidth > viewportWidth - padding) {
        left = viewportWidth - menuWidth - padding
      }
    }
  } else if (left + menuWidth > viewportWidth - padding) {
    // If menu extends beyond right edge, adjust
    left = viewportWidth - menuWidth - padding
    // Ensure button doesn't overlap with menu
    if (left + menuWidth + spacing >= rect.left) {
      left = Math.max(padding, rect.left - menuWidth - spacing)
    }
  }
  
  // Adjust vertical position to stay in viewport while keeping top-aligned with button
  if (top + menuHeight > viewportHeight - padding) {
    top = viewportHeight - menuHeight - padding
    // Ensure button doesn't go below menu
    if (rect.bottom > top + menuHeight + spacing) {
      top = rect.bottom - menuHeight - spacing
    }
  }
  
  // Final check: ensure menu is at least padding pixels from all edges
  left = Math.max(padding, Math.min(left, viewportWidth - menuWidth - padding))
  top = Math.max(padding, Math.min(top, viewportHeight - menuHeight - padding))
  
  return { top, left }
}

