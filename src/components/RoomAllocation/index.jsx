import {useState, useEffect, useCallback} from 'react';
import styles from './index.module.scss';
import CustomInputNumber from '../CustomInputNumber';

const RoomAllocation = ({guest = 1, room = 1, onChange, ...props}) => {
  const [total, setTotal] = useState(guest);
  const [remain, setRemain] = useState(guest);
  const [allocated, setAllocated] = useState(0);
  const [rooms, setRooms] = useState([]);
  const roomCapacity = 4;

  useEffect(() => {
    setRemain(total - allocated);
  }, [allocated, total])

  useEffect(() => {
    let consumption = 0;
    let allocateRooms = [];
    for (let i = 0; i < room; i++) {
      allocateRooms.push({
        adult: 1,
        child: 0,
        disabled: false,
      })
      consumption++;
      if (consumption >= guest) break;
    }
    setRooms(allocateRooms);
    setAllocated(consumption);
  }, [])

  const handleInputNumChange = useCallback(({ target }, index) => {
    if (rooms.length === 0) return;

    const { value, name } = target;

    let changeRoom = rooms[index];
    let diff = 0;
    if (name === 'adult') {
      diff = value - changeRoom.adult;
      changeRoom = { ...changeRoom, adult: value };
    } else if (name === 'child') {
      diff = value - changeRoom.child;
      changeRoom = { ...changeRoom, child: value};
    }

    if (changeRoom.adult + changeRoom.child >= roomCapacity) {
      changeRoom.disabled = true;
    }

    setAllocated(prev => prev + diff);
    setRooms((prevRooms) => Object.values({...prevRooms, [index]: changeRoom}))
  }, [rooms])


  useEffect(() => {
    if (onChange instanceof Function) {
      let results = [];
      rooms.forEach(r => {
        const { adult, child, ...rest } = r;
        results.push({ adult, child });
      })
      onChange(results);
    }
  }, [rooms, onChange]);

  return (
    <div className={styles.roomAllocation}>
      <div className={styles.roomAllocation__header}>住客人數: {total}人 / {rooms.length}房</div>
      <div className={styles.roomAllocation__remain}>尚未分配人數: {remain}人</div>

      <ul className={styles.roomAllocation__list}>
        {rooms.map((r, i) => (
          <li key={i} className={styles.roomAllocation__listItem}>
            <div>房間: {r.adult + r.child}人</div>
            <div className={styles.roomAllocation__listItemRow}>
              <div className={styles.roomAllocation__listItemTitle}>
                大人<small>年齡 20+</small>
              </div>
              <div className={styles.roomAllocation__listItemInput}>
                <CustomInputNumber
                  value={r.adult} 
                  min={1}
                  disabled={remain === 0 || r.disabled}
                  name='adult'
                  onChange={e => handleInputNumChange(e, i)}></CustomInputNumber>
              </div>
            </div>
            <div className={styles.roomAllocation__listItemRow}>
              <div className={styles.roomAllocation__listItemTitle}>小孩</div>
              <div className={styles.roomAllocation__listItemInput}>
                <CustomInputNumber
                  value={r.child}
                  disabled={remain === 0 || r.disabled}
                  name='child'
                  onChange={e => handleInputNumChange(e, i)}></CustomInputNumber>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RoomAllocation;