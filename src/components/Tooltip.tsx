// TODO: Replace with Popover so it works on touch screens
import {
  Button,
  TooltipTrigger,
  OverlayArrow,
  Tooltip as AriaTooltip,
  TooltipProps as AriaTooltipProps,
} from 'react-aria-components';

import './Tooltip.css';

interface TooltipProps extends Omit<AriaTooltipProps, 'children'> {
  children: React.ReactNode;
  content: React.ReactNode | string;
}

// prop documentation: https://react-spectrum.adobe.com/react-aria/Tooltip.html#tooltip-1
const Tooltip = ({
  children,
  content,
  wrapInteractive = true,
  ...tooltipProps
}: TooltipProps & {
  tooltipPlacement?: AriaTooltipProps['placement'];
  wrapInteractive?: boolean;
}) => {
  // trigger must use a react-aria Button to function
  // by default we wrap the trigger is a hidden button element
  const trigger = wrapInteractive ? (
    <Button className={'tooltip-trigger-button'}>{children}</Button>
  ) : (
    children
  );

  return (
    <TooltipTrigger delay={800} closeDelay={200}>
      {trigger}

      <AriaTooltip {...tooltipProps}>
        {content}

        <OverlayArrow>
          <svg width={12} height={12} viewBox="0 0 8 8">
            <path d="M0 0 L4 4 L8 0" />
          </svg>
        </OverlayArrow>
      </AriaTooltip>
    </TooltipTrigger>
  );
};

export default Tooltip;
