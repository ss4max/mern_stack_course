import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { selectReservationById } from './reservationsApiSlice'

const Reservation = ({ reservationId }) => {
    const reservation = useSelector(state => selectReservationById(state, reservationId))

    const navigate = useNavigate()

    if (reservation) {
        const handleEdit = () => navigate(`/dash/reservations/${reservationId}`)

        const cellStatus = reservation.active ? '' : 'table__cell--inactive'

        const formatCheckInDate = new Date(reservation.checkInDate).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })

        return (
            <tr className="table__row reservation">
                <td className={`table__cell ${cellStatus}`}>{reservation.guest.name}</td>
                <td className={`table__cell ${cellStatus}`}>{formatCheckInDate}</td>
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
export default Reservation