import { useGetReservationQuery } from "./reservationApiSlice"
import Room from './Room'

const ReservationList = () => {

    const {
        data: reservation,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetReservationQuery()

    let content

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess) {

        const { ids } = reservation

        const tableContent = ids?.length
            ? ids.map(roomId => <Room key={roomId} roomId={roomId} />)
            : null

        content = (
            <table className="table table--reservation">
                <thead className="table__thead">
                    <tr>
                        <th scope="col" className="table__th room__roomname">Roomname</th>
                        <th scope="col" className="table__th room__roles">Roles</th>
                        <th scope="col" className="table__th room__edit">Edit</th>
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