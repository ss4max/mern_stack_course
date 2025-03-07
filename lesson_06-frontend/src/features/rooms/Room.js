import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { selectRoomById } from './roomsApiSlice'

const Room = ({ roomId }) => {
    const room = useSelector(state => selectRoomById(state, roomId))

    const navigate = useNavigate()

    if (room) {
        const handleEdit = () => navigate(`/dash/rooms/${roomId}`)


        const cellStatus = room.active ? '' : 'table__cell--inactive'

        const dates = room.datesOccupied?.length
            ? room.datesOccupied.map(date => new Date(date).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }))
            : null

        const roomDatesString = dates.toString().replaceAll(',', ', ')

        return (
            <tr className="table__row room">
                <td className={`table__cell ${cellStatus}`}>{room.roomName}</td>
                <td className={`table__cell ${cellStatus}`}>{roomDatesString}</td>
                <td className={`table__cell ${cellStatus}`}>
                    <button
                        className="icon-button table__button"
                        onClick={handleEdit}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
        )

    } else return null
}
export default Room