import {useState, useEffect, useCallback} from 'react';
import styles from './index.module.scss';
import CustomInputNumber from '../CustomInputNumber';

const RoomAllocation = ({guest = 1, room = 1, onChange, ...props}) => {
  const [total, setTotal] = useState(guest);
  const [remain, setRemain] = useState(0);
  const [rooms, setRooms] = useState([]);
  const roomCapacity = 4;

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
    setTotal(guest);
  }, [guest, room]);

  const handleInputNumChange = useCallback(({ target }, index) => {
    if (rooms.length === 0) return;

    const { value, name } = target;

    let changeRoom = rooms[index];

    // check current room capacity
    const curRoomCapacity = changeRoom.adult + changeRoom.child;
    // get available capacity
    const availableCapacity = roomCapacity - curRoomCapacity;

    if (availableCapacity <= 0 || availableCapacity >= roomCapacity) return;

    const preValue = changeRoom[name];

    let calCapacity = value - preValue;

    if (calCapacity > 0) { // add
      // check global remain
      if (calCapacity > remain) calCapacity = remain;
      // check single room capacity
      if (curRoomCapacity + calCapacity > roomCapacity) {
        calCapacity = availableCapacity;
      }
      changeRoom = { ...changeRoom, [name]: preValue + calCapacity };
    } else if (calCapacity < 0) { // subtract
      if (name === 'adult' && preValue + calCapacity < 1) {
        calCapacity = 1;
        changeRoom = { ...changeRoom, [name]: calCapacity };
      } else if (name === 'child' && preValue + calCapacity < 0) {
        calCapacity = 0;
        changeRoom = { ...changeRoom, [name]: calCapacity };
      } else {
        changeRoom = { ...changeRoom, [name]: preValue + calCapacity };
      }
    }

    if (changeRoom.adult + changeRoom.child >= roomCapacity) {
      changeRoom.disabled = true;
    }

    setRooms((preRooms) => Object.values({...preRooms, [index]: changeRoom}))
  }, [rooms, remain]);

  useEffect(() => {
    let results = [];
    let consumption = 0;
    rooms.forEach(r => {
      const { adult, child, ...rest } = r;
      results.push({ adult, child });
      consumption += adult + child;
    })

    if (onChange instanceof Function) {
      onChange(results);
    }

    setRemain(total - consumption);
  }, [rooms, total])

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
                <div>大人</div>
                <small>年齡 20+</small>
              </div>
              <div className={styles.roomAllocation__listItemInput}>
                <CustomInputNumber
                  value={r.adult} 
                  min={1}
                  disabled={remain <= 0 || r.disabled}
                  name='adult'
                  onChange={e => handleInputNumChange(e, i)}></CustomInputNumber>
              </div>
            </div>
            <div className={styles.roomAllocation__listItemRow}>
              <div className={styles.roomAllocation__listItemTitle}>小孩</div>
              <div className={styles.roomAllocation__listItemInput}>
                <CustomInputNumber
                  value={r.child}
                  min={0}
                  disabled={remain <= 0 || r.disabled}
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