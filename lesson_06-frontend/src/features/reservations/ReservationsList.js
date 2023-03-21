import { useGetReservationsQuery } from "./reservationsApiSlice"
import Reservation from '../reservations/Reservation'

const ReservationList = () => {

    const {
        data: reservation,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetReservationsQuery()

    let content

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess) {

        const { ids } = reservation

        const tableContent = ids?.length
            ? ids.map(reservationId => <Reservation key={reservationId} reservationId={reservationId} />)
            : null

        content = (
            <table className="table table--reservation">
                <thead className="table__thead">
                    <tr>
                        <th scope="col" className="table__th reservation__reservationname">Reservation Name</th>
                        <th scope="col" className="table__th reservation__roles">Check In Date</th>
                        <th scope="col" className="table__th reservation__edit">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
        )
    }

    return content
}
export default ReservationList