import { useState, useRef, useEffect } from 'react';
import styles from './index.module.scss';

const CustomInputNumber = ({min = 0, max = 10, step = 1, name = '', value = 0, disabled = false, onChange, onBlur, className, ...props}) => {
  const [inputVal, setInputVal] = useState(value);
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const val = parseInt(e.target.value);
    if (val && val >= min && val <= max) {
      setInputVal(val);
    }
  }

  const handleMinus = (e) => {
    e.preventDefault();
    setInputVal((prev) => {
      if (prev - step < min) return min;
      else return prev - step;
    });
  }

  const handlePlus = (e) => {
    e.preventDefault();
    setInputVal((prev) => {
      if (prev + step > max) return max;
      else return prev + step;
    });
  }

  const handleClick = (e) => {
    if (inputRef && inputRef.current) {
      inputRef.current.select();
    }
  }

  const emitOnChange = () => {
    const customEvent = {
      name, value: inputVal
    }
    if (onChange instanceof Function) {
      onChange({ target: customEvent })
    }
  }

  const handleBlur = (e) => {
    emitOnChange();
  }

  useEffect(() => {
    emitOnChange();
  }, [inputVal])

  return (
    <div className={[styles.customInputNumber, className].join(' ')} {...props}>
      <button onClick={handleMinus} disabled={inputVal === min || disabled}>-</button>
      <input type="number"
        ref={inputRef}
        min={min} max={max}
        name={name}
        value={inputVal}
        disabled={disabled}
        onChange={handleChange}
        onClick={handleClick}
        onBlur={handleBlur}
      />
      <button onClick={handlePlus} disabled={inputVal === max || disabled}>+</button>
    </div>
  )
}


export default CustomInputNumber;
