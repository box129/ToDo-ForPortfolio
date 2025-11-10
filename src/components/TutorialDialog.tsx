import React, { useEffect, useRef, useState } from 'react';
import './TutorialDialog.css';

interface Props {
    isVisible: boolean;
    onDismiss: () => void;
    onDontShowAgain: () => void;
    isMobile: boolean;
    targetRef?: React.RefObject<HTMLElement | null>;
}

const TutorialDialog: React.FC<Props> = ({ isVisible, onDismiss, onDontShowAgain, isMobile, targetRef }) => {
    const [dontShow, setDontShow] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isVisible && targetRef?.current && tooltipRef.current) {
            const targetRect = targetRef.current.getBoundingClientRect();
            const tooltipRect = tooltipRef.current.getBoundingClientRect();
            
            // Position tooltip to the right on desktop, below on mobile
            if (isMobile) {
                setPosition({
                    top: targetRect.bottom + 10,
                    left: Math.max(16, Math.min(
                        targetRect.left,
                        window.innerWidth - tooltipRect.width - 16
                    ))
                });
            } else {
                setPosition({
                    top: targetRect.top,
                    left: targetRect.right + 20
                });
            }
        }
    }, [isVisible, targetRef, isMobile]);

    const handleGotIt = () => {
        if (dontShow) {
            onDontShowAgain();
        } else {
            onDismiss();
        }
    };

    if (!isVisible) return null;

    return (
        <>
            <div className="tutorial-backdrop" onClick={handleGotIt} />
            <div 
                ref={tooltipRef}
                className={`tutorial-tooltip ${isMobile ? 'mobile' : 'desktop'}`}
                style={{
                    top: `${position.top}px`,
                    left: `${position.left}px`,
                }}
            >
                <div className="tutorial-tooltip-arrow" />
                
                <div className="tutorial-tooltip-content">
                    <div className="tutorial-header">
                        <span className="tutorial-emoji">{isMobile ? '👆' : '🖱️'}</span>
                        <h3 className="tutorial-tooltip-title">
                            {isMobile ? 'Drag to Move!' : 'Drag & Drop'}
                        </h3>
                    </div>
                    
                    <p className="tutorial-tooltip-message">
                        {isMobile 
                            ? 'Hold the six dots (≡) to drag items between lists or reorder them.'
                            : 'Click and drag the handle (≡) to reorder or move items between lists.'
                        }
                    </p>

                    <div className="tutorial-tooltip-checkbox">
                        <label>
                            <input 
                                type="checkbox" 
                                checked={dontShow}
                                onChange={(e) => setDontShow(e.target.checked)}
                            />
                            <span>Don't show again</span>
                        </label>
                    </div>

                    <button className="tutorial-tooltip-button" onClick={handleGotIt}>
                        Got it!
                    </button>
                </div>
            </div>
        </>
    );
};

export default TutorialDialog;