import React from 'react';
import './TutorialDialog.css';

interface Props {
    isVisible: boolean;
    onDismiss: () => void;
    onDontShowAgain: () => void;
    isMobile: boolean;
}

const TutorialDialog: React.FC<Props> = ({ isVisible, onDismiss, onDontShowAgain, isMobile }) => {
    const [dontShow, setDontShow] = React.useState(false);

    const handleGotIt = () => {
        if (dontShow) {
            onDontShowAgain();
        } else {
            onDismiss();
        }
    };

    if (!isVisible) return null;

    return (
        <div className="tutorial-overlay" onClick={handleGotIt}>
            <div className="tutorial-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="tutorial-icon">
                    {isMobile ? '📱' : '🖱️'}
                </div>
                
                <h2 className="tutorial-title">
                    {isMobile ? 'Drag to Organize!' : 'Drag & Drop Tasks'}
                </h2>
                
                <p className="tutorial-message">
                    {isMobile 
                        ? 'Hold and drag the six dots (≡) to move items between Active and Completed lists, or reorder them within a list.'
                        : 'Click and drag the handle (≡) to reorder items or move them between Active and Completed lists.'
                    }
                </p>

                <div className="tutorial-visual">
                    <div className="drag-handle-demo">
                        <span className="demo-handle">≡</span>
                        <span className="demo-text">Sample Task</span>
                    </div>
                    <div className="tutorial-arrow">→</div>
                    <div className="tutorial-hint">
                        {isMobile ? 'Hold & Drag' : 'Click & Drag'}
                    </div>
                </div>

                <div className="tutorial-checkbox">
                    <label>
                        <input 
                            type="checkbox" 
                            checked={dontShow}
                            onChange={(e) => setDontShow(e.target.checked)}
                        />
                        <span>Don't show this again</span>
                    </label>
                </div>

                <button className="tutorial-button" onClick={handleGotIt}>
                    Got it!
                </button>
            </div>
        </div>
    );
};

export default TutorialDialog;