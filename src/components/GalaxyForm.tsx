import React, { useState } from 'react';
import { Play, Square, RefreshCw } from 'lucide-react';
import styles from '../styles/GalaxyControl.module.css';

type FormData = {
  RC: string;
  rival: string;
  planetName: string;
  AttackTime: string;
  DefenceTime: string;
  intervalTime: string;
};

type ButtonState = {
  loading: boolean;
  active: boolean;
  text: string;
};

type ButtonStates = {
  start: ButtonState;
  stop: ButtonState;
  update: ButtonState;
};

type ActionType = keyof ButtonStates;

const GalaxyForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    RC: '',
    rival: '',
    planetName: '',
    AttackTime: '',
    DefenceTime: '',
    intervalTime: ''
  });

  const [buttonStates, setButtonStates] = useState<ButtonStates>({
    start: { loading: false, active: false, text: 'Start' },
    stop: { loading: false, active: false, text: 'Stop' },
    update: { loading: false, active: false, text: 'Update' }
  });

  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAction = async (action: ActionType) => {
    setButtonStates(prev => ({
      ...prev,
      [action]: { ...prev[action], loading: true }
    }));
    setError('');

    try {
      const response = await fetch(`https://5000-bharani77-galaxycodewor-ptj4n5r2xpg.ws-us116.gitpod.io/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setButtonStates(prev => ({
          ...prev,
          [action]: { 
            loading: false, 
            active: true, 
            text: action === 'start' ? 'Running' : action === 'stop' ? 'Stopped' : 'Updated'
          },
          ...(action === 'start' ? { stop: { ...prev.stop, active: false, text: 'Stop' } } : {}),
          ...(action === 'stop' ? { start: { ...prev.start, active: false, text: 'Start' } } : {})
        }));
      } else {
        throw new Error(`Failed to ${action} galaxy`);
      }
    } catch (error) {
      setError(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setButtonStates(prev => ({
        ...prev,
        [action]: { ...prev[action], loading: false, active: false, text: action }
      }));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.stars}></div>
      <div className={styles.nebula}></div>
      <h1 className={styles.title}>
        <span className={styles.kickLock}>KICK-LOCK</span> 
      </h1>
      
      <div className={styles.formContainer}>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        
        <form className={styles.form}>
          <div className={styles.inputRow}>
            {(Object.keys(formData) as Array<keyof FormData>).map((key) => (
              <div key={key} className={styles.inputGroup}>
                <label className={styles.label}>
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  type={['AttackTime', 'DefenceTime', 'intervalTime'].includes(key) ? 'number' : 'text'}
                  name={key}
                  value={formData[key]}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>
            ))}
          </div>
          
          <div className={styles.buttonGroup}>
            {(['start', 'stop', 'update'] as const).map((action) => (
              <button
                key={action}
                type="button"
                onClick={() => handleAction(action)}
                className={`${styles.button} 
                  ${buttonStates[action].loading ? styles.loadingButton : ''} 
                  ${buttonStates[action].active ? 
                    (action === 'start' ? styles.buttonRunning : 
                     action === 'stop' ? styles.buttonStopped : 
                     styles.buttonUpdated) : ''
                  }`}
                disabled={buttonStates[action].loading}
              >
                {action === 'start' && <Play size={16} />}
                {action === 'stop' && <Square size={16} />}
                {action === 'update' && <RefreshCw size={16} />}
                <span className={styles.loadingText}>
                  {buttonStates[action].loading ? `${action}...` : buttonStates[action].text}
                </span>
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
};

export default GalaxyForm;