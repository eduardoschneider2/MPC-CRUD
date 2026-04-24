import { useState } from 'react';
import './styles.scss';

export function Tooltip({ content, children, width = 280, position = 'top' }) {
  const [show, setShow] = useState(false);
  const isBottom = position !== 'top';

  return (
    <span
      className="tooltip"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <span
        className="tooltip__btn"
        tabIndex={0}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
      >
        ?
      </span>
      {show && (
        <span
          className="tooltip__popover"
          style={{ [isBottom ? 'top' : 'bottom']: 'calc(100% + 8px)', width }}
        >
          {content}
          <span
            className="tooltip__arrow"
            style={{ [isBottom ? 'top' : 'bottom']: -4 }}
          />
        </span>
      )}
    </span>
  );
}
